import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'thDate',
  standalone: true,
})
export class ThDate implements PipeTransform {
  private thaiMonths = [
    'ม.ค.',
    'ก.พ.',
    'มี.ค.',
    'เม.ย.',
    'พ.ค.',
    'มิ.ย.',
    'ก.ค.',
    'ส.ค.',
    'ก.ย.',
    'ต.ค.',
    'พ.ย.',
    'ธ.ค.',
  ];

  transform(startDate: string | Date, endDate: string | Date): string {
    if (!startDate || !endDate) return '';

    const start = new Date(startDate);
    const end = new Date(endDate);

    const startDay = start.getDate();
    const endDay = end.getDate();
    const month = this.thaiMonths[start.getMonth()];
    const year = start.getFullYear() + 543;

    if (
      start.getDate() === end.getDate() &&
      start.getFullYear() === end.getFullYear() &&
      start.getMonth() === end.getMonth()
    ) {
      return `${startDay} ${month} ${year}`;
    } else if (
      start.getMonth() === end.getMonth() &&
      start.getFullYear() === end.getFullYear()
    ) {
      return `${startDay}-${endDay} ${month} ${year}`;
    }

    const endMonth = this.thaiMonths[end.getMonth()];
    const endYear = end.getFullYear() + 543;

    return `${startDay} ${month} ${year} - ${endDay} ${endMonth} ${endYear}`;
  }
}
