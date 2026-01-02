import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MediaMatcher } from '@angular/cdk/layout';
import { MatSidenav } from '@angular/material/sidenav';
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
    MatIconModule,
    UserSwitchComponent
  ],
  providers: [
    MediaMatcher
  ],
  template: `
    <mat-sidenav-container class="sidenav-container">
      <mat-sidenav
        #sidenav
        class="sidenav"
        [mode]="isScreenSmall() ? 'over' : 'side'"
        [opened]="!isScreenSmall()"
        [disableClose]="!isScreenSmall()">
        <div class="sidenav-header">
          <h2>ELMS</h2>
        </div>
        <mat-nav-list>
          <a mat-list-item routerLink="/my-leaves" (click)="sidenav.close()" class="nav-item">
            <mat-icon matListItemIcon>calendar_month</mat-icon>
            <span matListItemTitle>My Leaves</span>
          </a>
          <a mat-list-item routerLink="/apply-leave" (click)="sidenav.close()" class="nav-item">
            <mat-icon matListItemIcon>edit_note</mat-icon>
            <span matListItemTitle>Apply Leave</span>
          </a>
          <a mat-list-item
             routerLink="/pending-requests"
             (click)="sidenav.close()"
             *ngIf="currentUser?.role === 'Manager'"
             class="nav-item">
             <mat-icon matListItemIcon>pending_actions</mat-icon>
             <span matListItemTitle>Pending Requests</span>
          </a>
        </mat-nav-list>
      </mat-sidenav>

      <mat-sidenav-content>
        <mat-toolbar color="primary" class="app-toolbar">
          <button
            type="button"
            aria-label="Toggle sidenav"
            mat-icon-button
            (click)="sidenav.toggle()"
            *ngIf="isScreenSmall()"
            class="sidenav-toggle">
            <mat-icon>menu</mat-icon>
          </button>
          <span class="toolbar-title">Employee Leave Management System</span>
          <span class="spacer"></span>
          <app-user-switch (userChanged)="onUserChanged($event)"></app-user-switch>
        </mat-toolbar>

        <div class="container">
          <router-outlet></router-outlet>
        </div>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [`
    .sidenav-container {
      height: 100%;
    }

    .sidenav {
      width: 280px;
      box-shadow: 3px 0 10px rgba(0,0,0,0.1);
    }

    .sidenav-header {
      padding: 24px 16px 20px 16px;
      border-bottom: 1px solid var(--border-color);
      text-align: center;
    }

    .sidenav-header h2 {
      margin: 0;
      color: var(--primary-color);
      font-weight: 600;
      font-size: 1.5rem;
    }

    .nav-item {
      border-radius: 0 24px 24px 0;
      margin: 4px 8px;
    }

    .nav-item:hover {
      background-color: rgba(25, 118, 210, 0.08);
    }

    .nav-item.active {
      background-color: rgba(25, 118, 210, 0.15);
    }

    .app-toolbar {
      padding: 0 16px;
      box-shadow: 0 2px 4px -1px rgba(0,0,0,0.1);
    }

    .toolbar-title {
      font-size: 1.25rem;
      font-weight: 500;
    }

    .sidenav-toggle {
      margin-right: 16px;
    }

    .container {
      padding: 24px;
    }

    .spacer {
      flex: 1 1 auto;
    }
  `]
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'elms-frontend';
  currentUser: Employee | null = null;
  mobileQuery: MediaQueryList;

  private _mobileQueryListener: () => void;

  @ViewChild('sidenav') sidenav!: MatSidenav;

  constructor(private media: MediaMatcher) {
    this.mobileQuery = this.media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => {};
    this.mobileQuery.addEventListener('change', this._mobileQueryListener);
  }

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

  ngOnDestroy(): void {
    this.mobileQuery.removeEventListener('change', this._mobileQueryListener);
  }

  onUserChanged(user: Employee) {
    this.currentUser = user;
  }

  isScreenSmall(): boolean {
    return this.mobileQuery.matches;
  }
}