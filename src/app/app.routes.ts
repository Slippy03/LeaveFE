import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LeaveRequestComponent } from './leave-request/leave-request.component';
import { LeaveHistoryComponent } from './leave-history/leave-history.component';
import { LeaveApproveComponent } from './leave-approve/leave-approve.component';
import { TabsComponent } from './tabs/tabs.component';

export const routes: Routes = [
  { path: '', redirectTo: 'leave/dashboard', pathMatch: 'full' },

  {
    path: 'leave',
    component: TabsComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'request', component: LeaveRequestComponent },
      { path: 'history', component: LeaveHistoryComponent },
      { path: 'approve', component: LeaveApproveComponent },
    ]
  }
];


