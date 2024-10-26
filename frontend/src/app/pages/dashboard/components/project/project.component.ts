import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { io, Socket } from 'socket.io-client';
import { API_ROUTES, SOCKET_URL } from '../../../../config/api-routes';

interface Project {
  _id: string;
  name: string;
  description: string;
  createdAt: string;
  status: 'Pending' | 'Approved' | 'In Progress' | 'Under Review' | 'Completed' | 'On Hold';
}

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
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatChipsModule,
    MatButtonModule,
    MatIconModule
  ]
})
export class ProjectComponent implements OnInit, OnDestroy {
  @Input() projects: Project[] = [];
  filteredProjects: Project[] = [];
  selectedProject: Project | null = null;
  searchTerm: string = '';
  statusFilter: string = 'All';
  
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
    this.applyFilters();
    this.setupSocketListeners();
    if (this.filteredProjects.length > 0) {
      this.selectProject(this.filteredProjects[0]);
    }
  }

  ngOnDestroy() {
    this.leaveCurrentChat();
    this.socket.disconnect();
  }

  private setupSocketListeners() {
    this.socket.on('message', (message: ChatMessage) => {
      if (message.user._id !== this.getCurrentUserId()) {
        this.messages.push(message);
        this.scrollToBottom();
      }
    });
  }

  private leaveCurrentChat() {
    if (this.selectedProject) {
      this.socket.emit('leave', this.selectedProject._id);
    }
  }

  applyFilters() {
    this.filteredProjects = this.projects.filter(project => 
      project.name.toLowerCase().includes(this.searchTerm.toLowerCase()) &&
      (this.statusFilter === 'All' || project.status === this.statusFilter)
    );
  }

  selectProject(project: Project) {
    if (this.selectedProject?._id !== project._id) {
      this.leaveCurrentChat();
      this.selectedProject = project;
      this.messages = [];
      this.socket.emit('join', project._id);
      this.loadInitialMessages();
    }
  }

  getStatusColor(status: string): string {
    switch(status) {
      case 'Pending': return 'warn';
      case 'Approved': return 'primary';
      case 'In Progress': return 'accent';
      case 'Under Review': return 'warn';
      case 'Completed': return 'primary';
      case 'On Hold': return 'warn';
      default: return 'primary';
    }
  }

  private loadInitialMessages() {
    if (!this.selectedProject) return;

    const url = API_ROUTES.CHAT.GET_MESSAGES.replace(':projectId', this.selectedProject._id);
    this.http.get<ChatMessage[]>(url, this.getHttpOptions()).subscribe(
      (messages) => {
        this.messages = messages;
        setTimeout(() => this.scrollToBottom(), 100);
      },
      (error) => {
        console.error('Error fetching messages:', error);
      }
    );
  }

  sendMessage() {
    if (this.newMessage.trim() && this.selectedProject) {
      const url = API_ROUTES.CHAT.SEND_MESSAGE.replace(':projectId', this.selectedProject._id);
      const messageData = {
        message: this.newMessage.trim()
      };

      this.http.post<ChatMessage>(url, messageData, this.getHttpOptions())
        .subscribe(
          (sentMessage) => {
            this.messages.push(sentMessage);
            this.newMessage = '';
            this.scrollToBottom();
          },
          (error) => {
            console.error('Error sending message:', error);
          }
        );
    }
  }

  getCurrentUserId(): string {
    const user = JSON.parse(sessionStorage.getItem('user') || '{}');
    return user._id || '';
  }

  private scrollToBottom(): void {
    try {
      const element = document.querySelector('.chat-messages');
      if (element) {
        element.scrollTop = element.scrollHeight;
      }
    } catch (err) {
      console.error('Error scrolling to bottom:', err);
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