import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule } from '@angular/material/dialog';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { API_ROUTES } from '../../../../../../config/api-routes';
import { AuthService } from '../../../../../login/components/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

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
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.authToken = this.authService.getAuthToken();
    console.log('Auth token in ProjectSpecificationPopupComponent:', this.authToken);
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
        description: this.projectDescription
      };

      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.authToken}`
      });

      this.http.post(API_ROUTES.PROJECTS.CREATE, projectData, { headers })
        .subscribe(
          (response: any) => {
            console.log('Project created successfully', response);
            this.snackBar.open('Project created successfully', 'Close', { duration: 3000 });
            this.submitForm.emit(response);
            this.close();
          },
          (error: HttpErrorResponse) => {
            console.error('Error creating project', error);
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