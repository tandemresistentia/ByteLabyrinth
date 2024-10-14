import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface ChatMessage {
  user: string;
  message: string;
  timestamp: Date;
}

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="chat-container">
      <div class="chat-messages">
        <div *ngFor="let msg of messages" class="message">
          <strong>{{ msg.user }}</strong>: {{ msg.message }}
          <small>{{ msg.timestamp | date:'short' }}</small>
        </div>
      </div>
      <div class="chat-input">
        <input [(ngModel)]="newMessage" (keyup.enter)="sendMessage()" placeholder="Type a message...">
        <button (click)="sendMessage()">Send</button>
      </div>
    </div>
  `,
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  @Input() projectId: string | undefined;
  messages: ChatMessage[] = [];
  newMessage: string = '';
  currentUser: string = 'User';  // This could be set dynamically

  ngOnInit() {
    // You could load initial messages here, possibly filtered by projectId
    this.messages.push({
      user: 'System',
      message: `Welcome to the chat for project ${this.projectId}!`,
      timestamp: new Date()
    });
  }

  sendMessage() {
    if (this.newMessage.trim()) {
      this.messages.push({
        user: this.currentUser,
        message: this.newMessage,
        timestamp: new Date()
      });
      this.newMessage = '';
    }
  }
}