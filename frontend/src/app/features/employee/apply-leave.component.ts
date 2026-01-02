import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { LeaveService } from '../../core/services/leave.service';
import { Employee } from '../../core/models/employee.model';

@Component({
  selector: 'app-apply-leave',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule
  ],
  template: `
    <mat-card class="apply-leave-card">
      <mat-card-header class="card-header">
        <mat-card-title class="card-title">Apply for Leave</mat-card-title>
        <mat-card-subtitle class="card-subtitle">Plan your time off in advance</mat-card-subtitle>
      </mat-card-header>
      <mat-card-content>
        <form [formGroup]="leaveForm" (ngSubmit)="onSubmit()" class="leave-form">
          <div class="date-fields">
            <mat-form-field appearance="outline" class="date-field">
              <mat-label>Start Date</mat-label>
              <input
                matInput
                [matDatepicker]="startDatePicker"
                formControlName="startDate"
                placeholder="Choose start date"
                (dateChange)="onDateChange()">
              <mat-datepicker-toggle matSuffix [for]="startDatePicker"></mat-datepicker-toggle>
              <mat-datepicker #startDatePicker></mat-datepicker>
              <mat-error *ngIf="leaveForm.get('startDate')?.invalid">Start date is required</mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="date-field">
              <mat-label>End Date</mat-label>
              <input
                matInput
                [matDatepicker]="endDatePicker"
                formControlName="endDate"
                placeholder="Choose end date"
                (dateChange)="onDateChange()">
              <mat-datepicker-toggle matSuffix [for]="endDatePicker"></mat-datepicker-toggle>
              <mat-datepicker #endDatePicker></mat-datepicker>
              <mat-error *ngIf="leaveForm.get('endDate')?.invalid">End date is required</mat-error>
              <mat-error *ngIf="leaveForm.hasError('dateRangeInvalid')">End date must be after start date</mat-error>
            </mat-form-field>
          </div>

          <!-- Summary Card -->
          <mat-card class="summary-card" *ngIf="totalDays > 0">
            <mat-card-header>
              <mat-card-title class="summary-title">Leave Summary</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <div class="summary-details">
                <div class="summary-item">
                  <span class="label">Total Days:</span>
                  <span class="value">{{ totalDays }}</span>
                </div>
                <div class="summary-item">
                  <span class="label">From:</span>
                  <span class="value">{{ leaveForm.value.startDate | date:'mediumDate' }}</span>
                </div>
                <div class="summary-item">
                  <span class="label">To:</span>
                  <span class="value">{{ leaveForm.value.endDate | date:'mediumDate' }}</span>
                </div>
              </div>
            </mat-card-content>
          </mat-card>

          <div class="button-container">
            <button
              mat-raised-button
              color="primary"
              type="submit"
              [disabled]="leaveForm.invalid"
              class="submit-button">
              <mat-icon>send</mat-icon>
              Submit Leave Request
            </button>
          </div>
        </form>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .apply-leave-card {
      max-width: 700px;
      margin: 0 auto;
      overflow: hidden;
    }

    .card-header {
      text-align: center;
      padding: 24px 24px 16px 24px;
      background: linear-gradient(135deg, var(--primary-color), var(--primary-light));
      color: white;
    }

    .card-title {
      color: white;
      font-size: 1.75rem;
      font-weight: 500;
      margin: 0;
    }

    .card-subtitle {
      color: rgba(255, 255, 255, 0.85);
      margin-top: 8px;
    }

    .leave-form {
      padding: 24px;
    }

    .date-fields {
      display: flex;
      gap: 16px;
      margin-bottom: 24px;
    }

    .date-field {
      flex: 1;
    }

    .summary-card {
      margin: 24px 0;
      background-color: #f9f9f9;
      border-left: 4px solid var(--primary-color);
    }

    .summary-title {
      color: var(--primary-color);
      font-weight: 500;
    }

    .summary-details {
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
    }

    .summary-item {
      display: flex;
      flex-direction: column;
      min-width: 120px;
    }

    .label {
      font-size: 0.8rem;
      color: var(--text-secondary);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .value {
      font-size: 1.1rem;
      font-weight: 500;
      color: var(--text-primary);
    }

    .button-container {
      display: flex;
      justify-content: flex-end;
      margin-top: 16px;
    }

    .submit-button {
      padding: 12px 24px;
      font-weight: 500;
      box-shadow: 0 4px 6px rgba(25, 118, 210, 0.2);
    }

    .submit-button:hover {
      box-shadow: 0 6px 8px rgba(25, 118, 210, 0.3);
    }

    @media (max-width: 768px) {
      .date-fields {
        flex-direction: column;
        gap: 0;
      }
    }
  `]
})
export class ApplyLeaveComponent implements OnInit {
  leaveForm: FormGroup;
  currentUser: Employee | null = null;
  totalDays: number = 0;

  constructor(
    private fb: FormBuilder,
    private leaveService: LeaveService,
    private snackBar: MatSnackBar
  ) {
    this.leaveForm = this.fb.group({
      startDate: ['', Validators.required],
      endDate: ['', Validators.required]
    }, { validators: this.dateRangeValidator });
  }

  ngOnInit() {
    // Load current user from localStorage
    const savedUserId = localStorage.getItem('selectedUserId');
    const savedUserRole = localStorage.getItem('selectedUserRole');
    
    if (savedUserId && savedUserRole) {
      this.currentUser = {
        id: parseInt(savedUserId, 10),
        name: '', // Name is not needed for the form
        role: savedUserRole as 'Manager' | 'Employee',
        leaveBalance: 0 // Balance is not needed for the form
      };
    }
  }

  dateRangeValidator(form: FormGroup) {
    const startDate = form.get('startDate')?.value;
    const endDate = form.get('endDate')?.value;

    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      return { dateRangeInvalid: true };
    }
    return null;
  }

  onSubmit() {
    if (this.leaveForm.valid && this.currentUser) {
      const { startDate, endDate } = this.leaveForm.value;

      // Format dates to ISO string
      const formattedStartDate = new Date(startDate).toISOString().split('T')[0];
      const formattedEndDate = new Date(endDate).toISOString().split('T')[0];

      this.leaveService.applyLeave(this.currentUser.id, formattedStartDate, formattedEndDate)
        .subscribe({
          next: (response) => {
            this.snackBar.open('Leave request submitted successfully!', 'Close', {
              duration: 3000,
              panelClass: ['success-snackbar']
            });
            this.leaveForm.reset();
            this.totalDays = 0; // Reset total days
          },
          error: (error) => {
            this.snackBar.open(`Error: ${error.message}`, 'Close', {
              duration: 5000,
              panelClass: ['error-snackbar']
            });
          }
        });
    }
  }

  onDateChange() {
    const startDate = this.leaveForm.get('startDate')?.value;
    const endDate = this.leaveForm.get('endDate')?.value;

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);

      // Calculate total days (inclusive of start and end dates)
      const timeDifference = end.getTime() - start.getTime();
      this.totalDays = Math.floor(timeDifference / (1000 * 3600 * 24)) + 1;
    } else {
      this.totalDays = 0;
    }
  }
}