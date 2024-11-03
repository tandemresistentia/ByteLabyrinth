import { Component, Output, EventEmitter, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ProjectSpecificationPopupComponent } from './components/popup/PopupComponent';
import { AuthService } from '../../../../config/auth.service';
import { LoginComponent } from '../../../login/login.component';
import { ProjectConstants } from 'src/app/config/project-constants';

@Component({
  selector: 'app-pricing-section',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    ProjectSpecificationPopupComponent,
    LoginComponent
  ],
  templateUrl: './pricing-section.component.html',
  styleUrls: ['./pricing-section.component.scss']
})
export class PricingSectionComponent {
  @Output() openPopup = new EventEmitter<any>();
  @ViewChild(LoginComponent) loginComponent!: LoginComponent;
  services = [
    {
      id: 1,
      name: 'Starter',
      description: 'Perfect for small businesses or personal projects',
      price: ProjectConstants.PRICE.PRICE1,
      icon: 'check_circle',
      features: [
        '5-page responsive website',
        'Custom design',
        'Contact form',
        'Basic SEO optimization',
        'Social media integration',
      ],
    },
    {
      id: 2,
      name: 'Professional',
      description: 'Ideal for growing businesses with dynamic content needs',
      price: ProjectConstants.PRICE.PRICE2,
      icon: 'code',
      features: [
        '10-page responsive website',
        'Custom design with animations',
        'Content Management System (CMS)',
        'Blog functionality',
        'Advanced SEO package',
        'Google Analytics integration',
        'Speed optimization',
      ],
      popular: true,
    },
    {
      id: 3,
      name: 'E-commerce',
      description: 'Full-featured online store for serious sellers',
      price: ProjectConstants.PRICE.PRICE3,
      icon: 'shopping_cart',
      features: [
        'Fully responsive e-commerce website',
        'Up to 100 products',
        'Secure payment gateway integration',
        'Inventory management system',
        'Customer account portals',
        'Order tracking',
        'Email marketing integration',
        'Advanced SEO & marketing tools',
      ],
    },
  ];

  isPopupOpen = false;
  selectedService: any = null;

  constructor(private authService: AuthService) {}

  handleServiceSelect(serviceId: number): void {
    if (this.authService.isLoggedIn()) {
      this.selectedService = this.services.find(service => service.id === serviceId);
      this.isPopupOpen = true;
    } else {
      this.openLoginDialog();
    }
  }

  closePopup(): void {
    this.isPopupOpen = false;
    this.selectedService = null;
  }

  handleFormSubmit(formData: any): void {
    // Handle the form submission (e.g., send to a service, update state, etc.)
    this.closePopup();
  }

  openLoginDialog(): void {
    this.loginComponent.show();
}
}