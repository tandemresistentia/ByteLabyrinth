import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule } from '@angular/material/dialog';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { API_ROUTES } from '../../../../../../config/api-routes';
import { AuthService } from '../../../../../../config/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EmailService } from 'src/app/components/email/email.service';

@Component({
  selector: 'app-project-specification-popup',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatDialogModule
  ],
  templateUrl: './PopupComponent.html',
  styleUrls: ['./PopupComponent.css']
})
export class ProjectSpecificationPopupComponent implements OnInit {
  @Input() isOpen: boolean = false;
  @Input() service: any;
  @Output() closePopup = new EventEmitter<void>();
  @Output() submitForm = new EventEmitter<any>();

  projectName: string = '';
  projectDescription: string = '';
  authToken: string | null = null;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router,
    private emailService: EmailService
  ) {}

  ngOnInit() {
    this.authToken = this.authService.getAuthToken();
  }

  close(): void {
    this.closePopup.emit();
  }

  submitSpecification(): void {
    if (!this.authToken) {
      this.snackBar.open('Please log in to create a project', 'Close', { duration: 3000 });
      return;
    }

    if (this.projectName && this.projectDescription) {
      const projectData = {
        name: this.projectName,
        description: this.projectDescription,
        price: this.service.price
      };

      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.authToken}`
      });

      this.http.post(API_ROUTES.PROJECTS.CREATE, projectData, { headers })
        .subscribe(
          (response: any) => {
            // Send email notifications
            const userEmail = this.authService.getUserEmail(); 
            if (!userEmail) {
              this.snackBar.open('User email not found', 'Close', { duration: 3000 });
              return;
            }
            const emailData: any = {
              projectName: this.projectName,
              projectDescription: this.projectDescription,
              userEmail: userEmail,
              adminEmail: 'luismvg41@gmail.com'
            };
            this.emailService.sendProjectNotifications(emailData).subscribe(
              (emailError) => {
                console.error('Error sending email notifications:', emailError);
              }
            );
            this.snackBar.open('Project created successfully', 'Close', { duration: 3000 });
            this.submitForm.emit(response);
            this.close();
            this.router.navigate(['/dashboard'])
            .then(() => {
              window.location.reload();
            });

          },
          (error: HttpErrorResponse) => {
            if (error.status === 401) {
              this.snackBar.open('Authentication failed. Please log in again.', 'Close', { duration: 3000 });
              // Optionally, you can redirect to login or refresh the token here
            } else {
              this.snackBar.open(error.error.message || 'Error creating project', 'Close', { duration: 3000 });
            }
          }
        );
    } else {
      this.snackBar.open('Please fill in all required fields', 'Close', { duration: 3000 });
    }
  }
}