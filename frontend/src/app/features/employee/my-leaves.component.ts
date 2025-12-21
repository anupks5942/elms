import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LeaveService } from '../../core/services/leave.service';
import { LeaveRequest } from '../../core/models/leave-request.model';

@Component({
  selector: 'app-my-leaves',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatProgressBarModule
  ],
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>My Leave Requests</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <div class="table-container">
          <table mat-table [dataSource]="leaveRequests" class="mat-elevation-z8">
            <!-- Start Date Column -->
            <ng-container matColumnDef="startDate">
              <th mat-header-cell *matHeaderCellDef> Start Date </th>
              <td mat-cell *matCellDef="let element"> {{element.startDate}} </td>
            </ng-container>

            <!-- End Date Column -->
            <ng-container matColumnDef="endDate">
              <th mat-header-cell *matHeaderCellDef> End Date </th>
              <td mat-cell *matCellDef="let element"> {{element.endDate}} </td>
            </ng-container>

            <!-- Total Days Column -->
            <ng-container matColumnDef="totalDays">
              <th mat-header-cell *matHeaderCellDef> Total Days </th>
              <td mat-cell *matCellDef="let element"> {{element.totalDays}} </td>
            </ng-container>

            <!-- Status Column -->
            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef> Status </th>
              <td mat-cell *matCellDef="let element">
                <span [class]="'status-' + element.status.toLowerCase()">{{element.status}}</span>
              </td>
            </ng-container>

            <!-- Applied Date Column -->
            <ng-container matColumnDef="appliedDate">
              <th mat-header-cell *matHeaderCellDef> Applied Date </th>
              <td mat-cell *matCellDef="let element"> {{element.appliedDate}} </td>
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
        
        <div *ngIf="!loading && leaveRequests.length === 0" class="no-data">
          No leave requests found.
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
    
    .status-pending {
      color: orange;
      font-weight: bold;
    }
    
    .status-approved {
      color: green;
      font-weight: bold;
    }
    
    .status-rejected {
      color: red;
      font-weight: bold;
    }
    
    .no-data {
      text-align: center;
      padding: 20px;
      color: #777;
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
}