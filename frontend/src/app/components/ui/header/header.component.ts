// header.component.ts
import { 
  Component, 
  HostListener, 
  ViewChild, 
  OnInit, 
  OnDestroy, 
  ChangeDetectorRef,
  PLATFORM_ID,
  inject,
  Inject
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { LoginComponent } from '../../../pages/login/login.component';
import { AuthService } from '../../../config/auth.service';
import { Subscription, filter } from 'rxjs';

@Component({
  selector: 'app-header',
  template: `
    <mat-toolbar class="app-header" [class.header-hidden]="!isHeaderVisible">
      <div class="header-content">
        <!-- Left section with logo and menu -->
        <div class="left-section">
          <!-- Mobile Menu Toggle -->
          <button 
            mat-icon-button 
            class="mobile-menu-button"
            (click)="toggleMobileMenu()"
            *ngIf="isMobile"
            aria-label="Toggle navigation menu">
            <mat-icon>{{ isMobileMenuOpen ? 'close' : 'menu' }}</mat-icon>
          </button>

          <!-- Logo/Brand -->
          <a routerLink="/" class="header-title">
            <span>Byte</span>Labyrinth
          </a>
        </div>

        <!-- Desktop Navigation -->
        <div class="desktop-menu" [class.hidden]="isMobile">
          <ng-container *ngIf="isHomePage">
            <button mat-button (click)="scrollTo('hero')">Home</button>
            <button mat-button (click)="scrollTo('pricing-plans')">Services</button>
            <button mat-button (click)="scrollTo('development-process')">Our Process</button>
            <button mat-button (click)="scrollTo('testimonials')">Testimonials</button>
            <button mat-button (click)="scrollTo('why-choose-us')">Why Us</button>
          </ng-container>
        </div>

        <span class="spacer"></span>

        <!-- Dashboard Link (if logged in) -->
        <ng-container *ngIf="isLoggedIn">
          <a mat-button routerLink="/dashboard" class="dashboard-link">
            <mat-icon>dashboard</mat-icon>
            <span class="dashboard-text">Dashboard</span>
          </a>
        </ng-container>

        <!-- Auth Buttons -->
        <ng-container *ngIf="!isLoggedIn; else logoutButton">
          <a mat-raised-button 
             color="primary" 
             (click)="openLoginPopup()"
             class="auth-button">
            Log in
          </a>
        </ng-container>
        <ng-template #logoutButton>
          <a mat-raised-button 
             color="primary" 
             (click)="logout()" 
             class="auth-button logout-button">
            Log out
          </a>
        </ng-template>
      </div>

      <!-- Mobile Navigation Menu -->
      <div class="mobile-menu" [class.open]="isMobileMenuOpen && isMobile">
        <nav>
          <ng-container *ngIf="isHomePage">
            <button mat-button (click)="scrollToAndCloseMenu('hero')">
              <mat-icon>home</mat-icon>
              <span>Home</span>
            </button>
            <button mat-button (click)="scrollToAndCloseMenu('pricing-plans')">
              <mat-icon>shopping_cart</mat-icon>
              <span>Services</span>
            </button>
            <button mat-button (click)="scrollToAndCloseMenu('development-process')">
              <mat-icon>engineering</mat-icon>
              <span>Our Process</span>
            </button>
            <button mat-button (click)="scrollToAndCloseMenu('testimonials')">
              <mat-icon>format_quote</mat-icon>
              <span>Testimonials</span>
            </button>
            <button mat-button (click)="scrollToAndCloseMenu('why-choose-us')">
              <mat-icon>stars</mat-icon>
              <span>Why Us</span>
            </button>
          </ng-container>
          <ng-container *ngIf="isLoggedIn">
            <a mat-button routerLink="/dashboard" class="mobile-dashboard-link">
              <mat-icon>dashboard</mat-icon>
              <span>Dashboard</span>
            </a>
          </ng-container>
        </nav>
      </div>
    </mat-toolbar>
    <app-login/>
  `,
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    LoginComponent
  ]
})
export class HeaderComponent implements OnInit, OnDestroy {
  private lastScrollTop = 0;
  private readonly SCROLL_THRESHOLD = 50;
  isHeaderVisible = true;
  isLoggedIn = false;
  isHomePage = false;
  isMobile = false;
  isMobileMenuOpen = false;
  private isBrowser: boolean;

  private router = inject(Router);
  private authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  private subscriptions = new Subscription();

  @ViewChild(LoginComponent) loginComponent!: LoginComponent;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit() {
    if (this.isBrowser) {
      this.checkScreenSize();
    }

    // Subscribe to router events
    this.subscriptions.add(
      this.router.events.pipe(
        filter(event => event instanceof NavigationEnd)
      ).subscribe((event: any) => {
        this.isHomePage = event.url === '/' || event.url === '/home';
        this.isMobileMenuOpen = false;
        this.cdr.detectChanges();
      })
    );

    // Subscribe to auth changes
    this.subscriptions.add(
      this.authService.authToken$.subscribe(token => {
        this.isLoggedIn = !!token;
        this.cdr.detectChanges();
      })
    );

    // Set initial home page state
    this.isHomePage = this.router.url === '/' || this.router.url === '/home';
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    if (this.isBrowser) {
      this.checkScreenSize();
    }
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (!this.isBrowser) return;

    const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (currentScrollTop > this.lastScrollTop && currentScrollTop > this.SCROLL_THRESHOLD) {
      if (this.isHeaderVisible) {
        this.isHeaderVisible = false;
        this.isMobileMenuOpen = false;
      }
    } else if (currentScrollTop < this.lastScrollTop) {
      if (!this.isHeaderVisible) {
        this.isHeaderVisible = true;
      }
    }

    this.lastScrollTop = currentScrollTop <= 0 ? 0 : currentScrollTop;
  }

  private checkScreenSize() {
    if (this.isBrowser) {
      this.isMobile = window.innerWidth <= 1098;
      if (!this.isMobile) {
        this.isMobileMenuOpen = false;
      }
    }
  }

  scrollTo(elementId: string): void {
    if (!this.isBrowser) return;

    const element = document.getElementById(elementId);
    if (element) {
      const headerOffset = 60;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  }

  scrollToAndCloseMenu(elementId: string) {
    this.scrollTo(elementId);
    this.isMobileMenuOpen = false;
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  openLoginPopup(): void {
    this.loginComponent.show();
  }

  logout(): void {
    this.authService.logout();
  }
}