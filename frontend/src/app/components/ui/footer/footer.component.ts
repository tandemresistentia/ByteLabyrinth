import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule, MatButtonModule],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
  currentYear: number = new Date().getFullYear();
  
  socialLinks = [
    { icon: 'linkedin', url: 'https://www.linkedin.com/in/luis-miguel-vargas-garrido-1743a0114/' },
    { icon: 'code', url: 'https://github.com/tandemresistentia' }, // Using 'code' icon for GitHub
  ];

  constructor(@Inject(DOCUMENT) private document: Document) {}

  openLink(url: string): void {
    this.document.defaultView?.open(url, '_blank');
  }
}