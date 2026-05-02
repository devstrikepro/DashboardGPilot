import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ProductDetailHeader } from '../product-detail-header';

describe('ProductDetailHeader', () => {
    it('renders the product name correctly', () => {
        render(<ProductDetailHeader productName="Gpilot" onBack={vi.fn()} />);
        expect(screen.getByText('Gpilot')).toBeDefined();
        expect(screen.getByText('Product Detail')).toBeDefined();
    });

    it('calls onBack when back chip is clicked', () => {
        const mockOnBack = vi.fn();
        render(<ProductDetailHeader productName="Gpilot" onBack={mockOnBack} />);
        
        const backButton = screen.getByText('Dashboard');
        fireEvent.click(backButton);
        
        expect(mockOnBack).toHaveBeenCalledTimes(1);
    });
});
