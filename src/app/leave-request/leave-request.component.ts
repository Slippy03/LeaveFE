import { Component } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AllService } from '../Service/all.service';
import Swal from 'sweetalert2';

const LEAVE_TYPE_MAP: any = {
  ลาป่วย: {
    id: 1,
    leaveTypeEnum: 'SICK_LEAVE',
    description: 'Sick Leave',
    maxDays: 30,
  },
  ลากิจ: {
    id: 2,
    leaveTypeEnum: 'PERSONAL_LEAVE',
    description: 'Personal Leave',
    maxDays: 2,
  },
  ลาพักร้อน: {
    id: 3,
    leaveTypeEnum: 'VACATION_LEAVE',
    description: 'Vacation Leave',
    maxDays: 10,
  },
};

@Component({
  selector: 'app-leave-request',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatIconModule,
    CommonModule,
  ],
  templateUrl: './leave-request.component.html',
  styleUrl: './leave-request.component.css',
})
export class LeaveRequestComponent {
  private fb = inject(FormBuilder);
  private allService = inject(AllService);

  form = this.fb.group({
    leaveType: ['', Validators.required],
    startDate: ['', Validators.required],
    endDate: ['', Validators.required],
    reason: ['', Validators.required],
  });

  leaveTypes = ['ลาป่วย', 'ลากิจ', 'ลาพักร้อน'];

  minDate: Date = new Date(new Date().setHours(0, 0, 0, 0));

  submit() {
    if (this.form.invalid) return;

    const formValue = this.form.value;

    const start = new Date(formValue.startDate!);
    const end = new Date(formValue.endDate!);

    const diffTime = end.getTime() - start.getTime();
    const days = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;

    const leaveInfo = LEAVE_TYPE_MAP[formValue.leaveType!];

    if (days > leaveInfo.maxDays) {
      Swal.fire({
        icon: 'error',
        title: `จำนวนวันที่เลือกเกินกำหนด`,
        text: `ประเภทการลา "${formValue.leaveType}" สามารถลาได้สูงสุด ${leaveInfo.maxDays} วัน คุณเลือก ${days} วัน`,
      });
      return;
    }

    const payload = {
      id: 0,
      users: {
        id: 1,
        username: 'Tao',
        email: 'phattharaphon.p03@gmail.com',
        role: 'Intern',
        department: 'SWD',
      },
      leaveType: leaveInfo,
      startDate: start.toISOString(),
      endDate: end.toISOString(),
      reason: formValue.reason,
      status: 'PENDING',
    };

    this.allService.createLeaveRequest(payload).subscribe({
      next: (res) => {
        Swal.fire({
          icon: 'success',
          title: 'ส่งคำขอลาสำเร็จ',
        });
        this.resetForm();
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'ส่งคำขอลาไม่สำเร็จ',
        });
        console.error('Request Unsuccessful', err);
      },
    });
  }

  resetForm() {
    this.form.reset();
    Object.keys(this.form.controls).forEach((key) => {
      const control = this.form.get(key);
      control?.markAsPristine();
      control?.markAsUntouched();
      control?.setErrors(null);
    });
  }

  cancel() {
    this.form.reset();
    Object.keys(this.form.controls).forEach((key) => {
      const control = this.form.get(key);
      control?.markAsPristine();
      control?.markAsUntouched();
      control?.setErrors(null);
    });
  }
}
