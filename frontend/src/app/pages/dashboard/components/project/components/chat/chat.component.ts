import { Component, Input, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Subscription } from 'rxjs';
import { ChatService } from './chat.service';
import { AuthService } from '../../../../../login/components/auth.service';

@Component({
  selector: 'app-chat',
  template: `
    <div class="chat-container">
      <div class="chat-messages" #scrollContainer>
        <div *ngFor="let msg of messages" class="message" 
             [ngClass]="{'my-message': msg.user._id === getCurrentUserId()}">
          <div class="avatar" [style.background-color]="getAvatarColor(msg.user.username)">
            {{ msg.user.username.charAt(0).toUpperCase() }}
          </div>
          <div class="message-content">
            <strong>{{ msg.user.username }}</strong>
            <p>{{ msg.message }}</p>
            <small>{{ msg.timestamp | date:'short' }}</small>
          </div>
        </div>
      </div>
      <div class="chat-input">
        <mat-form-field appearance="outline">
          <input matInput 
                 [(ngModel)]="newMessage" 
                 (keyup.enter)="sendMessage()" 
                 placeholder="Type a message...">
        </mat-form-field>
        <button mat-fab color="primary" 
                [disabled]="!newMessage.trim()" 
                (click)="sendMessage()">
          <mat-icon>send</mat-icon>
        </button>
      </div>
    </div>
  `,
  styleUrls: ['./chat.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ]
})
export class ChatComponent implements OnInit, OnDestroy {
    @Input() projectId: string = '';
    @ViewChild('scrollContainer') private scrollContainer!: ElementRef;
  
    messages: any[] = [];
    newMessage: string = '';
    isConnected: boolean = false;
    loading: boolean = false;
    error: string | null = null;
    
    private subscriptions: Subscription[] = [];
    private connectionRetries = 3;
    private retryCount = 0;
  
    constructor(
      private chatService: ChatService,
      private authService: AuthService
    ) {}
  
    ngOnInit() {
      this.setupSubscriptions();
      if (this.projectId) {
        this.initializeChat();
      }
    }
  
    ngOnDestroy() {
      this.cleanup();
    }
  
    // Initialize chat with retry logic
    private async initializeChat() {
      this.loading = true;
      this.error = null;
      this.retryCount = 0;
      
      await this.tryConnect();
    }
  
    // Attempt connection with backoff
    private async tryConnect() {
      try {
        await this.joinProjectChat(this.projectId);
        this.loading = false;
      } catch (error) {
        console.error(`Connection attempt ${this.retryCount + 1} failed:`, error);
        if (this.retryCount < this.connectionRetries) {
          this.retryCount++;
          const delay = this.retryCount * 1000; // Exponential backoff
          console.log(`Retrying in ${delay}ms...`);
          setTimeout(() => this.tryConnect(), delay);
        } else {
          this.loading = false;
          this.error = 'Failed to connect to chat. Please try again.';
          console.error('Max retries reached');
        }
      }
    }
  
    // Public retry method for user-initiated retry
    async retryConnection() {
      this.retryCount = 0;
      await this.initializeChat();
    }
  
    // Set up subscriptions for connection and messages
    private setupSubscriptions() {
      // Connection status subscription
      this.subscriptions.push(
        this.chatService.getConnectionStatus().subscribe(
          isConnected => {
            const wasDisconnected = !this.isConnected && isConnected;
            this.isConnected = isConnected;
            
            if (wasDisconnected && this.projectId) {
              this.joinProjectChat(this.projectId);
            }
          }
        )
      );
  
      // New message subscription
      this.subscriptions.push(
        this.chatService.onNewMessage().subscribe(
          message => {
            if (message.user._id !== this.getCurrentUserId()) {
              this.messages.push(message);
              this.scrollToBottom();
            }
          }
        )
      );
    }
  
    // Join chat and load messages
    private joinProjectChat(projectId: string) {
      return new Promise((resolve, reject) => {
        this.chatService.joinChat(projectId).subscribe({
          next: () => {
            this.loadInitialMessages();
            resolve(true);
          },
          error: (error) => {
            console.error('Error joining chat:', error);
            reject(error);
          }
        });
      });
    }
  
    // Load initial messages
    private loadInitialMessages() {
      this.chatService.getMessages(this.projectId).subscribe({
        next: (messages) => {
          this.messages = messages;
          this.scrollToBottom();
        },
        error: (error) => {
          console.error('Error fetching messages:', error);
          this.error = 'Failed to load messages';
        }
      });
    }
  
    
    // Send new message
    sendMessage() {
      if (!this.isConnected || !this.newMessage.trim()) {
        return;
      }
  
      this.chatService.sendMessage(this.projectId, this.newMessage.trim())
        .subscribe({
          next: (sentMessage) => {
            this.messages.push(sentMessage);
            this.newMessage = '';
            this.scrollToBottom();
          },
          error: (error) => {
            console.error('Error sending message:', error);
            // Optionally show error to user
          }
        });
    }
  
    // Utility methods
    getCurrentUserId(): string {
      return this.authService.getUserId() || '';
    }
  
    getAvatarColor(username: string): string {
      const hue = username.split('')
        .reduce((acc, char) => acc + char.charCodeAt(0), 0) % 360;
      return `hsl(${hue}, 70%, 50%)`;
    }
  
    private scrollToBottom(): void {
      requestAnimationFrame(() => {
        try {
          const element = this.scrollContainer.nativeElement;
          element.scrollTop = element.scrollHeight;
        } catch (err) {
          console.error('Error scrolling to bottom:', err);
        }
      });
    }
  
    // Cleanup
    private cleanup() {
      if (this.projectId) {
        this.chatService.leaveChat(this.projectId);
      }
      this.subscriptions.forEach(sub => sub.unsubscribe());
    }
  }