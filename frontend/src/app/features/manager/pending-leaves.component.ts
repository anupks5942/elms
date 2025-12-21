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
    <mat-card>
      <mat-card-header>
        <mat-card-title>Pending Leave Requests</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <div class="table-container">
          <table mat-table [dataSource]="pendingLeaves" class="mat-elevation-z8">
            <!-- Employee Name Column -->
            <ng-container matColumnDef="employeeName">
              <th mat-header-cell *matHeaderCellDef> Employee Name </th>
              <td mat-cell *matCellDef="let element"> {{element.employeeName}} </td>
            </ng-container>

            <!-- Start Date Column -->
            <ng-container matColumnDef="startDate">
              <th mat-header-cell *matHeaderCellDef> Start Date </th>
              <td mat-cell *matCellDef="let element"> {{element.startDate | date:'mediumDate'}} </td>
            </ng-container>

            <!-- End Date Column -->
            <ng-container matColumnDef="endDate">
              <th mat-header-cell *matHeaderCellDef> End Date </th>
              <td mat-cell *matCellDef="let element"> {{element.endDate | date:'mediumDate'}} </td>
            </ng-container>

            <!-- Total Days Column -->
            <ng-container matColumnDef="totalDays">
              <th mat-header-cell *matHeaderCellDef> Total Days </th>
              <td mat-cell *matCellDef="let element"> {{element.totalDays}} </td>
            </ng-container>

            <!-- Applied Date Column -->
            <ng-container matColumnDef="appliedDate">
              <th mat-header-cell *matHeaderCellDef> Applied Date </th>
              <td mat-cell *matCellDef="let element"> {{element.appliedDate | date:'mediumDate'}} </td>
            </ng-container>

            <!-- Status Column -->
            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef> Status </th>
              <td mat-cell *matCellDef="let element">
                <mat-chip-set>
                  <mat-chip
                    [color]="getStatusColor(element.status)"
                    [disabled]="true">
                    {{element.status}}
                  </mat-chip>
                </mat-chip-set>
              </td>
            </ng-container>

            <!-- Actions Column -->
            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef> Actions </th>
              <td mat-cell *matCellDef="let element">
                <button
                  mat-raised-button
                  color="primary"
                  (click)="approveLeave(element.id)"
                  class="action-button">
                  Approve
                </button>
                <button
                  mat-raised-button
                  color="warn"
                  (click)="rejectLeave(element.id)"
                  class="action-button">
                  Reject
                </button>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
          </table>
        </div>

        <mat-progress-bar 
          mode="indeterminate" 
          *ngIf="loading"
          style="margin-top: 20px;">
        </mat-progress-bar>
        
        <div *ngIf="!loading && pendingLeaves.length === 0" class="no-data">
          <mat-icon>event_busy</mat-icon>
          <p>No pending leave requests.</p>
        </div>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    table {
      width: 100%;
    }

    .table-container {
      overflow-x: auto;
    }

    .action-button {
      margin-right: 8px;
    }

    .no-data {
      text-align: center;
      padding: 20px;
      color: #777;
      display: flex;
      flex-direction: column;
      align-items: center;
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