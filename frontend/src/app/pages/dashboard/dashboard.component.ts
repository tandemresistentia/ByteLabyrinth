import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../login/components/auth.service';
import { ProjectComponent } from './components/project/project.component';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { API_ROUTES } from '../../config/api-routes';
import { catchError, timeout } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  template: `
    <div class="dashboard-container">
      <div class="dashboard-content" *ngIf="!loading && !error && projects.length > 0">
        <app-project [projects]="projects"></app-project>
      </div>
      
      <div class="loading-spinner" *ngIf="loading">
        <mat-spinner></mat-spinner>
      </div>
      
      <div *ngIf="error" class="error-message">
        <mat-icon>error</mat-icon>
        <span>{{ error }}</span>
      </div>

      <div *ngIf="!loading && !error && projects.length === 0" class="no-projects-message">
        <mat-icon>info</mat-icon>
        <span>No projects found. Create a new project to get started!</span>
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
  projects: any[] = [];
  loading: boolean = false;
  error: string | any = null;
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

    const url = `${API_ROUTES.PROJECTS.BASE}/${userId}`;
    
    this.http.get<any[]>(url, { headers })
      .pipe(
        timeout(10000),  // 10 seconds timeout
      )
      .subscribe({
        next: (projects) => {
          this.projects = projects;
          console.log(projects);
          this.projects.sort((a,b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          this.loading = false;
        },
        error: (error: any) => {
          console.error('Error fetching user projects', error);
          this.error = error.message || 'An unexpected error occurred';
          this.snackBar.open(this.error, 'Close', { duration: 3000 });
          this.loading = false;
        },
        complete: () => {
          this.loading = false;
        }
      });
  }
}