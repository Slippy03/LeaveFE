import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { AllService } from '../Service/all.service';
import { HttpClient } from '@angular/common/http';
import { ThDate } from '../pipes/th-date.pipe';
import { LeaveTypePipe } from '../pipes/th-type.pipe';
import { ThStatusPipe } from '../pipes/th-status.pipe';
import { CommonModule } from '@angular/common';


export interface LeaveBalance {
  id: number;
  year: number;
  remainingDays: number;
}

export interface LeaveRequest {
  startDate: string;
  endDate: string;
  status: string;
  leaveTypeEnum: string;
  days?: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MatCardModule, MatTabsModule, MatIconModule, MatTableModule, ThDate, LeaveTypePipe, ThStatusPipe,CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {

  leaveBalance: LeaveBalance[] = []; 
  leaveRequest: LeaveRequest[] = [];

  displayedColumns: string[] = ['Date', 'LeaveType', 'Days', 'Status'];
  dataSource: LeaveRequest[] = [];
  pendingCount = 0;

  constructor(
    private AllService: AllService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.fetchData();
    this.fetchDataLeaveRequest();
  }

  fetchData() {
    this.AllService.getLeaveBalance().subscribe({
      next: (data: any[]) => {
        this.leaveBalance = data.map(item => ({
          id: item.id,
          year: item.year,
          remainingDays: item.remainingDays
        }));
      },
      error: (error) => console.error('Error fetching data:', error)
    });
  }

  fetchDataLeaveRequest() {
  this.AllService.getLeaveRequest().subscribe({
    next: (data: any[]) => {
      this.leaveRequest = data.map(item => ({
        startDate: item.startDate,
        endDate: item.endDate,
        status: item.status,
        leaveTypeEnum: item.leaveType?.leaveTypeEnum,
        days: this.calculateDays(item.startDate, item.endDate)
      }));

      this.dataSource = this.leaveRequest;

      this.pendingCount = this.leaveRequest.filter(
        item => item.status === 'PENDING'
      ).length;
    },
    error: (error) => console.error('Error fetching data:', error)
  });
}


  calculateDays(start: string, end: string): number {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = endDate.getTime() - startDate.getTime();
    return diffTime / (1000 * 60 * 60 * 24) + 1;
  }
}
