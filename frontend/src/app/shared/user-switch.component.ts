import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Employee } from '../core/models/employee.model';

@Component({
  selector: 'app-user-switch',
  standalone: true,
  imports: [
    CommonModule,
    MatSelectModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule
  ],
  template: `
    <mat-form-field class="user-switch-field" appearance="outline">
      <mat-label>Act As User</mat-label>
      <mat-select [(ngModel)]="selectedUserId" (selectionChange)="onUserChange($event)">
        <mat-option value="" disabled>Select a user</mat-option>
        <mat-option *ngFor="let user of users" [value]="user.id.toString()">
          <div class="user-option">
            <mat-icon class="user-icon">account_circle</mat-icon>
            <div class="user-info">
              <span class="user-name">{{ user.name }}</span>
              <span class="user-role">{{ user.role }}</span>
            </div>
          </div>
        </mat-option>
      </mat-select>
    </mat-form-field>
  `,
  styles: [`
    :host {
      display: block;
      margin-right: 20px;
    }

    .user-switch-field {
      width: 220px;
    }

    .user-option {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .user-icon {
      color: var(--primary-color);
    }

    .user-info {
      display: flex;
      flex-direction: column;
    }

    .user-name {
      font-weight: 500;
      color: var(--text-primary);
    }

    .user-role {
      font-size: 0.8rem;
      color: var(--text-secondary);
    }

    @media (max-width: 599px) {
      .user-switch-field {
        width: 180px;
      }
    }
  `]
})
export class UserSwitchComponent implements OnInit {
  @Output() userChanged = new EventEmitter<Employee>();
  
  users: Employee[] = [
    { id: 1, name: 'Employee 1', role: 'Manager', leaveBalance: 20 },
    { id: 2, name: 'Employee 2', role: 'Employee', leaveBalance: 15 },
    { id: 3, name: 'Employee 3', role: 'Employee', leaveBalance: 18 }
  ];
  
  selectedUserId: string = '';
  
  ngOnInit() {
    // Load selected user from localStorage
    const savedUserId = localStorage.getItem('selectedUserId');
    const savedUserRole = localStorage.getItem('selectedUserRole');
    
    if (savedUserId && savedUserRole) {
      this.selectedUserId = savedUserId;
      const user = this.users.find(u => u.id === parseInt(savedUserId, 10));
      if (user) {
        this.userChanged.emit(user);
      }
    }
  }
  
  onUserChange(event: any) {
    const userId = parseInt(event.target.value, 10);
    const user = this.users.find(u => u.id === userId);
    
    if (user) {
      localStorage.setItem('selectedUserId', user.id.toString());
      localStorage.setItem('selectedUserRole', user.role);
      this.userChanged.emit(user);
    }
  }
}