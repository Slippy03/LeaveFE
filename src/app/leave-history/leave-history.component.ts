import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { BaseChartDirective } from 'ng2-charts';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { AllService } from '../Service/all.service';

import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

Chart.register(...registerables);

type LeaveKey = 'SICK_LEAVE' | 'PERSONAL_LEAVE' | 'VACATION_LEAVE';

interface LeaveSummary {
  name: string;
  department: string;
  sick: number;
  personal: number;
  vacation: number;
  total: number;
}

@Component({
  selector: 'app-leave-history',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatTableModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    BaseChartDirective,
  ],
  templateUrl: './leave-history.component.html',
  styleUrl: './leave-history.component.css',
})
export class LeaveHistoryComponent implements OnInit {
  private fb = inject(FormBuilder);
  private allService = inject(AllService);

  form = this.fb.group({
    startDate: this.fb.control<Date | null>(null),
    department: ['ALL'],
  });

  private rawLeaveData: any[] = [];

  departments: string[] = [];

  barChartType: 'bar' = 'bar';

  barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: ['ลาป่วย', 'ลากิจ', 'ลาพักร้อน'],
    datasets: [
      {
        label: 'จำนวนวันลา',
        data: [0, 0, 0],
        barThickness: 80,
      },
    ],
  };

  barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'จำนวนวัน',
        },
      },
    },
  };

  displayedColumns: string[] = [
    'name',
    'department',
    'sick',
    'vacation',
    'personal',
    'total',
  ];

  tableData: LeaveSummary[] = [];

  ngOnInit(): void {
    this.loadData();

    this.form.valueChanges.subscribe(() => {
      this.applyFilter();
    });
  }

  loadData(): void {
    this.allService.getLeaveRequest().subscribe((res: any[]) => {
      this.rawLeaveData = res;

      this.departments = [...new Set(res.map((r) => r.users.department))];

      this.applyFilter();
    });
  }

  applyFilter(): void {
    const { startDate, department } = this.form.value;

    const chartSummary: Record<LeaveKey, number> = {
      SICK_LEAVE: 0,
      PERSONAL_LEAVE: 0,
      VACATION_LEAVE: 0,
    };

    const tableMap: Record<string, LeaveSummary> = {};

    // กรองเฉพาะ APPROVED + เงื่อนไขอื่น
    this.rawLeaveData
      .filter((item) => {
        if (item.status !== 'APPROVED') return false; // <-- เพิ่มตรงนี้
        if (department !== 'ALL' && item.users.department !== department) {
          return false;
        }

        if (startDate) {
          const d = new Date(item.startDate);
          if (
            d.getFullYear() !== startDate.getFullYear() ||
            d.getMonth() !== startDate.getMonth()
          ) {
            return false;
          }
        }

        return true;
      })
      .forEach((item) => {
        const start = new Date(item.startDate);
        const end = new Date(item.endDate);
        const days =
          (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24) + 1;

        const type = item.leaveType.leaveTypeEnum as LeaveKey;
        const key = item.users.username;

        if (!tableMap[key]) {
          tableMap[key] = {
            name: item.users.username,
            department: item.users.department,
            sick: 0,
            personal: 0,
            vacation: 0,
            total: 0,
          };
        }

        if (type === 'SICK_LEAVE') tableMap[key].sick += days;
        if (type === 'PERSONAL_LEAVE') tableMap[key].personal += days;
        if (type === 'VACATION_LEAVE') tableMap[key].vacation += days;
        tableMap[key].total += days;

        chartSummary[type] += days; // chart ก็ยังรวมเฉพาะ APPROVED
      });

    this.barChartData = {
      labels: ['ลาป่วย', 'ลากิจ', 'ลาพักร้อน'],
      datasets: [
        {
          label: 'จำนวนวันลา',
          data: [
            chartSummary.SICK_LEAVE,
            chartSummary.PERSONAL_LEAVE,
            chartSummary.VACATION_LEAVE,
          ],
          barThickness: 80,
        },
      ],
    };

    this.tableData = Object.values(tableMap); // table ก็จะเป็นเฉพาะ APPROVED
  }

  exportExcel(): void {
    if (!this.tableData.length) return;

    const exportData = this.tableData.map((row) => ({
      ชื่อ: row.name,
      แผนก: row.department,
      ลาป่วย: row.sick,
      ลากิจ: row.personal,
      ลาพักร้อน: row.vacation,
      รวมทั้งหมด: row.total,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = {
      Sheets: { 'Leave Summary': worksheet },
      SheetNames: ['Leave Summary'],
    };

    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });

    const blob = new Blob([excelBuffer], {
      type: 'application/octet-stream',
    });

    const month = this.form.value.startDate
      ? `${this.form.value.startDate.getFullYear()}-${
          this.form.value.startDate.getMonth() + 1
        }`
      : 'ALL';

    saveAs(blob, `leave-summary-${month}.xlsx`);
  }
  chosenMonthHandler(date: Date, picker: any): void {
    this.form
      .get('startDate')
      ?.setValue(new Date(date.getFullYear(), date.getMonth(), 1));
    picker.close();
  }
}
