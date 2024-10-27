import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, Subject, BehaviorSubject, from } from 'rxjs';
import { retryWhen, delay, take, catchError, tap, filter, switchMap } from 'rxjs/operators';
import { io, Socket } from 'socket.io-client';
import { API_ROUTES, SOCKET_URL } from '../../../../../../config/api-routes';
import { AuthService } from '../../../../../login/components/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  // Track socket instance
  private socket!: Socket;
  private authToken: string;
  // Subjects for internal state management
  private messageSubject = new Subject<any>();
  private connectionStatus = new BehaviorSubject<boolean>(false);
  // Track connection promise to prevent multiple simultaneous connection attempts
  private connectionPromise: Promise<void> | null = null;
  private currentProjectId: string | null = null;
  
  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {
    this.authToken = this.authService.getAuthToken() || '';
    // Initialize socket connection on service creation
    this.initializeSocketConnection();

    // Listen for auth token changes and reconnect when it changes
    this.authService.authToken$.subscribe(token => {
      this.authToken = token || '';
      this.reconnectSocket(); // Reconnect with new token
    });
  }

  // Initialize socket connection with proper error handling
  private async initializeSocketConnection(): Promise<void> {
    // Return existing promise if connection is in progress
    if (this.connectionPromise) {
      return this.connectionPromise;
    }

    // Create new connection promise
    this.connectionPromise = new Promise((resolve, reject) => {
      try {
        // Initialize socket with retry options
        this.socket = io(SOCKET_URL, {
          auth: { token: this.authToken },
          reconnection: true,
          reconnectionAttempts: 5,
          reconnectionDelay: 1000
        });

        // Setup socket event listeners
        this.setupSocketListeners(resolve, reject);
      } catch (error) {
        reject(error);
        this.connectionPromise = null;
      }
    });

    return this.connectionPromise;
  }

  // Separate method for socket event listeners to improve readability
  private setupSocketListeners(resolve: () => void, reject: (error: any) => void) {
    this.socket.on('connect', () => {
      console.log('Socket connected successfully');
      this.connectionStatus.next(true);
      resolve();
    });

    this.socket.on('disconnect', () => {
      console.log('Socket disconnected');
      this.connectionStatus.next(false);
    });

    this.socket.on('error', (error) => {
      console.error('Socket error:', error);
      this.connectionStatus.next(false);
      reject(error);
    });

    this.socket.on('new-message', (message: any) => {
      this.messageSubject.next(message);
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      this.connectionStatus.next(false);
      reject(error);
    });
  }

  // Safely reconnect socket
  private async reconnectSocket() {
    if (this.socket) {
      this.socket.disconnect();
    }
    this.connectionPromise = null; // Reset connection promise
    await this.initializeSocketConnection();
  }

  // Public method to ensure connection is established
  async ensureConnection(): Promise<void> {
    if (this.socket?.connected) {
      return Promise.resolve();
    }
    return this.initializeSocketConnection();
  }

  // Get messages with connection handling and retries
  getMessages(projectId: string): Observable<any[]> {
    return from(this.ensureConnection()).pipe(
      catchError(error => {
        console.error('Failed to ensure connection:', error);
        return throwError(() => error);
      }),
      // Use switchMap to properly chain the HTTP request
      switchMap(() => {
        console.log('Connection ensured, fetching messages');
        return this.http.get<any[]>(
          API_ROUTES.CHAT.GET_MESSAGES.replace(':projectId', projectId),
          {
            headers: new HttpHeaders({
              'Authorization': `Bearer ${this.authToken}`,
              'socket-id': this.socket?.id || ''
            })
          }
        );
      }),
      // Add error handling for the HTTP request
      catchError(error => {
        console.error('Error fetching messages:', error);
        return throwError(() => error);
      })
    );
  }

  // Join chat with connection handling
  joinChat(projectId: string): Observable<any> {
    return from(this.ensureConnection()).pipe(
      catchError(error => {
        console.error('Failed to ensure connection for join:', error);
        return throwError(() => error);
      }),
      delay(100),
      tap(() => {
        if (!this.socket?.connected) {
          throw new Error('Socket still not connected after ensure');
        }
      }),
      take(1),
      tap(() => {
        const userId = this.authService.getUserId();
        if (!userId) {
          throw new Error('User not authenticated');
        }
        this.socket.emit('join-project', { projectId, userId });
      })
    );
  }

  // Send message with connection check
  sendMessage(projectId: string, message: string): Observable<any> {
    if (!this.socket?.connected) {
      return throwError(() => new Error('Socket not connected'));
    }

    const payload = {
      message,
      projectId,
      userId: this.authService.getUserId(),
      socketId: this.socket.id
    };

    return this.http.post<any>(
      API_ROUTES.CHAT.SEND_MESSAGE.replace(':projectId', projectId),
      payload,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.authToken}`,
          'socket-id': this.socket.id || ''
        })
      }
    );
  }

  // Leave chat safely
  leaveChat(projectId: string) {
    if (this.socket?.connected) {
      this.socket.emit('leave-project', projectId);
    }
  }

  // Public methods for state observation
  onNewMessage(): Observable<any> {
    return this.messageSubject.asObservable();
  }

  getConnectionStatus(): Observable<boolean> {
    return this.connectionStatus.asObservable();
  }

  // Cleanup method
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
    this.connectionPromise = null;
  }
}