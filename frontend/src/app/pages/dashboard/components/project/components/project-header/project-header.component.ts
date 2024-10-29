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
        opacity: '0'
      })),
      state('expanded', style({
        height: '*',
        opacity: '1'
      })),
      transition('collapsed <=> expanded', [
        animate('200ms ease-in-out')
      ])
    ])
  ]
})
export class ProjectHeaderComponent {
  @Input() project: any;
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