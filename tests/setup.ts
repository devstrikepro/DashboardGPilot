import '@testing-library/jest-dom';
import { afterEach, vi } from 'vitest';

// Mock fetch globally
globalThis.fetch = vi.fn();

// Clean up after each test
afterEach(() => {
  vi.clearAllMocks();
});

// Polyfill for Request/Response if needed (already handled by happy-dom usually)
