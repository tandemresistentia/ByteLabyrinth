export interface Project {
    _id: string;
    name: string;
    description: string;
    createdAt: string;
    status: 'Pending' | 'Approved' | 'In Progress' | 'Under Review' | 'Completed' | 'On Hold';
    progress: number;
    teamMembers: number;
    tags: string[];
    dueDate?: string;
  }