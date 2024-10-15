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
import { ChatComponent } from '../project-chat/chat.component';

interface Project {
  _id: string;
  name: string;
  description: string;
  createdAt: string;
  status: 'Pending' | 'Approved' | 'In Progress' | 'Under Review' | 'Completed' | 'On Hold';
}

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html' ,
  styleUrls: ['./project.component.css'],
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
    ChatComponent
  ]
})
export class ProjectComponent implements OnInit {
  @Input() projects: Project[] = [];
  filteredProjects: Project[] = [];
  selectedProject: Project | null = null;
  searchTerm: string = '';
  statusFilter: string = 'All';

  ngOnInit() {
    this.applyFilters();
    this.selectFirstProject();
  }

  applyFilters() {
    this.filteredProjects = this.projects.filter(project => 
      project.name.toLowerCase().includes(this.searchTerm.toLowerCase()) &&
      (this.statusFilter === 'All' || project.status === this.statusFilter)
    );
  }

  selectProject(project: Project) {
    this.selectedProject = project;
  }

  selectFirstProject() {
    if (this.filteredProjects.length > 0) {
      this.selectProject(this.filteredProjects[0]);
    }
  }
}