import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'thStatus',
  standalone: true
})
export class ThStatusPipe implements PipeTransform {

   transform(value: string | null | undefined): string {
    if (!value) return '';

    switch (value) {
      case 'PENDING':
        return 'รออนุมัติ';
      case 'APPROVED':
        return 'อนุมัติแล้ว';
      case 'REJECTED':
        return 'ไม่อนุมัติ';
      default:
        return value; 
    }
  }
}
