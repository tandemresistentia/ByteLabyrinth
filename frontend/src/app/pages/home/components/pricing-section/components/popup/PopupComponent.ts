import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-project-specification-popup',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatDialogModule
  ],
  templateUrl: './PopupComponent.html',
  styleUrls: ['./PopupComponent.css']
})
export class ProjectSpecificationPopupComponent {
  @Input() isOpen: boolean = false;
  @Input() service: any;
  @Output() closePopup = new EventEmitter<void>();
  @Output() submitForm = new EventEmitter<any>();

  projectName: string = '';
  projectDescription: string = '';

  close(): void {
    this.closePopup.emit();
  }

  submitSpecification(): void {
    if (this.projectName && this.projectDescription) {
      this.submitForm.emit({
        serviceName: this.service?.name,
        projectName: this.projectName,
        projectDescription: this.projectDescription
      });
      this.close();
    }
  }
}