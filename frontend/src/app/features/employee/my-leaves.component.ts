import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { LeaveService } from '../../core/services/leave.service';
import { LeaveRequest } from '../../core/models/leave-request.model';

@Component({
  selector: 'app-my-leaves',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatProgressBarModule,
    MatChipsModule,
    MatIconModule
  ],
  template: `
    <mat-card class="leave-requests-card">
      <mat-card-header class="card-header">
        <mat-card-title class="card-title">My Leave Requests</mat-card-title>
        <mat-card-subtitle class="card-subtitle">Track the status of your leave applications</mat-card-subtitle>
      </mat-card-header>
      <mat-card-content>
        <div class="table-container">
          <table mat-table [dataSource]="leaveRequests" class="leave-requests-table">
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

            <!-- Applied Date Column -->
            <ng-container matColumnDef="appliedDate">
              <th mat-header-cell *matHeaderCellDef class="applied-header"> Applied Date </th>
              <td mat-cell *matCellDef="let element" class="applied-cell"> {{element.appliedDate | date:'mediumDate'}} </td>
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

        <div *ngIf="!loading && leaveRequests.length === 0" class="no-data">
          <mat-icon class="no-data-icon">event_note</mat-icon>
          <h3 class="no-data-title">No Leave Requests</h3>
          <p class="no-data-message">You haven't applied for any leaves yet.</p>
          <button
            mat-raised-button
            color="primary"
            routerLink="/apply-leave"
            class="apply-now-button">
            Apply for Leave
          </button>
        </div>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .leave-requests-card {
      max-width: 1000px;
      margin: 0 auto;
      overflow: hidden;
    }

    .card-header {
      padding: 24px;
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

    .leave-requests-table {
      width: 100%;
      border-collapse: collapse;
    }

    .header-row {
      background-color: #f5f7fa;
    }

    .date-header, .applied-header {
      font-weight: 600;
      color: var(--text-primary);
    }

    .days-header {
      font-weight: 600;
      color: var(--text-primary);
      text-align: center;
    }

    .status-header {
      font-weight: 600;
      color: var(--text-primary);
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

    .apply-now-button {
      padding: 10px 24px;
      font-weight: 500;
    }

    /* Responsive design */
    @media (max-width: 768px) {
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
export class MyLeavesComponent implements OnInit {
  leaveRequests: LeaveRequest[] = [];
  displayedColumns: string[] = ['startDate', 'endDate', 'totalDays', 'status', 'appliedDate'];
  loading = true;
  currentUserId: number | null = null;

  constructor(
    private leaveService: LeaveService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    // Load current user from localStorage
    const savedUserId = localStorage.getItem('selectedUserId');
    
    if (savedUserId) {
      this.currentUserId = parseInt(savedUserId, 10);
      this.loadMyLeaves();
    }
  }

  loadMyLeaves() {
    if (this.currentUserId) {
      this.loading = true;
      this.leaveService.getMyLeaves(this.currentUserId)
        .subscribe({
          next: (data) => {
            this.leaveRequests = data;
            this.loading = false;
          },
          error: (error) => {
            this.snackBar.open(`Error loading leave requests: ${error.message}`, 'Close', {
              duration: 5000,
              panelClass: ['error-snackbar']
            });
            this.loading = false;
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