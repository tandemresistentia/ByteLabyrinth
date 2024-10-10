// project-specification-popup.component.ts
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-project-specification-popup',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule
  ],
  templateUrl: './project-specification-popup.component.html',
  styleUrls: ['./project-specification-popup.component.scss']
})
export class ProjectSpecificationPopupComponent implements OnInit {
  @Input() open: boolean = false;
  @Input() selectedService: any;
  @Output() closePopup = new EventEmitter<void>();

  formGroup: FormGroup;
  
  steps = ['Basic Information', 'Project Details', 'Content Information', 'Technical Requirements', 'Budget Confirmation'];

  constructor(private fb: FormBuilder) {
    this.formGroup = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      company: [''],
      contactMethod: [''],
      projectTimeline: [null],
      websitePurpose: [''],
      targetAudience: [''],
      desiredFeatures: this.fb.group({
        responsiveDesign: [false],
        contactForm: [false],
        seoOptimization: [false]
      }),
      designPreferences: [''],
      contentProvision: [''],
      sitemapIdeas: [''],
      hostingPreferences: [''],
      domainName: [''],
      integrationNeeds: ['']
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.formGroup.valid) {
      console.log(this.formGroup.value);
      this.closePopup.emit();
    }
  }

  onCancel(): void {
    this.closePopup.emit();
  }
}