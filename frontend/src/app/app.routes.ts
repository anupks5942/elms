import { Routes } from '@angular/router';
import { ApplyLeaveComponent } from './features/employee/apply-leave.component';
import { MyLeavesComponent } from './features/employee/my-leaves.component';
import { PendingLeavesComponent } from './features/manager/pending-leaves.component';

export const routes: Routes = [
  { path: 'apply-leave', component: ApplyLeaveComponent },
  { path: 'my-leaves', component: MyLeavesComponent },
  { path: 'pending-requests', component: PendingLeavesComponent },
  { path: '', redirectTo: '/apply-leave', pathMatch: 'full' },
  { path: '**', redirectTo: '/apply-leave', pathMatch: 'full' }
];