// hero-section.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate, state } from '@angular/animations';

@Component({
  selector: 'app-hero-section',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="hero-container">
      <!-- Animated background patterns -->
      <div class="background-patterns">
        <div class="pattern-grid"></div>
        <div class="pattern-circles"></div>
      </div>

      <!-- Floating elements -->
      <div class="floating-elements">
        <div *ngFor="let item of [1,2,3,4,5]" 
             class="floating-circle"
             [style.left.%]="randomPosition()"
             [style.top.%]="randomPosition()"
             [style.animation-delay.s]="item * 0.5">
        </div>
        
        <!-- Additional geometric shapes -->
        <div *ngFor="let item of [1,2,3,4]" 
             class="floating-square"
             [style.left.%]="randomPosition()"
             [style.top.%]="randomPosition()"
             [style.animation-delay.s]="item * 0.3">
        </div>
        
        <div *ngFor="let item of [1,2,3]" 
             class="floating-triangle"
             [style.left.%]="randomPosition()"
             [style.top.%]="randomPosition()"
             [style.animation-delay.s]="item * 0.4">
        </div>
      </div>

      <!-- Side decorations -->
      <div class="side-decoration left"></div>
      <div class="side-decoration right"></div>

      <!-- Stats Cards -->
      <div class="stats-cards" [@fadeInUp]>
        <div class="stat-card">
          <div class="stat-number">50+</div>
          <div class="stat-label">Projects Delivered</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">98%</div>
          <div class="stat-label">Client Satisfaction</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">24/7</div>
          <div class="stat-label">Support</div>
        </div>
      </div>

      <!-- Main content -->
      <div class="content-container" [@fadeInUp]>
        <div class="badge">
          <span class="pulse"></span>
          Trusted by 50+ Companies
        </div>

        <h1 class="title">
          Elevate Your Online Presence with
          <span class="highlight">Custom</span>
          Web Development
        </h1>
        
        <h2 class="subtitle">
          Choose from three tailored options to bring your web vision to life. From
          sleek static sites to dynamic e-commerce platforms, we've got you
          covered.
        </h2>

        <div class="features-grid">
          <div class="feature-item">
            <div class="feature-icon">🚀</div>
            <div class="feature-text">Lightning Fast</div>
          </div>
          <div class="feature-item">
            <div class="feature-icon">🎨</div>
            <div class="feature-text">Custom Design</div>
          </div>
          <div class="feature-item">
            <div class="feature-icon">📱</div>
            <div class="feature-text">Mobile-First</div>
          </div>
        </div>

        <div class="button-container">
          <button class="explore-button" (click)="scrollToServices()">
            <span>Explore Our Services</span>
            <div class="button-ripple"></div>
          </button>
          <a class="contact-button" href="https://www.linkedin.com/in/luis-miguel-vargas-garrido-1743a0114/">
            Contact Us
          </a>
        </div>

        <div class="trust-badges">
          <div class="badge-item">
            <div class="badge-icon">✓</div>
            <div class="badge-text">100% Secure</div>
          </div>
          <div class="badge-item">
            <div class="badge-icon">⚡</div>
            <div class="badge-text">Fast Delivery</div>
          </div>
          <div class="badge-item">
            <div class="badge-icon">★</div>
            <div class="badge-text">5-Star Rated</div>
          </div>
        </div>
      </div>
    </div>
  `,
  animations: [
    trigger('fadeInUp', [
      state('void', style({
        opacity: 0,
        transform: 'translateY(20px)'
      })),
      transition(':enter', [
        animate('1000ms ease-out', style({
          opacity: 1,
          transform: 'translateY(0)'
        }))
      ])
    ])
  ],
  styleUrls: ['./hero-section.component.scss']
})
export class HeroSectionComponent implements OnInit {
  constructor() {}

  ngOnInit() {}

  randomPosition(): number {
    return Math.random() * 100;
  }

  scrollToServices() {
    const element = document.getElementById('pricing-plans');
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
}