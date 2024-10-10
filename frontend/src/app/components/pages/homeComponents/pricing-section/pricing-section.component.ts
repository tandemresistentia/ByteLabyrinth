import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-pricing-section',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './pricing-section.component.html',
  styleUrls: ['./pricing-section.component.scss']
})
export class PricingSectionComponent {
  services = [
    {
      id: 1,
      name: 'Starter',
      description: 'Perfect for small businesses or personal projects',
      price: '$799',
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
      price: '$1,499',
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
      price: '$2,999',
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

  handleServiceSelect(serviceId: number): void {
    console.log(`Selected service: ${serviceId}`);
  }
}