import { Injectable, Optional, PLATFORM_ID, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/auth';
  private authTokenSubject = new BehaviorSubject<string | null>(null);
  authToken$ = this.authTokenSubject.asObservable();
  private isBrowser: boolean;

  constructor(
    @Optional() private http: HttpClient,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.checkInitialToken();
  }

  private checkInitialToken() {
    if (this.isBrowser) {
      const token = sessionStorage.getItem('authToken');
      if (token) {
        this.authTokenSubject.next(token);
      }
    }
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { username, password }).pipe(
      tap((response: any) => {
        if (response && response.token) {
          this.setAuthToken(response.token);
        }
      })
    );
  }

  signup(username: string, email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/signup`, { username, email, password }).pipe(
      tap((response: any) => {
        if (response && response.token) {
          this.setAuthToken(response.token);
        }
      })
    );
  }

  setAuthToken(token: string) {
    console.log('Setting auth token:', token);
    if (this.isBrowser) {
      sessionStorage.setItem('authToken', token);
    }
    this.authTokenSubject.next(token);
  }

  removeAuthToken() {
    console.log('Removing auth token');
    if (this.isBrowser) {
      sessionStorage.removeItem('authToken');
    }
    this.authTokenSubject.next(null);
  }

  isLoggedIn(): boolean {
    return !!this.authTokenSubject.value;
  }

  getAuthToken(): string | null {
    return sessionStorage.getItem('authToken');
  }
}