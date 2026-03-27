import { describe, it, expect } from 'vitest';
import { cn } from '../index';

describe('cn utility', () => {
  it('should merge classes correctly', () => {
    const result = cn('bg-red-500', 'text-white');
    expect(result).toBe('bg-red-500 text-white');
  });

  it('should handle conditional classes', () => {
    const isTrue = true;
    const isFalse = false;
    const result = cn('base', isTrue && 'is-true', isFalse && 'is-false');
    expect(result).toContain('base');
    expect(result).toContain('is-true');
    expect(result).not.toContain('is-false');
  });

  it('should resolve tailwind conflicts', () => {
    // p-4 and p-8 should resolve to p-8
    const result = cn('p-4', 'p-8');
    expect(result).toBe('p-8');
  });

  it('should handle undefined or null inputs', () => {
    const result = cn('base', undefined, null, '');
    expect(result).toBe('base');
  });
});
