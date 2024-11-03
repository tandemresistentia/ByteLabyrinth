import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-privacy-notice',
  standalone: true,
  imports: [CommonModule],
  animations: [
    trigger('slideIn', [
      transition(':enter', [
        style({ transform: 'translateY(100%)' }),
        animate('400ms cubic-bezier(0.4, 0, 0.2, 1)', style({ transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('400ms cubic-bezier(0.4, 0, 0.2, 1)', style({ transform: 'translateY(100%)' }))
      ])
    ])
  ],
  template: `
    <div *ngIf="showNotice" @slideIn class="privacy-notice">
      <div class="gradient-bg"></div>
      <div class="notice-content">
        <p>
          <span class="highlight">🔒 Privacy Notice</span>
          This website uses cookies and similar technologies to enhance your browsing experience. 
          By continuing to use our site, you agree to our use of cookies.
        </p>
        <div class="notice-buttons">
          <button (click)="acceptNotice()" class="got-it-btn">
            <span>Got it!</span>
          </button>
          <button (click)="learnMore()" class="learn-more-btn">
            Learn More
          </button>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./privacy-notice.component.scss'],
})
export class PrivacyNoticeComponent implements OnInit {
  showNotice = false;

  constructor(@Inject(PLATFORM_ID) private platformId: object) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      const hasAccepted = localStorage.getItem('privacyNoticeAccepted');
      this.showNotice = !hasAccepted;
    }
  }

  acceptNotice() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('privacyNoticeAccepted', 'true');
      this.showNotice = false;
    }
  }

  learnMore() {
    // Implement learn more functionality
  }
}