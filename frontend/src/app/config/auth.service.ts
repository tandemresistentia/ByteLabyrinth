import { Injectable, Optional, PLATFORM_ID, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { jwtDecode } from "jwt-decode";
import { API_ROUTES } from 'src/app/config/api-routes';

interface DecodedToken {
  userId: string;
  email: string;
  username: string;
  iat: number;
  exp: number;
}

interface AuthResponse {
  token: string;
  userId: string;
  email: string;
  username: string;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authTokenSubject = new BehaviorSubject<string | null>(null);
  authToken$ = this.authTokenSubject.asObservable();
  
  private userIdSubject = new BehaviorSubject<string | null>(null);
  userId$ = this.userIdSubject.asObservable();
  
  private userEmailSubject = new BehaviorSubject<string | null>(null);
  userEmail$ = this.userEmailSubject.asObservable();
  
  private usernameSubject = new BehaviorSubject<string | null>(null);
  username$ = this.usernameSubject.asObservable();
  
  private isBrowser: boolean;

  constructor(
    @Optional() private http: HttpClient,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.checkInitialAuth();
  }

  private checkInitialAuth() {
    if (this.isBrowser) {
      const token = sessionStorage.getItem('authToken');
      if (token) {
        this.setAuthToken(token);
        
        // Restore other session data
        const email = sessionStorage.getItem('userEmail');
        const userId = sessionStorage.getItem('userId');
        const username = sessionStorage.getItem('username');
        
        if (email) this.userEmailSubject.next(email);
        if (userId) this.userIdSubject.next(userId);
        if (username) this.usernameSubject.next(username);
      }
    }
  }

  signup(username: string, email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${API_ROUTES.AUTH.SIGNUP}`, { 
      username, 
      email, 
      password 
    }).pipe(
      tap((response: AuthResponse) => {
        if (response.token) {
          this.setAuthToken(response.token);
          this.setUserData(response);
        }
      })
    );
  }

  login(username: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${API_ROUTES.AUTH.LOGIN}`, { 
      username, 
      password 
    }).pipe(
      tap((response: AuthResponse) => {
        if (response.token) {
          this.setAuthToken(response.token);
          this.setUserData(response);
        }
      })
    );
  }

  private setUserData(response: AuthResponse) {
    if (this.isBrowser) {
      if (response.email) {
        sessionStorage.setItem('userEmail', response.email);
        this.userEmailSubject.next(response.email);
      }
      if (response.userId) {
        sessionStorage.setItem('userId', response.userId);
        this.userIdSubject.next(response.userId);
      }
      if (response.username) {
        sessionStorage.setItem('username', response.username);
        this.usernameSubject.next(response.username);
      }
    }
  }

  setAuthToken(token: string) {
    if (this.isBrowser) {
      sessionStorage.setItem('authToken', token);
      this.authTokenSubject.next(token);
      
      try {
        const decodedToken = jwtDecode<DecodedToken>(token);
        if (decodedToken.email) this.userEmailSubject.next(decodedToken.email);
        if (decodedToken.userId) this.userIdSubject.next(decodedToken.userId);
        if (decodedToken.username) this.usernameSubject.next(decodedToken.username);
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
  }

  logout() {
    if (this.isBrowser) {
      sessionStorage.removeItem('authToken');
      sessionStorage.removeItem('userId');
      sessionStorage.removeItem('userEmail');
      sessionStorage.removeItem('username');
    }
    
    this.authTokenSubject.next(null);
    this.userIdSubject.next(null);
    this.userEmailSubject.next(null);
    this.usernameSubject.next(null);
  }

  isLoggedIn(): boolean {
    return !!this.getAuthToken();
  }

  getAuthToken(): string | null {
    return this.authTokenSubject.value;
  }

  getUserId(): string | null {
    return this.userIdSubject.value;
  }

  getUserEmail(): string | null {
    return this.userEmailSubject.value;
  }

  getUsername(): string | null {
    return this.usernameSubject.value;
  }

  getCurrentUser(): { id: string; email: string; username: string } | null {
    const token = this.getAuthToken();
    if (!token) return null;

    try {
      const decodedToken = jwtDecode<DecodedToken>(token);
      return {
        id: decodedToken.userId,
        email: decodedToken.email,
        username: decodedToken.username
      };
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }
}