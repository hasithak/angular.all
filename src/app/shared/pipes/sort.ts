import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sort',
  standalone: true,
  pure: true, // Marking pure for caching and performance optimization
})
export class SortPipe implements PipeTransform {
  /**
   * Sorts an array of objects by a specific property and direction
   */
  public transform<T>(
    array: T[] | null | undefined,
    property: keyof T,
    direction: 'asc' | 'desc' = 'asc'
  ): T[] {
    if (!array || !Array.isArray(array)) {
      return [];
    }

    const sorted = [...array].sort((a, b) => {
      const valA = a[property];
      const valB = b[property];

      if (valA === valB) return 0;
      if (valA === null || valA === undefined) return 1;
      if (valB === null || valB === undefined) return -1;

      if (typeof valA === 'string' && typeof valB === 'string') {
        return valA.localeCompare(valB);
      }

      return (valA as any) > (valB as any) ? 1 : -1;
    });

    return direction === 'desc' ? sorted.reverse() : sorted;
  }
}
