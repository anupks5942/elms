import { Routes } from '@angular/router';
import { ApplyLeaveComponent } from './features/employee/apply-leave.component';
import { MyLeavesComponent } from './features/employee/my-leaves.component';
import { PendingLeavesComponent } from './features/manager/pending-leaves.component';

export const routes: Routes = [
  { path: 'employee/apply', component: ApplyLeaveComponent },
  { path: 'employee/leaves', component: MyLeavesComponent },
  { path: 'manager/pending', component: PendingLeavesComponent },
  { path: '', redirectTo: '/employee/apply', pathMatch: 'full' },
  { path: '**', redirectTo: '/employee/apply', pathMatch: 'full' }
];