import { Component, HostListener, ElementRef, Renderer2, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule
  ]
})
export class HeaderComponent {
  private lastScrollTop = 0;
  private readonly SCROLL_THRESHOLD = 50;
  isHeaderVisible = true;

  private el = inject(ElementRef);
  private renderer = inject(Renderer2);

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (currentScrollTop > this.lastScrollTop && currentScrollTop > this.SCROLL_THRESHOLD) {
      // Scrolling down
      if (this.isHeaderVisible) {
        this.isHeaderVisible = false;
      }
    } else if (currentScrollTop < this.lastScrollTop) {
      // Scrolling up
      if (!this.isHeaderVisible) {
        this.isHeaderVisible = true;
      }
    }

    this.lastScrollTop = currentScrollTop <= 0 ? 0 : currentScrollTop;
  }

  scrollTo(elementId: string): void {
    const element = document.getElementById(elementId);
    if (element) {
      const headerOffset = 60; // Adjust this value based on your header's height
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  }
}