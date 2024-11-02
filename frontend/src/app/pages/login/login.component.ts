import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AuthService } from '../../config/auth.service';
import { HttpClientModule } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTabsModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    HttpClientModule
  ],
  providers: [AuthService],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  isVisible = false;
  username = '';
  password = '';
  email = '';
  confirmPassword = '';
  hidePassword = true;
  hideConfirmPassword = true;

  constructor(
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  show() {
    this.isVisible = true;
  }

  close() {
    this.isVisible = false;
    this.resetForm();
  }

  onLogin() {
    this.authService.login(this.username, this.password).subscribe(
      response => {
        this.authService.setAuthToken(response.token); // Set the auth token
        this.snackBar.open('Login successful', 'Close', { duration: 3000 });
        this.close();
        window.location.reload();
      },
      error => {
        this.snackBar.open(error.error.message || 'Login failed', 'Close', { duration: 3000 });
      }
    );
  }

  onSignup() {
    this.authService.signup(this.username, this.email, this.password).subscribe(
      response => {
        this.authService.setAuthToken(response.token); // Set the auth token
        this.snackBar.open('Signup successful', 'Close', { duration: 3000 });
        this.close();
        window.location.reload();
      },
      error => {
        this.snackBar.open(error.error.message || 'Signup failed', 'Close', { duration: 3000 });
      }
    );
  }

  private resetForm() {
    this.username = '';
    this.password = '';
    this.email = '';
    this.confirmPassword = '';
    this.hidePassword = true;
    this.hideConfirmPassword = true;
  }
}