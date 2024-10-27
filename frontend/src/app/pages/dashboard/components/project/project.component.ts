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
    ChatComponent
  ]
})
export class ProjectComponent implements OnInit {
  @Input() projects: any[] = [];
  
  filteredProjects: any[] = [];
  selectedProject: any | null = null;
  searchTerm: string = '';
  statusFilter: string = 'All';
  private hasInitializedChat: boolean = false;

  constructor(
    public projectStatusService: ProjectStatusService
  ) {}

  ngOnInit() {
    this.applyFilters();
    if (!this.hasInitializedChat && this.filteredProjects.length > 0) {
      this.selectProject(this.filteredProjects[0]);
      this.hasInitializedChat = true;
    }
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