import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
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
  template: `
  <div class="project-container">
  <div class="project-list" [class.full-width]="!selectedProject">
    <mat-form-field>
      <input matInput [(ngModel)]="searchTerm" (input)="applyFilters()" placeholder="Search projects">
    </mat-form-field>
    <mat-form-field>
      <mat-select [(ngModel)]="statusFilter" (selectionChange)="applyFilters()">
        <mat-option value="All">All</mat-option>
        <mat-option value="Pending">Pending</mat-option>
        <mat-option value="Approved">Approved</mat-option>
        <mat-option value="In Progress">In Progress</mat-option>
        <mat-option value="Under Review">Under Review</mat-option>
        <mat-option value="Completed">Completed</mat-option>
        <mat-option value="On Hold">On Hold</mat-option>
      </mat-select>
    </mat-form-field>
    <mat-card *ngFor="let project of filteredProjects" (click)="selectProject(project)">
      <mat-card-title>{{ project.name }}</mat-card-title>
      <mat-card-subtitle>
        Created on: {{ project.createdAt | date }}
        <mat-chip-listbox>
          <mat-chip [color]="getStatusColor(project.status)" selected>{{ project.status }}</mat-chip>
        </mat-chip-listbox>
      </mat-card-subtitle>
      <mat-card-content>
        <p class="truncate">{{ project.description }}</p>
      </mat-card-content>
    </mat-card>
  </div>
  
  <div class="project-details" *ngIf="selectedProject">
    <button mat-button (click)="clearSelectedProject()" class="back-button">Back to List</button>
    <h2>{{ selectedProject.name }}</h2>
    <p>Created on: {{ selectedProject.createdAt | date }}</p>
    <mat-chip-listbox>
      <mat-chip [color]="getStatusColor(selectedProject.status)" selected>{{ selectedProject.status }}</mat-chip>
    </mat-chip-listbox>
    <p class="project-description">{{ selectedProject.description }}</p>
    <app-chat [projectId]="selectedProject._id"></app-chat>
  </div>
</div>
  `,
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

  clearSelectedProject() {
    this.selectedProject = null;
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'Pending': return 'warn';
      case 'Approved': return 'primary';
      case 'In Progress': return 'accent';
      case 'Under Review': return 'warn';
      case 'Completed': return 'primary';
      case 'On Hold': return 'warn';
      default: return 'primary';
    }
  }
}