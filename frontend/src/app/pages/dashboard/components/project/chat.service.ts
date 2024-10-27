import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, Subject, BehaviorSubject } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { API_ROUTES, SOCKET_URL } from '../../../../config/api-routes';
import { AuthService } from '../../../login/components/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private socket! : Socket;
  private authToken: string;
  private messageSubject = new Subject<any>();
  private connectionStatus = new BehaviorSubject<boolean>(false);

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {
    this.authToken = this.authService.getAuthToken() || '';
    this.initializeSocketConnection();

    // Update token if it changes
    this.authService.authToken$.subscribe(token => {
      this.authToken = token || '';
      this.reconnectSocket(); // Added reconnection when token changes
    });
  }

  private initializeSocketConnection() {
    this.socket = io(SOCKET_URL, {
      auth: { token: this.authToken },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });

    this.setupSocketListeners();
  }

  private setupSocketListeners() {
    this.socket.on('connect', () => {
      this.connectionStatus.next(true);
    });

    this.socket.on('disconnect', () => {
      this.connectionStatus.next(false);  // Track disconnection
    });

    this.socket.on('error', (error) => {
      this.connectionStatus.next(false);  // Track error state
    });

    // Added type safety to message handling
    this.socket.on('new-message', (message: any) => {
      this.messageSubject.next(message);
    });

    // Added connection error handling
    this.socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
      this.connectionStatus.next(false);
    });
  }

  private reconnectSocket() {
    if (this.socket) {
      this.socket.disconnect();
    }
    this.initializeSocketConnection();
  }

  getMessages(projectId: string): Observable<any[]> {
    return this.http.get<any[]>(
      API_ROUTES.CHAT.GET_MESSAGES.replace(':projectId', projectId),
      {
        headers: new HttpHeaders({
          'Authorization': `Bearer ${this.authToken}`,
          'socket-id': this.socket?.id || ''  // Added socket ID to headers
        })
      }
    );
  }

  sendMessage(projectId: string, message: string): Observable<any> {
    if (!this.socket?.connected) {
      console.warn('ChatService - Socket not connected, cannot send message');
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

  joinChat(projectId: string): Observable<any> {
    if (!this.socket?.connected) {
      return throwError(() => new Error('Socket not connected'));
    }

    const userId = this.authService.getUserId();
    if (!userId) {
      return throwError(() => new Error('User not authenticated'));
    }

    return new Observable(observer => {
      // Added timeout to prevent indefinite waiting
      const timeout = setTimeout(() => {
        observer.error(new Error('Join timeout'));
        observer.complete();
      }, 5000);

      this.socket.emit('join-project', { projectId, userId });

      const handleJoin = (data: any) => {
        clearTimeout(timeout);
        observer.next(data);
        observer.complete();
      };

      const handleError = (error: any) => {
        clearTimeout(timeout);
        observer.error(error);
      };

      // Use once() instead of on() to prevent memory leaks
      this.socket.once('joined-project', handleJoin);
      this.socket.once('error', handleError);

      // Added proper cleanup
      return () => {
        clearTimeout(timeout);
        this.socket.off('joined-project', handleJoin);
        this.socket.off('error', handleError);
      };
    });
  }

  // Added connection check before leaving chat
  leaveChat(projectId: string) {
    if (this.socket?.connected) {
      this.socket.emit('leave-project', projectId);
    }
  }

  // Added type safety to message observable
  onNewMessage(): Observable<any> {
    return this.messageSubject.asObservable();
  }

  // Added method to expose connection status to components
  getConnectionStatus(): Observable<boolean> {
    return this.connectionStatus.asObservable();
  }

  // Added proper cleanup method
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}