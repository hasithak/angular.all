import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'appPureCompute',
  standalone: true,
  pure: true, // Marking it as pure means Angular caches the result for the same input
})
export class PureComputePipe implements PipeTransform {
  private executionCount = 0;

  public transform(value: number): string {
    this.executionCount++;
    console.log(`[Pure Pipe] Execution #${this.executionCount} for input value: ${value}`);
    
    // Simulate a slow CPU operation (e.g. finding if number is prime)
    const isPrimeResult = this.isPrime(value);
    return `Prime: ${isPrimeResult ? 'YES' : 'NO'} (Evaluations: ${this.executionCount})`;
  }

  private isPrime(num: number): boolean {
    if (num <= 1) return false;
    for (let i = 2; i <= Math.sqrt(num); i++) {
      if (num % i === 0) return false;
    }
    return true;
  }
}
