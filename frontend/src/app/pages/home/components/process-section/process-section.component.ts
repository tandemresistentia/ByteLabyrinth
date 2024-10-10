import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { trigger, transition, style, animate, stagger, query } from '@angular/animations';

@Component({
  selector: 'app-process-section',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule],
  templateUrl: './process-section.component.html',
  styleUrls: ['./process-section.component.scss'],
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
export class ProcessSectionComponent {
  processSteps = [
    { step: 'Discovery', icon: 'explore', description: 'We analyze your needs and goals to create a tailored plan.' },
    { step: 'Design', icon: 'brush', description: 'Our designers create stunning visuals and intuitive interfaces.' },
    { step: 'Development', icon: 'code', description: 'Our developers bring the design to life with clean, efficient code.' },
    { step: 'Testing', icon: 'bug_report', description: 'Rigorous testing ensures a bug-free and smooth user experience.' },
    { step: 'Launch', icon: 'rocket_launch', description: 'We deploy your website and provide post-launch support.' }
  ];
}