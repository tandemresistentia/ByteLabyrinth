import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { io, Socket } from 'socket.io-client';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { API_ROUTES, SOCKET_URL } from '../../../../config/api-routes';

interface ChatMessage {
  _id?: string;
  user: {
    _id: string;
    username: string;
  };
  message: string;
  timestamp: Date;
}

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, MatInputModule, MatButtonModule, MatIconModule],
  template: `
    <div class="chat-container">
      <div class="chat-messages">
        <div *ngFor="let msg of messages" class="message" [ngClass]="msg.user.username">
          <div class="avatar">{{ msg.user.username.charAt(0).toUpperCase() }}</div>
          <div class="message-content">
            <strong>{{ msg.user.username }}</strong>
            <p>{{ msg.message }}</p>
            <small>{{ msg.timestamp | date:'short' }}</small>
          </div>
        </div>
      </div>
      <div class="chat-input">
        <mat-form-field appearance="outline">
          <input matInput [(ngModel)]="newMessage" (keyup.enter)="sendMessage()" placeholder="Type a message...">
        </mat-form-field>
        <button mat-fab color="primary" (click)="sendMessage()">
          <mat-icon>send</mat-icon>
        </button>
      </div>
    </div>
  `,
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy {
  @Input() projectId: string | undefined;
  messages: ChatMessage[] = [];
  newMessage: string = '';
  private socket: Socket;
  private authToken: string;

  constructor(private http: HttpClient) {
    this.authToken = sessionStorage.getItem('authToken') || '';
    this.socket = io(SOCKET_URL, {
      auth: {
        token: this.authToken
      }
    });
  }

  ngOnInit() {
    if (this.projectId) {
      this.socket.emit('join', this.projectId);
      this.loadInitialMessages();
    }

    this.socket.on('message', (message: ChatMessage) => {
      this.messages.push(message);
    });
  }

  ngOnDestroy() {
    this.socket.disconnect();
  }

  loadInitialMessages() {
    if (this.projectId) {
      const url = API_ROUTES.CHAT.GET_MESSAGES.replace(':projectId', this.projectId);
      this.http.get<ChatMessage[]>(url, this.getHttpOptions()).subscribe(
        (messages) => {
          this.messages = messages;
        },
        (error) => {
          console.error('Error fetching messages:', error);
        }
      );
    }
  }

  sendMessage() {
    if (this.newMessage.trim() && this.projectId) {
      this.http.post<ChatMessage>(API_ROUTES.CHAT.SEND_MESSAGE, {
        projectId: this.projectId,
        message: this.newMessage
      }, this.getHttpOptions()).subscribe(
        (sentMessage) => {
          this.newMessage = '';
        },
        (error) => {
          console.error('Error sending message:', error);
        }
      );
    }
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