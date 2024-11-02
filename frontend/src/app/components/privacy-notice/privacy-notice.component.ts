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
  styles: [`
    .privacy-notice {
      position: fixed;
      bottom: 24px;
      left: 24px;
      right: 24px;
      background: #FDF4EC;
      border-radius: 12px;
      box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
      overflow: hidden;
      z-index: 9999;
      max-width: 1200px;
      margin: 0 auto;
    }

    .gradient-bg {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 2px;
      background: linear-gradient(90deg, #FF9F66, #FFB088);
    }

    .notice-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.25rem 2rem;
      gap: 2rem;
      position: relative;
    }

    p {
      margin: 0;
      font-size: 0.95rem;
      color: #2A323A;
      flex: 1;
      min-width: 280px;
      line-height: 1.6;
      font-weight: 400;
    }

    .highlight {
      display: block;
      font-weight: 600;
      font-size: 1.05rem;
      margin-bottom: 0.5rem;
      color: #1a1a1a;
    }

    .notice-buttons {
      display: flex;
      gap: 1rem;
      align-items: center;
    }

    .got-it-btn {
      padding: 0.7rem 2rem;
      background: linear-gradient(90deg, #FF9F66, #FFB088);
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 600;
      font-size: 0.95rem;
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
    }

    .got-it-btn:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(255, 159, 102, 0.2);
    }

    .got-it-btn:active {
      transform: translateY(0);
    }

    .learn-more-btn {
      padding: 0.7rem 1.5rem;
      background: transparent;
      color: #2A323A;
      border: 1.5px solid rgba(42, 50, 58, 0.2);
      border-radius: 8px;
      cursor: pointer;
      font-weight: 500;
      font-size: 0.95rem;
      transition: all 0.3s ease;
    }

    .learn-more-btn:hover {
      background: rgba(42, 50, 58, 0.03);
      border-color: rgba(42, 50, 58, 0.3);
    }

    @media (max-width: 768px) {
      .privacy-notice {
        bottom: 16px;
        left: 16px;
        right: 16px;
      }

      .notice-content {
        flex-direction: column;
        text-align: center;
        padding: 1.25rem;
        gap: 1.25rem;
      }

      .notice-buttons {
        width: 100%;
        justify-content: center;
      }

      p {
        font-size: 0.9rem;
      }

      .highlight {
        font-size: 1rem;
      }
    }
  `]
})
export class PrivacyNoticeComponent implements OnInit {
  showNotice = true;
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit() {
    if (this.isBrowser) {
      const hasAccepted = localStorage.getItem('privacyNoticeAccepted');
      this.showNotice = !hasAccepted;
    }
  }

  acceptNotice() {
    if (this.isBrowser) {
      localStorage.setItem('privacyNoticeAccepted', 'true');
      this.showNotice = false;
    }
  }

  learnMore() {
  }
}