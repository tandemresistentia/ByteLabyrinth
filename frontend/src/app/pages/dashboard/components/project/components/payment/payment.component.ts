import { Component, OnInit, Input } from '@angular/core';
import { Stripe, loadStripe } from '@stripe/stripe-js';
import { CommonModule } from '@angular/common';
import { ProjectConstants } from '../../../../../../config/project-constants';
import { ProjectService } from '../../project.service';
import { ProjectStatus } from '../project-status/project-status.enum';
import { MatDialog } from '@angular/material/dialog';
import { PaymentSuccessDialogComponent } from './components/payment-success-dialog.component'; 
import { ActivatedRoute } from '@angular/router';
import { MatDialogModule } from '@angular/material/dialog'; 

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, MatDialogModule],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.scss'
})
export class PaymentComponent implements OnInit{
  private _projectId: string = '';

  @Input() set projectId(value: string) {
    this._projectId = value;  
  }
  @Input() project: any;

  get projectId(): string {
    return this._projectId;  
  }

  stripe: Stripe | null = null;

  constructor(
    private projectService: ProjectService,
    private dialog: MatDialog,
    private route: ActivatedRoute
  ) {}

  async ngOnInit() {
    console.log(this.project);
    this.route.queryParams.subscribe(params => {
      if (params['success'] === 'true' && params['projectId']) {
        this.handlePaymentSuccess();
      }
    })

    try {
      this.stripe = await loadStripe(ProjectConstants.stripe.livePublishableKey);
      if (!this.stripe) {
        console.error('Failed to initialize Stripe. Check your publishable key.');
      }
    } catch (error) {
        console.error('Error initializing Stripe:', error);
    }
  }

  private async handlePaymentSuccess() {
    try {
      await this.projectService.updateProjectStatus(
        this.projectId,
        ProjectStatus.InProgress
      ).toPromise();

      const dialogRef = this.dialog.open(PaymentSuccessDialogComponent, {
        width: '400px',
        disableClose: true
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result === true) {
          window.location.href = window.location.pathname;
        }
      });
    } catch (error) {
      console.error('Failed to update project status:', error);
    }
  }

  private getPriceId(price: number): string {
    switch (price) {
      case ProjectConstants.PRICE.PRICE1:
        return ProjectConstants.stripe.priceId1;
      case ProjectConstants.PRICE.PRICE2:
        return ProjectConstants.stripe.priceId2;
      case ProjectConstants.PRICE.PRICE3:
        return ProjectConstants.stripe.priceId3;
      default:
        console.error('Invalid price:', price);
        return ProjectConstants.stripe.priceId1; // Default fallback
    }
  }

  async makePayment() {
    if (!this.stripe) {
      console.error('Stripe has not been properly initialized');
      return;
    }

    const priceId = this.getPriceId(this.project.price);

    const { error } = await this.stripe.redirectToCheckout({
      lineItems: [{
        price: priceId,
        quantity: 1,
      }],
      mode: 'payment',
      successUrl: `${window.location.origin}/dashboard?success=true&projectId=${this.projectId}`,
      cancelUrl: `${window.location.origin}/dashboard`,
    });

    if (error) {
      console.error('Error', error);
    }
  }
}
