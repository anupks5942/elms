import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
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
    FormsModule,
    ReactiveFormsModule
  ],
  template: `
    <mat-form-field appearance="fill">
      <mat-label>Act As User</mat-label>
      <select matNativeControl (change)="onUserChange($event)" [(ngModel)]="selectedUserId">
        <option value="" disabled>Select a user</option>
        <option *ngFor="let user of users" [value]="user.id">
          {{ user.name }} ({{ user.role }})
        </option>
      </select>
    </mat-form-field>
  `,
  styles: [`
    :host {
      display: block;
      margin-right: 20px;
    }
    
    mat-form-field {
      width: 200px;
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