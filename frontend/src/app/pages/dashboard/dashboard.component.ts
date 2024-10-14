import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../login/components/auth.service';
import { ProjectComponent } from './components/project/project.component';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { API_ROUTES } from '../../config/api-routes';

interface Project {
  _id: string;
  name: string;
  description: string;
  createdAt: string;
  status: 'Pending' | 'Approved' | 'In Progress' | 'Under Review' | 'Completed' | 'On Hold';
}

@Component({
  selector: 'app-dashboard',
  template: `
  <div class="dashboard-container">
  <mat-toolbar color="primary">
    <mat-icon>dashboard</mat-icon>
    <span>Project Dashboard</span>
  </mat-toolbar>
  
  <div class="dashboard-content" *ngIf="!loading && !error">
    <app-project [projects]="projects"></app-project>
  </div>
  
  <div class="loading-spinner" *ngIf="loading">
    <mat-spinner></mat-spinner>
  </div>
  
  <div *ngIf="error" class="error-message">
    <mat-icon>error</mat-icon>
    <span>{{ error }}</span>
  </div>
</div>
  `,
  styleUrls: ['./dashboard.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatToolbarModule,
    MatIconModule,
    ProjectComponent
  ]
})
export class DashboardComponent implements OnInit {
  projects: Project[] = [];
  loading: boolean = false;
  error: string | null = null;
  isBrowser: boolean;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit() {
    this.fetchUserProjects();
  }

  fetchUserProjects() {
    this.loading = true;
    this.error = null;
    const authToken = this.authService.getAuthToken();
    const userId = this.authService.getUserId();

    if (!authToken || !userId) {
      this.error = 'Authentication information not available';
      this.snackBar.open(this.error, 'Close', { duration: 3000 });
      this.loading = false;
      return;
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${authToken}`
    });

    const url = API_ROUTES.PROJECTS.USER_PROJECTS.replace(':userId', userId);

    this.http.get<Project[]>(url, { headers })
      .subscribe(
        (projects) => {
          this.projects = projects;
          this.loading = false;
        },
        (error: any) => {
          console.error('Error fetching user projects', error);
          this.error = 'Error fetching projects. Please try again later.';
          this.snackBar.open(this.error, 'Close', { duration: 3000 });
          this.loading = false;
        }
      );
  }
}