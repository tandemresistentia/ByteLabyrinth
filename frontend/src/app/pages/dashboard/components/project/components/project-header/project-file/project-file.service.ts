import { Injectable } from '@angular/core';
import { HttpClient, HttpEventType, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { API_ROUTES } from '../../../../../../../config/api-routes';
import { AuthService } from '../../../../../../login/components/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectFileService {
    constructor(
      private http: HttpClient,
      private authService: AuthService
    ) {}

    private getAuthHeaders(): HttpHeaders {
      const token = this.authService.getAuthToken();
      if (!token) {
          console.warn('No auth token available');
          return new HttpHeaders();
      }
      const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`
      });
      return headers;
  }
    uploadProjectFile(projectId: string, file: File): Observable<number> {
      if (!file.type.includes('zip')) {
        return throwError(() => new Error('Only ZIP files are allowed'));
      }

      const formData = new FormData();
      formData.append('file', file);
  
      const headers = this.getAuthHeaders();

      return this.http.post(
        `${API_ROUTES.PROJECTS.BASE}/${projectId}/upload`, 
        formData, 
        {
          headers,
          reportProgress: true,
          observe: 'events',
      }).pipe(
        map(event => {
          if (event.type === HttpEventType.UploadProgress) {
            return Math.round((100 * event.loaded) / (event.total || 100));
          }
          return 100;
        }),
        catchError(error => throwError(() => error))
      );
    }

    downloadProjectFile(projectId:string): Observable<Blob> {
      const headers = this.getAuthHeaders();
        return this.http.get(`${API_ROUTES.PROJECTS.BASE}/${projectId}/download`, {
            headers,
            responseType: 'blob'
        });
    }
}