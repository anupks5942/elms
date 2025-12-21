import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBar } from '@angular/material/snack-bar';
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
    MatNativeDateModule
  ],
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>Apply for Leave</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <form [formGroup]="leaveForm" (ngSubmit)="onSubmit()">
          <mat-form-field appearance="fill" class="full-width">
            <mat-label>Start Date</mat-label>
            <input
              matInput
              [matDatepicker]="startDatePicker"
              formControlName="startDate"
              placeholder="Choose start date"
              (dateChange)="onDateChange()">
            <mat-datepicker-toggle matSuffix [for]="startDatePicker"></mat-datepicker-toggle>
            <mat-datepicker #startDatePicker></mat-datepicker>
          </mat-form-field>

          <mat-form-field appearance="fill" class="full-width">
            <mat-label>End Date</mat-label>
            <input
              matInput
              [matDatepicker]="endDatePicker"
              formControlName="endDate"
              placeholder="Choose end date"
              (dateChange)="onDateChange()">
            <mat-datepicker-toggle matSuffix [for]="endDatePicker"></mat-datepicker-toggle>
            <mat-datepicker #endDatePicker></mat-datepicker>
          </mat-form-field>

          <!-- Summary Card -->
          <mat-card class="summary-card" *ngIf="totalDays > 0">
            <mat-card-header>
              <mat-card-title>Leave Summary</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <p>Total Days: <strong>{{ totalDays }}</strong></p>
              <p>From: <strong>{{ leaveForm.value.startDate | date:'mediumDate' }}</strong></p>
              <p>To: <strong>{{ leaveForm.value.endDate | date:'mediumDate' }}</strong></p>
            </mat-card-content>
          </mat-card>

          <div class="button-container">
            <button
              mat-raised-button
              color="primary"
              type="submit"
              [disabled]="leaveForm.invalid">
              Submit Leave Request
            </button>
          </div>
        </form>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .full-width {
      width: 100%;
      margin-bottom: 16px;
    }
    
    .button-container {
      display: flex;
      justify-content: flex-end;
      margin-top: 20px;
    }

    .summary-card {
      margin: 20px 0;
      background-color: #f5f5f5;
    }

    mat-card {
      max-width: 600px;
      margin: 0 auto;
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