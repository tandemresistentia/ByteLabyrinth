import { Component, ViewChild, ElementRef, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CommonModule } from '@angular/common';
import { HeroSectionComponent } from './components/hero-section/hero-section.component';
import { PricingSectionComponent } from './components/pricing-section/pricing-section.component';
import { ProcessSectionComponent } from './components/process-section/process-section.component';
import { TestimonialsSectionComponent } from './components/testimonials-section/testimonials-section.component';
import { WhyChooseUsSectionComponent } from './components/why-choose-us-section/why-choose-us-section.component';
import { CallToActionSectionComponent } from './components/call-to-action-section/call-to-action-section.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    HeroSectionComponent,
    PricingSectionComponent,
    ProcessSectionComponent,
    TestimonialsSectionComponent,
    WhyChooseUsSectionComponent,
    CallToActionSectionComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  @ViewChild('servicesSection') servicesSection!: ElementRef;
  user: any;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      const userString = localStorage.getItem('user');
      this.user = userString ? JSON.parse(userString) : null;
    }
  }

  scrollToServices() {
    if (isPlatformBrowser(this.platformId)) {
      this.servicesSection.nativeElement.scrollIntoView({ behavior: 'smooth' });
    }
  }
}