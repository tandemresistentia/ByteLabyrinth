// payment-success-dialog.component.ts
import { Component } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-payment-success-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>Payment Successful!</h2>
    <mat-dialog-content>
      Your payment has been processed successfully and your project status has been updated to In Progress, a developer will start to work on it soon.
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="close()">OK</button>
    </mat-dialog-actions>
  `
})
export class PaymentSuccessDialogComponent {
  constructor(private dialogRef: MatDialogRef<PaymentSuccessDialogComponent>) {}

  close(): void {
    this.dialogRef.close(true); // Pass true to indicate user clicked OK
  }
}