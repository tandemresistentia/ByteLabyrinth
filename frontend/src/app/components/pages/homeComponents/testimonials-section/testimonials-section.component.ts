import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';

@Component({
  selector: 'app-testimonials-section',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule],
  templateUrl: './testimonials-section.component.html',
  styleUrls: ['./testimonials-section.component.scss'],
  animations: [
    trigger('staggerAnimation', [
      transition('* => *', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(50px)' }),
          stagger(100, [
            animate('500ms cubic-bezier(0.35, 0, 0.25, 1)', 
              style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true })
      ])
    ])
  ]
})
export class TestimonialsSectionComponent {
  testimonials = [
    { name: 'John Doe', company: 'Tech Inc.', text: 'Exceptional service and results! The team went above and beyond our expectations, delivering a website that truly represents our brand and engages our customers.' },
    { name: 'Jane Smith', company: 'Design Co.', text: 'Transformed our online presence. The new website has significantly increased our leads and customer engagement. Their attention to detail and creative solutions are outstanding.' },
    { name: 'Bob Johnson', company: 'E-com Ltd.', text: 'Boosted our sales significantly. The e-commerce solution they built for us is not only beautiful but also highly functional. Our online sales have increased by 200% since launch.' }
  ];
}