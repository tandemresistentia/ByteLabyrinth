import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectStatus } from '../project-status/project-status.enum';
import { ProjectStatusService } from '../project-status/project-status.service';
import { ProjectStatusSelectorComponent } from '../project-status/project-status-selector.component';
import { PaymentComponent } from '../payment/payment.component';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-project-header',
  standalone: true,
  imports: [
    CommonModule,
    ProjectStatusSelectorComponent,
    PaymentComponent
  ],
  templateUrl: './project-header.component.html',
  styleUrl: './project-header.component.scss',
  animations: [
    trigger('expandCollapse', [
      state('collapsed', style({
        height: '0',
        opacity: '0',
        overflow: 'hidden'
      })),
      state('expanded', style({
        height: '*',
        opacity: '1'
      })),
      transition('collapsed <=> expanded', [
        animate('300ms ease-in-out')
      ])
    ])
  ]
})
export class ProjectHeaderComponent {
  @Input() project: any = {
    _id: '123',
    name: 'Project Name',
    createdAt: new Date(),
    status: ProjectStatus.InProgress,
    description: 'A comprehensive project management system with real-time updates and collaborative features.',
    client: {
      name: 'John Smith',
      email: 'john@example.com',
      company: 'Tech Solutions Inc.'
    },
    budget: 75000,
    deadline: new Date('2024-12-31'),
    progress: 65,
    team: [
      { name: 'Sarah Johnson', role: 'Project Manager', avatar: 'SJ' },
      { name: 'Mike Chen', role: 'Lead Developer', avatar: 'MC' },
      { name: 'Ana Silva', role: 'UI/UX Designer', avatar: 'AS' }
    ],
    technologies: ['Angular', 'Node.js', 'MongoDB', 'AWS'],
    nextMilestone: {
      name: 'Beta Release',
      dueDate: new Date('2024-06-30'),
      progress: 45
    }
  };
  @Input() isAdmin: boolean = false;
  @Output() statusChange = new EventEmitter<ProjectStatus>();

  isExpanded = false;

  constructor(public projectStatusService: ProjectStatusService) {}

  onStatusChange(newStatus: ProjectStatus) {
    this.statusChange.emit(newStatus);
  }

  toggleExpand(event: Event) {
    event.stopPropagation();
    this.isExpanded = !this.isExpanded;
  }
}