import { TruncatePipe } from './truncate';

describe('TruncatePipe', () => {
  let pipe: TruncatePipe;

  beforeEach(() => {
    pipe = new TruncatePipe();
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should truncate text to the specified length and append ellipsis', () => {
    const text = 'Angular Feature Showcase Application';
    const result = pipe.transform(text, 15);
    expect(result).toBe('Angular Feature...');
  });

  it('should not truncate text if it is shorter than the limit', () => {
    const text = 'Short text';
    const result = pipe.transform(text, 20);
    expect(result).toBe('Short text');
  });

  it('should return empty string if input is empty', () => {
    expect(pipe.transform('', 10)).toBe('');
  });

  it('should use default limit of 20 if no limit is provided', () => {
    const text = 'This is a long sentence that should be truncated by default';
    const result = pipe.transform(text);
    expect(result).toBe('This is a long sente...');
  });
});
