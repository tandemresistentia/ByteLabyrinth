import { Injectable } from '@angular/core';
import { ProjectStatus } from './project-status.enum';

@Injectable({
  providedIn: 'root'
})
export class ProjectStatusService {
  private readonly statusColors: Record<ProjectStatus, string> = {
    [ProjectStatus.Pending]: 'warn',
    [ProjectStatus.Approved]: 'primary',
    [ProjectStatus.InProgress]: 'accent',
    [ProjectStatus.UnderReview]: 'warn',
    [ProjectStatus.Completed]: 'primary',
    [ProjectStatus.OnHold]: 'warn'
  };

  getAllStatuses(): ProjectStatus[] {
    return Object.values(ProjectStatus);
  }

  getStatusColor(status: ProjectStatus | string): string {
    return this.statusColors[status as ProjectStatus] || 'primary';
  }
}