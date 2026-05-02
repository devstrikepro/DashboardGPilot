import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ProductDetailTabs } from '../product-detail-tabs';

describe('ProductDetailTabs', () => {
    it('renders both tabs correctly', () => {
        render(<ProductDetailTabs activeTab={0} onChange={vi.fn()} />);
        expect(screen.getByText('Overview')).toBeDefined();
        expect(screen.getByText('Trade History')).toBeDefined();
    });

    it('calls onChange when a tab is clicked', () => {
        const mockOnChange = vi.fn();
        render(<ProductDetailTabs activeTab={0} onChange={mockOnChange} />);
        
        const historyTab = screen.getByText('Trade History');
        fireEvent.click(historyTab);
        
        expect(mockOnChange).toHaveBeenCalledTimes(1);
    });
});
