import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'leaveType',
  standalone: true
})
export class LeaveTypePipe implements PipeTransform {

  transform(value: string | null | undefined): string {
    if (!value) return '';

    switch (value) {
      case 'PERSONAL_LEAVE':
        return 'ลากิจ';
      case 'VACATION_LEAVE':
        return 'ลาพักร้อน';
      case 'SICK_LEAVE':
        return 'ลาป่วย';
      default:
        return value;
    }
  }
}
