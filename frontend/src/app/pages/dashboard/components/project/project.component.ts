import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ProjectStatus } from './components/project-status/project-status.enum';
import { ProjectStatusService } from './components/project-status/project-status.service';
import { ProjectStatusSelectorComponent } from './components/project-status/project-status-selector.component';
import { ChatComponent } from './components/chat/chat.component';
import { ProjectService } from './project.service';
import { AuthService } from '../../../../config/auth.service';
import { PaymentComponent } from './components/payment/payment.component';
import { ProjectHeaderComponent } from './components/project-header/project-header.component';
import { ProjectConstants, isAdmin } from '../../../../config/project-constants';

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
    ProjectStatusSelectorComponent,
    ChatComponent,
    PaymentComponent,
    ProjectHeaderComponent
  ]
})
export class ProjectComponent implements OnInit {
  @Input() projects: any[] = [];
  
  filteredProjects: any[] = [];
  selectedProject: any | null = null;
  searchTerm: string = '';
  statusFilter: ProjectStatus | 'All' = 'All';
  private hasInitializedChat: boolean = false;
  isAdmin: boolean = false;
  projectStatuses = Object.values(ProjectStatus);
  isExpanded = new Set<string>();
  expandableProjects = new Set<string>();
  
  private searchDebounceTimeout: any;
  private readonly DEBOUNCE_TIME = 300; // milliseconds

  constructor(
    public projectStatusService: ProjectStatusService,
    private projectService: ProjectService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.initializeComponent();
  }

  private async initializeComponent(): Promise<void> {
    const userId = this.authService.getUserId();
    this.isAdmin = userId ? isAdmin(userId) : false;
    
    // Calculate expandable projects once
    this.updateExpandableProjects();
    
    // Initial filter application
    this.applyFilters();
    
    // Select first project if available
    this.initializeSelectedProject();
  }

  private initializeSelectedProject(): void {
    if (!this.hasInitializedChat && this.filteredProjects.length > 0) {
      this.selectProject(this.filteredProjects[0]);
      this.hasInitializedChat = true;
    }
  }

  private updateExpandableProjects(): void {
    this.expandableProjects.clear();
    const tempElement = document.createElement('div');
    tempElement.style.visibility = 'hidden';
    tempElement.style.fontSize = '0.875rem';
    tempElement.style.lineHeight = '1.6';
    document.body.appendChild(tempElement);

    try {
      for (const project of this.projects) {
        if (project.description) {
          tempElement.innerText = project.description;
          if (tempElement.offsetHeight > 48) {
            this.expandableProjects.add(project._id);
          }
        }
      }
    } finally {
      document.body.removeChild(tempElement);
    }
  }

  isProjectExpanded(project: any): boolean {
    return this.isExpanded.has(project._id);
  }

  toggleExpand(project: any, event: Event): void {
    event.stopPropagation();
    if (this.isExpanded.has(project._id)) {
      this.isExpanded.delete(project._id);
    } else {
      this.isExpanded.add(project._id);
    }
  }
  
  isExpandable(project: any): boolean {
    return this.expandableProjects.has(project._id);
  }

  selectProject(project: any): void {
    this.selectedProject = project;
  }

  async updateProjectStatus(newStatus: ProjectStatus): Promise<void> {
    if (!this.selectedProject) return;

    const oldStatus = this.selectedProject.status;
    try {
      this.selectedProject.status = newStatus;
      await this.projectService.updateProjectStatus(this.selectedProject._id, newStatus).toPromise();
      this.applyFilters();
    } catch (error) {
      this.selectedProject.status = oldStatus;
      console.error('Failed to update project status:', error);
      // You might want to show a user-friendly error message here
    }
  }

  onSearchChange(): void {
    // Clear any existing timeout
    if (this.searchDebounceTimeout) {
      clearTimeout(this.searchDebounceTimeout);
    }

    // Set a new timeout
    this.searchDebounceTimeout = setTimeout(() => {
      this.applyFilters();
    }, this.DEBOUNCE_TIME);
  }

  onStatusFilterChange(): void {
    this.applyFilters();
  }

  public applyFilters(): void {
    const searchTermLower = this.searchTerm.toLowerCase();
    
    this.filteredProjects = this.projects.filter(project => {
      const matchesSearch = project.name.toLowerCase().includes(searchTermLower);
      const matchesStatus = this.statusFilter === 'All' || project.status === this.statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }

  // Optional: Clean up when component is destroyed
  ngOnDestroy(): void {
    if (this.searchDebounceTimeout) {
      clearTimeout(this.searchDebounceTimeout);
    }
  }
}