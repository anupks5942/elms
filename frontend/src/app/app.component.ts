import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { UserSwitchComponent } from './shared/user-switch.component';
import { Employee } from './core/models/employee.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    UserSwitchComponent
  ],
  template: `
    <mat-toolbar color="primary">
      <span>Employee Leave Management System</span>
      <span class="spacer"></span>
      <app-user-switch (userChanged)="onUserChanged($event)"></app-user-switch>
    </mat-toolbar>

    <div class="container">
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [`
    .container {
      padding: 20px;
    }
    
    .spacer {
      flex: 1 1 auto;
    }
  `]
})
export class AppComponent implements OnInit {
  title = 'elms-frontend';
  currentUser: Employee | null = null;

  ngOnInit() {
    // Load user from localStorage on initialization
    const savedUserId = localStorage.getItem('selectedUserId');
    const savedUserRole = localStorage.getItem('selectedUserRole');
    
    if (savedUserId && savedUserRole) {
      this.currentUser = {
        id: parseInt(savedUserId, 10),
        name: '', // Name is not needed for this component
        role: savedUserRole as 'Manager' | 'Employee',
        leaveBalance: 0 // Balance is not needed for this component
      };
    }
  }

  onUserChanged(user: Employee) {
    this.currentUser = user;
  }
}