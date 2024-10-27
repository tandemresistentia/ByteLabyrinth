import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { API_ROUTES } from '../../../../config/api-routes';
import { ProjectStatus } from './components/project-status/project-status.enum';
import { AuthService } from '../../../login/components/auth.service';
import { Observable, throwError } from 'rxjs'; // Added for error handling
import { catchError, tap } from 'rxjs/operators'; // Added for debugging

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
    constructor(
        private http: HttpClient,
        private authService: AuthService
    ) {}

    private getAuthHeaders(): HttpHeaders {
        const token = this.authService.getAuthToken();
        
        // Add debug logging to verify token
        if (!token) {
            console.warn('No auth token available');
            // You might want to redirect to login here
            return new HttpHeaders({
                'Content-Type': 'application/json'
            });
        }

        // Log the complete headers being set
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        });
        
        return headers;
    }

    updateProjectStatus(projectId: string, status: ProjectStatus): Observable<any> {
        // Debug log the request details
        
        const options = {
            headers: this.getAuthHeaders()
        };

        return this.http.patch(
            `${API_ROUTES.PROJECTS.BASE}/${projectId}/status`,
            { status },
            options
        ).pipe(
            catchError(error => {
                console.error('Status update error:', error);
                // Log the specific error details
                if (error.error) {
                    console.error('Server error message:', error.error.message);
                    console.error('Server error details:', error.error.error);
                }
                return throwError(() => error);
            })
        );
    }
}