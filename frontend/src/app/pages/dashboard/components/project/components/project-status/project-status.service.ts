import { Injectable } from '@angular/core';
import { ProjectStatus } from './project-status.enum';

@Injectable({
  providedIn: 'root'
})
export class ProjectStatusService {
  private readonly statusStyles: Record<ProjectStatus, { background: string, color: string }> = {
    [ProjectStatus.Pending]: { 
      background: '#faf0f4', 
      color: '#974c6a' 
    },
    [ProjectStatus.Approved]: { 
      background: '#edf6ff', 
      color: '#2c5282' 
    },
    [ProjectStatus.InProgress]: { 
      background: '#fff4e5', 
      color: '#945706' 
    },
    [ProjectStatus.UnderReview]: { 
      background: '#ffe9e9', 
      color: '#af1d1d' 
    },
    [ProjectStatus.Completed]: { 
      background: '#e6f6ed', 
      color: '#1b6e3c' 
    },
    [ProjectStatus.OnHold]: { 
      background: '#f3f4f6', 
      color: '#4b5563' 
    }
  };

  getAllStatuses(): ProjectStatus[] {
    return Object.values(ProjectStatus);
  }

  getStatusStyles(status: ProjectStatus | string): { background: string, color: string } {
    return this.statusStyles[status as ProjectStatus] || { background: '#f3f4f6', color: '#4b5563' };
  }
}