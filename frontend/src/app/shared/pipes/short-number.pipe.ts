import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'shortNumber',
  standalone: true
})
export class ShortNumberPipe implements PipeTransform {
  transform(value: number | string | null | undefined): string {
    if (value === null || value === undefined) return '';
    
    const num = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(num)) return '';

    const formatter = new Intl.NumberFormat('pt-BR', {
      notation: 'compact',
      compactDisplay: 'short'
    });

    return formatter.format(num);
  }
}
