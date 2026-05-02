import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AccountHeader } from '../account-header';

describe('AccountHeader', () => {
    it('renders correctly', () => {
        render(<AccountHeader onRefresh={vi.fn()} loading={false} />);
        expect(screen.getByText('Account & Profile')).toBeDefined();
        expect(screen.getByText(/Manage your MT5 account settings/i)).toBeDefined();
    });

    it('calls onRefresh when refresh button is clicked', () => {
        const handleRefresh = vi.fn();
        render(<AccountHeader onRefresh={handleRefresh} loading={false} />);
        
        const button = screen.getByRole('button', { name: /refresh/i });
        fireEvent.click(button);
        
        expect(handleRefresh).toHaveBeenCalledTimes(1);
    });

    it('disables refresh button when loading is true', () => {
        render(<AccountHeader onRefresh={vi.fn()} loading={true} />);
        
        const button = screen.getByRole('button', { name: /refresh/i });
        expect(button).toHaveProperty('disabled', true);
    });
});
