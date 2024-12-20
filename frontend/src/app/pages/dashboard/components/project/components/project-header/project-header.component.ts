import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectStatus } from '../project-status/project-status.enum';
import { ProjectStatusService } from '../project-status/project-status.service';
import { ProjectStatusSelectorComponent } from '../project-status/project-status-selector.component';
import { PaymentComponent } from '../payment/payment.component';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { ProjectConstants } from '../../../../../../config/project-constants';
import { ProjectFileComponent } from './project-file/project-file.component';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-project-header',
  standalone: true,
  imports: [
    CommonModule,
    ProjectStatusSelectorComponent,
    PaymentComponent,
    ProjectFileComponent,
    MatIcon
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
  progressPercentage: number = 0;

  constructor(public projectStatusService: ProjectStatusService) {}

  ngOnInit() {
    this.calculateProgress();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['project'] && !changes['project'].firstChange) {
      this.calculateProgress();
    }
  }

  calculateProgress() {
    if (this.project?.deadline) {
      const start = new Date(this.project.createdAt).getTime();
      const end = new Date(this.project.deadline).getTime();
      const now = new Date().getTime();
      
      const totalTime = end - start;
      const elapsedTime = now - start;
      
      this.progressPercentage = Math.max(0, Math.min(100, 
        Math.round((elapsedTime / totalTime) * 100)
      ));
      
      // Added proper decimal rounding
      if (this.progressPercentage < 1 && elapsedTime > 0) {
        this.progressPercentage = 1;
      }
    }
  }

  onStatusChange(newStatus: ProjectStatus) {
    this.statusChange.emit(newStatus);
  }

  toggleExpand(event: Event) {
    event.stopPropagation();
    this.isExpanded = !this.isExpanded;
  }

}