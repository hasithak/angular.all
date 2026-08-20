import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate',
  standalone: true,
})
export class TruncatePipe implements PipeTransform {
  /**
   * Truncates a string to a specified length and appends a trail (default '...')
   */
  public transform(value: string | null | undefined, limit = 20, trail = '...'): string {
    if (!value) {
      return '';
    }

    if (value.length <= limit) {
      return value;
    }

    return value.substring(0, limit) + trail;
  }
}
