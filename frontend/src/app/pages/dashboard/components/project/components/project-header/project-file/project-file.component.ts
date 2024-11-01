// project-file/components/project-file.component.ts
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ProjectFileService } from './project-file.service';
import { ProjectConstants } from '../../../project-constants';

@Component({
  selector: 'app-project-file',
  standalone: true,
  imports: [
    CommonModule,
    MatProgressBarModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './project-file.component.html',
  styleUrls: ['./project-file.component.scss']
})
export class ProjectFileComponent implements OnChanges {
  @Input() project!: any;
  @Input() isAdmin: boolean = false;

  isUploading: boolean = false;
  uploadProgress: number = 0;
  uploadError: string | null = null;
  canDownload: boolean = false;

  constructor(private projectFileService: ProjectFileService) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['project']) {
      this.resetUploadState();
      this.updateDownloadPermission();
    }
  }

  private resetUploadState() {
    this.uploadError = null;
    this.uploadProgress = 0;
    this.isUploading = false;
  }

  private updateDownloadPermission() {
    // Allow download if project is completed and has a delivery file
    this.canDownload = this.project?.status === 'Completed' && 
                      !!this.project?.file?.path;
  }

  onFileSelected(event: any) {
    if (!this.isAdmin) return;
    
    const file = event.target.files[0];
    if (file) {
      if (!file.type.includes('zip')) {
        this.uploadError = 'Only ZIP files are allowed';
        return;
      }
      this.uploadFile(file);
    }
  }

  private uploadFile(file: File) {
    this.isUploading = true;
    this.uploadError = null;

    this.projectFileService.uploadProjectFile(this.project._id, file)
      .subscribe({
        next: (progress: number) => {
          this.uploadProgress = progress;
          if (progress === 100) {
            setTimeout(() => {
              this.resetUploadState();
              // You might want to emit an event here to refresh the project data
            }, 1000);
          }
        },
        error: (error) => {
          this.uploadError = error.message || 'Upload failed';
          this.isUploading = false;
          this.uploadProgress = 0;
        }
      });
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  downloadFile(event: Event) {
    event.preventDefault();
    if (!this.canDownload) return;

    if (this.project?.file) {
      this.projectFileService.downloadProjectFile(this.project._id)
        .subscribe({
          next: (blob) => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = this.project.file?.fileName || 'project-file.zip';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
          },
          error: (error) => {
            console.error('Download failed:', error);
            // You might want to show an error message to the user
          }
        });
    }
  }
}