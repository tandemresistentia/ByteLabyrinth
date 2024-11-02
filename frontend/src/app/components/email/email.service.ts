import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_ROUTES } from '../../config/api-routes';

interface EmailData {
  projectName: string;
  projectDescription: string;
  userEmail: string;
  adminEmail: string;
}

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  constructor(private http: HttpClient) {}

  sendProjectNotifications(emailData: EmailData): Observable<any> {
    return this.http.post(`${API_ROUTES.EMAIL.SEND_PROJECT_NOTIFICATION}`, emailData);
  }
}
