import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { AllService } from '../Service/all.service';
import { HttpClient } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LeaveTypePipe } from '../pipes/th-type.pipe';
import { MatChip } from '@angular/material/chips';
import { ThStatusPipe } from '../pipes/th-status.pipe';
import { MatButton } from '@angular/material/button';

export interface LeaveBalance {
  id: number;
  year: number;
  remainingDays: number;
}

export interface LeaveRequest {
  id: number;
  username: string;
  department: string;
  role: string;
  startDate: string;
  endDate: string;
  status: string;
  reason: string;
  leaveTypeEnum: string;
  days?: number;
}

export interface userData {
  id: number;
  username: string;
  email: string;
  role: string;
  department: string;
}

@Component({
  selector: 'app-leave-approve',
  standalone: true,
  imports: [
    MatCardModule,
    MatTabsModule,
    MatIconModule,
    MatTableModule,
    MatButtonModule,
    MatChipsModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    CommonModule,
    LeaveTypePipe,
    MatChip,
    ThStatusPipe,
    MatButton,
  ],
  templateUrl: './leave-approve.component.html',
  styleUrl: './leave-approve.component.css',
})
export class LeaveApproveComponent {
  leaveBalance: LeaveBalance[] = [];
  leaveRequest: LeaveRequest[] = [];
  userData: userData[] = [];
  
  pendingCount = 0;

  constructor(private AllService: AllService, private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchData();
    this.fetchDataLeaveRequest();
  }
  fetchData() {
    this.AllService.getLeaveBalance().subscribe({
      next: (data: any[]) => {
        this.leaveBalance = data.map((item) => ({
          id: item.id,
          year: item.year,
          remainingDays: item.remainingDays,
        }));
      },
      error: (error) => console.error('Error fetching data:', error),
    });
  }

  fetchDataLeaveRequest() {
    this.AllService.getLeaveRequest().subscribe({
      next: (data: any[]) => {
        this.leaveRequest = data  
        .filter(item => item.status === 'PENDING')
        .map((item) => ({
          id: item.id,
          startDate: item.startDate,
          endDate: item.endDate,
          username: item.users.username,
          department: item.users.department,
          role: item.users.role,
          reason: item.reason,
          status: item.status,
          leaveTypeEnum: item.leaveType?.leaveTypeEnum,
          days: this.calculateDays(item.startDate, item.endDate),
        }));

        this.pendingCount = this.leaveRequest.filter(
          (item) => item.status === 'PENDING'
        ).length;
      },
      error: (error) => console.error('Error fetching data:', error),
    });
  }

  calculateDays(start: string, end: string): number {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = endDate.getTime() - startDate.getTime();
    return diffTime / (1000 * 60 * 60 * 24) + 1;
  }
  
  approve(item: LeaveRequest) {
    const leaveBalance = this.leaveBalance[0]; 
    const days = item.days ?? 0;

    this.AllService.updateLeaveRequest(item.id, {
      status: 'APPROVED',
    }).subscribe(() => {

      this.AllService.updateLeaveBalance(leaveBalance.id, {
        remainingDays: leaveBalance.remainingDays - days,
        year: leaveBalance.year + days,
      }).subscribe(() => {
        this.fetchData();
        this.fetchDataLeaveRequest();
      });
    });
  }
  reject(item: LeaveRequest) {
    this.AllService.updateLeaveRequest(item.id, {
      status: 'REJECTED',
    }).subscribe(() => {
      this.fetchDataLeaveRequest();
    });
  }
}
