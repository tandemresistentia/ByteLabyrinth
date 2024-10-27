import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
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
            {{ status }}
            <mat-chip [color]="getStatusColor(status)" selected>
              {{ status }}
            </mat-chip>
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
      justify-content: space-between;
      align-items: center;
    }
    mat-chip {
      min-height: 24px;
      font-size: 12px;
    }
  `],
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatChipsModule
  ]
})
export class ProjectStatusSelectorComponent {
  @Input() currentStatus: ProjectStatus = ProjectStatus.Pending;
  @Output() statusChange = new EventEmitter<ProjectStatus>();

  statuses = Object.values(ProjectStatus);

  constructor(private statusService: ProjectStatusService) {}

  getStatusColor(status: ProjectStatus): string {
    return this.statusService.getStatusColor(status);
  }

  onStatusChange(status: ProjectStatus): void {
    this.statusChange.emit(status);
  }
}