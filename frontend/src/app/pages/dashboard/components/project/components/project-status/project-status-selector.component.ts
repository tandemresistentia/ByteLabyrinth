import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { ProjectStatus } from './project-status.enum';
import { ProjectStatusService } from './project-status.service';

@Component({
  selector: 'app-project-status-selector',
  template: `
    <mat-form-field appearance="outline" class="status-selector">
      <mat-label>Project Status</mat-label>
      <mat-select [(value)]="currentStatus" (selectionChange)="onStatusChange($event.value)">
        <mat-option *ngFor="let status of statuses" [value]="status">
          <div class="status-option">
            <div class="status-badge" [ngStyle]="statusService.getStatusStyles(status)">
              {{ status }}
            </div>
          </div>
        </mat-option>
      </mat-select>
    </mat-form-field>
  `,
  styles: [`
    .status-selector {
      width: 100%;
    }
    
    .status-option {
      display: flex;
      align-items: center;
    }

    .status-badge {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 4px 12px;
      border-radius: 16px;
      font-size: 12px;
      font-weight: 500;
      line-height: 1.2;
      white-space: nowrap;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
      transition: all 0.2s ease;
      width: 100%;
    }

    .status-option:hover .status-badge {
      transform: translateY(-1px);
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    
    ::ng-deep .mat-mdc-select-value {
      .status-badge {
        margin-top: 4px;
        margin-bottom: 4px;
      }
    }
  `],
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatSelectModule
  ]
})
export class ProjectStatusSelectorComponent {
  @Input() currentStatus: ProjectStatus = ProjectStatus.Pending;
  @Output() statusChange = new EventEmitter<ProjectStatus>();

  statuses = Object.values(ProjectStatus);

  constructor(public statusService: ProjectStatusService) {} // Changed to public

  onStatusChange(status: ProjectStatus): void {
    this.statusChange.emit(status);
  }
}