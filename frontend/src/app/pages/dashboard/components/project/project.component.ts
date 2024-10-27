import { Component, OnInit, Input, OnDestroy, ViewChild, ElementRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Subscription } from 'rxjs';
import { ChatService } from './chat.service';
import { AuthService } from '../../../login/components/auth.service';
import { ProjectStatus } from './project-status/project-status.enum';
import { ProjectStatusService } from './project-status/project-status.service';
import { ProjectStatusSelectorComponent } from './project-status/project-status-selector.component';

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
    MatIconModule,
    ProjectStatusSelectorComponent
  ]
})
export class ProjectComponent implements OnInit, OnDestroy {
  @Input() projects:any[] = [];
  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;
  
  filteredProjects: any[] = [];
  selectedProject: any | null = null;
  searchTerm: string = '';
  statusFilter: string = 'All';
  private authService = inject(AuthService);
  messages: any[] = [];
  newMessage: string = '';
  isConnected: boolean = false;
  private subscriptions: Subscription[] = [];
  private hasInitializedChat: boolean = false;

  constructor(
    private chatService: ChatService,
    public projectStatusService: ProjectStatusService
  ) {}

  ngOnInit() {
    this.setupSubscriptions();
    this.applyFilters();
  if (!this.hasInitializedChat && this.filteredProjects.length > 0) {
    this.selectProject(this.filteredProjects[0]);
    this.hasInitializedChat = true;
  }
  }

  ngOnDestroy() {
    this.leaveCurrentChat();
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  updateProjectStatus(newStatus: ProjectStatus) {
    if (this.selectedProject) {
      this.selectedProject.status = newStatus;
      // Here you would typically call your API to update the project status
    }
  }

  getStatusColor(status: string): string {
    return this.projectStatusService.getStatusColor(status);
  }

  getAvatarColor(username: string): string {
    // Generate a consistent hue based on username
    const hue = username.split('')
      .reduce((acc, char) => acc + char.charCodeAt(0), 0) % 360;
    return `hsl(${hue}, 70%, 50%)`;
  }

  private setupSubscriptions() {
    // Track connection status
    this.subscriptions.push(
      this.chatService.getConnectionStatus().subscribe(
        isConnected => {
          const wasDisconnected = !this.isConnected && isConnected;
          this.isConnected = isConnected;
          
          if (wasDisconnected && this.selectedProject) {
            // Rejoin chat and reload messages if we're reconnecting
            this.joinProjectChat(this.selectedProject._id);
          }
        }
      )
    );
    // Listen for new messages
    this.subscriptions.push(
      this.chatService.onNewMessage().subscribe(
        message => {
          if (this.selectedProject && 
              message.user._id !== this.authService.getUserId()) {
            this.messages.push(message);
            requestAnimationFrame(() => {
            this.scrollToBottom();
          });
          }
        }
      )
    );
  }

  private joinProjectChat(projectId: string) {
    this.chatService.joinChat(projectId).subscribe({
      next: () => {
        this.loadInitialMessages();
      },
      error: (error) =>  {
        console.error('Error joining chat:', error);
        this.loadInitialMessages();
      }
    });
  }

  selectProject(project: any) {
    this.leaveCurrentChat();
    this.selectedProject = project;
    this.messages = [];
    
    // Only try to join if connected
    if (this.isConnected) {
      this.joinProjectChat(project._id);
    } else {
      this.loadInitialMessages();
    }
  }

  private loadInitialMessages() {
    if (!this.selectedProject) return;

    this.chatService.getMessages(this.selectedProject._id).subscribe(
      (messages) => {
        this.messages = messages;
        setTimeout(() => this.scrollToBottom(), 100);
      },
      (error) => {
        console.error('Error fetching messages:', error);
      }
    );
  }

  private leaveCurrentChat() {
    if (this.selectedProject) {
      this.chatService.leaveChat(this.selectedProject._id);
    }
  }

  applyFilters() {
    this.filteredProjects = this.projects.filter(project => 
      project.name.toLowerCase().includes(this.searchTerm.toLowerCase()) &&
      (this.statusFilter === 'All' || project.status === this.statusFilter)
    );
  }

  sendMessage() {
    if (!this.isConnected) {
      console.error('Cannot send message: Not connected');
      return;
    }

    if (this.newMessage.trim() && this.selectedProject) {
      this.chatService.sendMessage(this.selectedProject._id, this.newMessage.trim())
        .subscribe({
          next: (sentMessage) => {
            this.messages.push(sentMessage);
            this.newMessage = '';
            requestAnimationFrame(() => {
              this.scrollToBottom();
            });
          },
          error: (error) => console.error('Error sending message:', error)
        });
    }
  }

  getCurrentUserId(): string {
    const user = JSON.parse(sessionStorage.getItem('user') || '{}');
    return user._id || '';
  }

  private scrollToBottom(): void {
    try {
      const element = this.scrollContainer.nativeElement;
      element.scrollTop = element.scrollHeight;
    } catch (err) {
      console.error('Error scrolling to bottom:', err);
    }
  }
}