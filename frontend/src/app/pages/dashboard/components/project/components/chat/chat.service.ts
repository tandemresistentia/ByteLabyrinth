// chat.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, Subject, BehaviorSubject, from } from 'rxjs';
import { filter, switchMap, catchError } from 'rxjs/operators';
import { io, Socket } from 'socket.io-client';
import { API_ROUTES, SOCKET_URL } from '../../../../../../config/api-routes';
import { AuthService } from '../../../../../../config/auth.service';

interface ChatMessage {
  projectId: string;
  message: string;
  user: any;
  timestamp: Date;
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private socket!: Socket;
  private authToken: string;
  // Changed to handle project-specific messages
  private messageSubject = new Subject<ChatMessage>();
  private connectionStatus = new BehaviorSubject<boolean>(false);
  private connectionPromise: Promise<void> | null = null;
  // Track current project subscription
  private currentProjectId: string | null = null;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {
    this.authToken = this.authService.getAuthToken() || '';
    this.initializeSocketConnection();

    this.authService.authToken$.subscribe(token => {
      this.authToken = token || '';
      this.reconnectSocket();
    });
  }

  private async initializeSocketConnection(): Promise<void> {
    if (this.connectionPromise) {
      return this.connectionPromise;
    }

    this.connectionPromise = new Promise((resolve, reject) => {
      try {
        this.socket = io(SOCKET_URL, {
          auth: { token: this.authToken },
          reconnection: true,
          reconnectionAttempts: 5,
          reconnectionDelay: 1000
        });

        this.setupSocketListeners(resolve, reject);
      } catch (error) {
        reject(error);
        this.connectionPromise = null;
      }
    });

    return this.connectionPromise;
  }

  private setupSocketListeners(resolve: () => void, reject: (error: any) => void) {
    this.socket.on('connect', () => {
      this.connectionStatus.next(true);
      // Rejoin current project chat if exists
      if (this.currentProjectId) {
        this.joinChat(this.currentProjectId).subscribe();
      }
      resolve();
    });

    this.socket.on('disconnect', () => {
      this.connectionStatus.next(false);
    });

    this.socket.on('error', (error) => {
      console.error('Socket error:', error);
      this.connectionStatus.next(false);
      reject(error);
    });

    // Handle project-specific messages
    this.socket.on('new-message', (message: ChatMessage) => {
      if (message.projectId === this.currentProjectId) {
        this.messageSubject.next(message);
      }
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      this.connectionStatus.next(false);
      reject(error);
    });
  }

  private async reconnectSocket() {
    if (this.socket) {
      this.socket.disconnect();
    }
    this.connectionPromise = null;
    await this.initializeSocketConnection();
  }

  async ensureConnection(): Promise<void> {
    if (this.socket?.connected) {
      return Promise.resolve();
    }
    return this.initializeSocketConnection();
  }

  getMessages(projectId: string): Observable<any[]> {
    return from(this.ensureConnection()).pipe(
      switchMap(() => {
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
      catchError(error => {
        console.error('Error fetching messages:', error);
        return throwError(() => error);
      })
    );
  }

  joinChat(projectId: string): Observable<any> {
    return from(this.ensureConnection()).pipe(
      switchMap(() => {
        if (!this.socket?.connected) {
          return throwError(() => new Error('Socket still not connected after ensure'));
        }

        const userId = this.authService.getUserId();
        if (!userId) {
          return throwError(() => new Error('User not authenticated'));
        }

        // Update current project id
        this.currentProjectId = projectId;
        
        return new Observable(observer => {
          // Leave previous chat if exists
          if (this.currentProjectId && this.currentProjectId !== projectId) {
            this.socket.emit('leave-project', this.currentProjectId);
          }

          this.socket.emit('join-project', { projectId, userId });
          observer.next({ success: true });
          observer.complete();
        });
      })
    );
  }

  sendMessage(projectId: string, message: string): Observable<any> {
    if (!this.socket?.connected) {
      return throwError(() => new Error('Socket not connected'));
    }

    if (projectId !== this.currentProjectId) {
      return throwError(() => new Error('Not connected to this project chat'));
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

  leaveChat(projectId: string) {
    if (this.socket?.connected && projectId === this.currentProjectId) {
      this.socket.emit('leave-project', projectId);
      this.currentProjectId = null;
    }
  }

  // Get messages for specific project
  onNewMessage(): Observable<ChatMessage> {
    return this.messageSubject.asObservable();
  }

  getConnectionStatus(): Observable<boolean> {
    return this.connectionStatus.asObservable();
  }

  disconnect() {
    if (this.socket) {
      if (this.currentProjectId) {
        this.leaveChat(this.currentProjectId);
      }
      this.socket.disconnect();
    }
    this.connectionPromise = null;
    this.currentProjectId = null;
  }
}

