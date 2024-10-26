import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { API_ROUTES, SOCKET_URL } from '../../../../config/api-routes';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private socket: Socket;
  private authToken: string;

  constructor(private http: HttpClient) {
    this.authToken = sessionStorage.getItem('authToken') || '';
    this.socket = io(SOCKET_URL, {
      auth: { token: this.authToken }
    });
  }

  getMessages(projectId: string): Observable<any> {
    return this.http.get(
      API_ROUTES.CHAT.GET_MESSAGES.replace(':projectId', projectId),
      this.getHttpOptions()
    );
  }

  sendMessage(projectId: string, message: string): Observable<any> {
    return this.http.post(
      API_ROUTES.CHAT.SEND_MESSAGE.replace(':projectId', projectId),
      { message },
      this.getHttpOptions()
    );
  }

  onNewMessage(): Observable<any> {
    return new Observable(observer => {
      this.socket.on('new-message', (message) => {
        observer.next(message);
      });
    });
  }

  joinChat(projectId: string) {
    this.socket.emit('join', projectId);
  }

  leaveChat(projectId: string) {
    this.socket.emit('leave', projectId);
  }

  disconnect() {
    this.socket.disconnect();
  }

  private getHttpOptions() {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.authToken}`
      })
    };
  }
}