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
import { AuthService } from '../../../login/components/auth.service';
import { PaymentComponent } from './components/payment/payment.component';
import { ProjectHeaderComponent } from './components/project-header/project-header.component';
import { ProjectConstants } from './project-constants';

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
  statusFilter: string = 'All';
  private hasInitializedChat: boolean = false;
  isAdmin: boolean = false;
  projectStatuses = Object.values(ProjectStatus);
  isExpanded = new Set<string>();

  constructor(
    public projectStatusService: ProjectStatusService,
    private projectService: ProjectService,
    private authService: AuthService
  ) {}

  isProjectExpanded(project: any): boolean {
    return this.isExpanded.has(project._id);
  }

  toggleExpand(project: any, event: Event) {
    event.stopPropagation();
    if (this.isExpanded.has(project._id)) {
      this.isExpanded.delete(project._id);
    } else {
      this.isExpanded.add(project._id);
    }
  }
  
  isExpandable(project: any): boolean {
    const element = document.createElement('div');
    element.style.visibility = 'hidden';
    element.style.fontSize = '0.875rem';
    element.style.lineHeight = '1.6';
    element.innerText = project.description;
    document.body.appendChild(element);
    const isExpandable = element.offsetHeight > 48; // Approximate height of 2 lines
    document.body.removeChild(element);
    return isExpandable;
  }

  ngOnInit() {
    this.isAdmin = this.authService.getUserId() === ProjectConstants.backend.ADMIN_USER_ID;
    this.applyFilters();
    if (!this.hasInitializedChat && this.filteredProjects.length > 0) {
      this.selectProject(this.filteredProjects[0]);
      this.hasInitializedChat = true;
    }
  }

  async updateProjectStatus(newStatus: ProjectStatus) {
    if (this.selectedProject) {
      const oldStatus = this.selectedProject.status;
      try {
        this.selectedProject.status = newStatus;
        await this.projectService.updateProjectStatus(this.selectedProject._id, newStatus).toPromise();
        this.applyFilters();
      } catch (error) {
        this.selectedProject.status = oldStatus;
        console.error('Failed to update project status:', error);
      }
    }
  }

  selectProject(project: any) {
    this.selectedProject = project;
  }

  applyFilters() {
    this.filteredProjects = this.projects.filter(project => 
      project.name.toLowerCase().includes(this.searchTerm.toLowerCase()) &&
      (this.statusFilter === 'All' || project.status === this.statusFilter)
    );
  }
}