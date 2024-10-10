import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';
import { InteractiveChartComponent } from './components/interactive-chart.component';

@Component({
  selector: 'app-why-choose-us-section',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatCardModule, InteractiveChartComponent],
  templateUrl: './why-choose-us-section.component.html',
  styleUrls: ['./why-choose-us-section.component.scss'],
  animations: [
    trigger('staggerAnimation', [
      transition('* => *', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateX(-50px)' }),
          stagger(100, [
            animate('500ms cubic-bezier(0.35, 0, 0.25, 1)', 
              style({ opacity: 1, transform: 'translateX(0)' }))
          ])
        ], { optional: true })
      ])
    ])
  ]
})
export class WhyChooseUsSectionComponent {
  reasons = [
    { text: 'Experienced Team of Professionals', description: 'Our team consists of industry veterans with decades of combined experience.', icon: 'lightbulb' },
    { text: 'Tailored Solutions for Your Business', description: 'We don\'t believe in one-size-fits-all. Every solution is customized to your unique needs.', icon: 'check_circle' },
    { text: 'On-Time and On-Budget Delivery', description: 'We respect your time and resources, ensuring projects are completed as promised.', icon: 'schedule' },
    { text: 'Ongoing Support and Maintenance', description: 'Our relationship doesn\'t end at launch. We provide continuous support to ensure your success.', icon: 'build' }
  ];
}