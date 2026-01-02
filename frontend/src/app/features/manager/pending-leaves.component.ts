import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { LeaveService } from '../../core/services/leave.service';
import { LeaveRequest } from '../../core/models/leave-request.model';

@Component({
  selector: 'app-pending-leaves',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatProgressBarModule,
    MatChipsModule,
    MatIconModule
  ],
  template: `
    <mat-card class="pending-requests-card">
      <mat-card-header class="card-header">
        <mat-card-title class="card-title">Pending Leave Requests</mat-card-title>
        <mat-card-subtitle class="card-subtitle">Review and manage pending leave applications</mat-card-subtitle>
      </mat-card-header>
      <mat-card-content>
        <div class="table-container">
          <table mat-table [dataSource]="pendingLeaves" class="pending-requests-table">
            <!-- Employee Name Column -->
            <ng-container matColumnDef="employeeName">
              <th mat-header-cell *matHeaderCellDef class="employee-header"> Employee Name </th>
              <td mat-cell *matCellDef="let element" class="employee-cell">
                <div class="employee-info">
                  <mat-icon class="employee-icon">person</mat-icon>
                  <span class="employee-name">{{element.employeeName}}</span>
                </div>
              </td>
            </ng-container>

            <!-- Start Date Column -->
            <ng-container matColumnDef="startDate">
              <th mat-header-cell *matHeaderCellDef class="date-header"> Start Date </th>
              <td mat-cell *matCellDef="let element" class="date-cell"> {{element.startDate | date:'mediumDate'}} </td>
            </ng-container>

            <!-- End Date Column -->
            <ng-container matColumnDef="endDate">
              <th mat-header-cell *matHeaderCellDef class="date-header"> End Date </th>
              <td mat-cell *matCellDef="let element" class="date-cell"> {{element.endDate | date:'mediumDate'}} </td>
            </ng-container>

            <!-- Total Days Column -->
            <ng-container matColumnDef="totalDays">
              <th mat-header-cell *matHeaderCellDef class="days-header"> Total Days </th>
              <td mat-cell *matCellDef="let element" class="days-cell">
                <span class="days-badge">{{element.totalDays}}</span>
              </td>
            </ng-container>

            <!-- Applied Date Column -->
            <ng-container matColumnDef="appliedDate">
              <th mat-header-cell *matHeaderCellDef class="applied-header"> Applied Date </th>
              <td mat-cell *matCellDef="let element" class="applied-cell"> {{element.appliedDate | date:'mediumDate'}} </td>
            </ng-container>

            <!-- Status Column -->
            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef class="status-header"> Status </th>
              <td mat-cell *matCellDef="let element" class="status-cell">
                <mat-chip-set>
                  <mat-chip
                    [color]="getStatusColor(element.status)"
                    [disabled]="true"
                    class="status-chip">
                    {{element.status}}
                  </mat-chip>
                </mat-chip-set>
              </td>
            </ng-container>

            <!-- Actions Column -->
            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef class="actions-header"> Actions </th>
              <td mat-cell *matCellDef="let element" class="actions-cell">
                <button
                  mat-raised-button
                  color="primary"
                  (click)="approveLeave(element.id)"
                  class="action-button approve-button">
                  <mat-icon>check</mat-icon>
                  Approve
                </button>
                <button
                  mat-raised-button
                  color="warn"
                  (click)="rejectLeave(element.id)"
                  class="action-button reject-button">
                  <mat-icon>close</mat-icon>
                  Reject
                </button>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns" class="header-row"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;" class="data-row"></tr>
          </table>
        </div>

        <mat-progress-bar
          mode="indeterminate"
          *ngIf="loading"
          class="loading-bar">
        </mat-progress-bar>

        <div *ngIf="!loading && pendingLeaves.length === 0" class="no-data">
          <mat-icon class="no-data-icon">event_available</mat-icon>
          <h3 class="no-data-title">No Pending Requests</h3>
          <p class="no-data-message">There are no pending leave requests to review.</p>
        </div>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .pending-requests-card {
      max-width: 1200px;
      margin: 0 auto;
      overflow: hidden;
    }

    .card-header {
      padding: 24px;
      background: linear-gradient(135deg, var(--secondary-color), #f06292);
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

    .pending-requests-table {
      width: 100%;
      border-collapse: collapse;
    }

    .header-row {
      background-color: #f5f7fa;
    }

    .employee-header, .date-header, .applied-header {
      font-weight: 600;
      color: var(--text-primary);
    }

    .days-header {
      font-weight: 600;
      color: var(--text-primary);
      text-align: center;
    }

    .status-header, .actions-header {
      font-weight: 600;
      color: var(--text-primary);
    }

    .employee-cell {
      display: flex;
      align-items: center;
    }

    .employee-info {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .employee-icon {
      color: var(--primary-color);
    }

    .date-cell, .applied-cell {
      color: var(--text-primary);
    }

    .days-cell {
      text-align: center;
    }

    .days-badge {
      display: inline-block;
      padding: 4px 12px;
      background-color: #e3f2fd;
      color: var(--primary-color);
      border-radius: 16px;
      font-weight: 500;
      min-width: 40px;
      text-align: center;
    }

    .status-chip {
      border-radius: 16px;
      font-size: 12px;
      font-weight: 500;
      padding: 4px 12px;
    }

    .actions-cell {
      display: flex;
      gap: 8px;
    }

    .action-button {
      padding: 6px 16px;
      font-size: 13px;
      font-weight: 500;
      min-width: auto;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .approve-button {
      box-shadow: 0 2px 4px rgba(76, 175, 80, 0.2);
    }

    .approve-button:hover {
      box-shadow: 0 4px 8px rgba(76, 175, 80, 0.3);
    }

    .reject-button {
      box-shadow: 0 2px 4px rgba(244, 67, 54, 0.2);
    }

    .reject-button:hover {
      box-shadow: 0 4px 8px rgba(244, 67, 54, 0.3);
    }

    .data-row:hover {
      background-color: #f9f9f9;
    }

    .table-container {
      border-radius: var(--border-radius);
      overflow: hidden;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }

    .loading-bar {
      margin-top: 24px;
    }

    .no-data {
      text-align: center;
      padding: 40px 20px;
      color: var(--text-secondary);
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .no-data-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      color: var(--text-secondary);
      margin-bottom: 16px;
    }

    .no-data-title {
      color: var(--text-primary);
      font-size: 1.5rem;
      margin: 0 0 8px 0;
    }

    .no-data-message {
      margin: 0 0 24px 0;
      font-size: 1rem;
    }

    /* Responsive design */
    @media (max-width: 768px) {
      .actions-cell {
        flex-direction: column;
      }

      .action-button {
        width: 100%;
        justify-content: center;
      }

      table {
        display: block;
      }

      tr {
        display: flex;
        flex-direction: column;
        border-bottom: 1px solid var(--border-color);
        padding: 16px 0;
      }

      th, td {
        display: block;
        text-align: left;
        padding: 8px 16px !important;
      }

      .header-row {
        display: none;
      }

      .data-row {
        flex-wrap: wrap;
      }

      .days-cell {
        text-align: left;
      }

      .days-badge {
        margin-left: 16px;
      }
    }
  `]
})
export class PendingLeavesComponent implements OnInit {
  pendingLeaves: LeaveRequest[] = [];
  displayedColumns: string[] = ['employeeName', 'startDate', 'endDate', 'totalDays', 'appliedDate', 'status', 'actions'];
  loading = true;

  constructor(
    private leaveService: LeaveService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadPendingLeaves();
  }

  loadPendingLeaves() {
    this.loading = true;
    this.leaveService.getPendingLeaves()
      .subscribe({
        next: (data) => {
          this.pendingLeaves = data;
          this.loading = false;
        },
        error: (error) => {
          this.snackBar.open(`Error loading pending leaves: ${error.message}`, 'Close', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
          this.loading = false;
        }
      });
  }

  approveLeave(leaveId: number) {
    if (confirm('Are you sure you want to approve this leave request?')) {
      this.leaveService.approveLeave(leaveId)
        .subscribe({
          next: () => {
            this.snackBar.open('Leave request approved successfully!', 'Close', {
              duration: 3000,
              panelClass: ['success-snackbar']
            });
            // Remove the approved leave from the list
            this.pendingLeaves = this.pendingLeaves.filter(leave => leave.id !== leaveId);
          },
          error: (error) => {
            this.snackBar.open(`Error approving leave: ${error.message}`, 'Close', {
              duration: 5000,
              panelClass: ['error-snackbar']
            });
          }
        });
    }
  }

  rejectLeave(leaveId: number) {
    if (confirm('Are you sure you want to reject this leave request?')) {
      this.leaveService.rejectLeave(leaveId)
        .subscribe({
          next: () => {
            this.snackBar.open('Leave request rejected successfully!', 'Close', {
              duration: 3000,
              panelClass: ['success-snackbar']
            });
            // Remove the rejected leave from the list
            this.pendingLeaves = this.pendingLeaves.filter(leave => leave.id !== leaveId);
          },
          error: (error) => {
            this.snackBar.open(`Error rejecting leave: ${error.message}`, 'Close', {
              duration: 5000,
              panelClass: ['error-snackbar']
            });
          }
        });
    }
  }

  getStatusColor(status: string): string {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'warning';
      case 'approved':
        return 'accent';
      case 'rejected':
        return 'warn';
      default:
        return 'primary';
    }
  }
}