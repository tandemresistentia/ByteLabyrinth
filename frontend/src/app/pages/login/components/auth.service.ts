import { Injectable, Optional, PLATFORM_ID, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { jwtDecode } from "jwt-decode";
import { API_ROUTES } from 'src/app/config/api-routes';

interface DecodedToken {
  userId: string;
  email: string;
  iat: number;
  exp: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authTokenSubject = new BehaviorSubject<string | null>(null);
  authToken$ = this.authTokenSubject.asObservable();
  private userIdSubject = new BehaviorSubject<string | null>(null);
  userId$ = this.userIdSubject.asObservable();
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
      }
    }
  }

  getCurrentUser(): { id: string; email: string } | null {
    const token = this.getAuthToken();
    if (!token) return null;

    try {
      const decodedToken = jwtDecode(token) as DecodedToken;
      return {
        id: decodedToken.userId,
        email: decodedToken.email
      };
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post(`${API_ROUTES.AUTH.LOGIN}`, { username, password }).pipe(
      tap((response: any) => {
        if (response && response.token) {
          this.setAuthToken(response.token);
        }
      })
    );
  }

  signup(username: string, email: string, password: string): Observable<any> {
    return this.http.post(`${API_ROUTES.AUTH.SIGNUP}`, { username, email, password }).pipe(
      tap((response: any) => {
        if (response && response.token) {
          this.setAuthToken(response.token);
        }
      })
    );
  }

  setAuthToken(token: string) {
    if (this.isBrowser) {
      sessionStorage.setItem('authToken', token);
    }
    this.authTokenSubject.next(token);
    
    try {
      const decodedToken = jwtDecode(token) as DecodedToken;
      this.setUserId(decodedToken.userId);
    } catch (error) {
      console.error('Error decoding token:', error);
    }
  }

  setUserId(userId: string) {
    if (this.isBrowser) {
      sessionStorage.setItem('userId', userId);
    }
    this.userIdSubject.next(userId);
  }

  logout() {
    if (this.isBrowser) {
      sessionStorage.removeItem('authToken');
      sessionStorage.removeItem('userId');
    }
    this.authTokenSubject.next(null);
    this.userIdSubject.next(null);
  }

  isLoggedIn(): boolean {
    return !!this.authTokenSubject.value && !!this.userIdSubject.value;
  }

  getAuthToken(): string | null {
    return this.authTokenSubject.value;
  }

  getUserId(): string | null {
    return this.userIdSubject.value;
  }
}