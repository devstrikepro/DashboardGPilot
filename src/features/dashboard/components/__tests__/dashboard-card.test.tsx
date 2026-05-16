import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DashboardCard } from '../dashboard-card';
import { useDashboardData } from '../../hooks/use-dashboard-data';
import { PRODUCTS } from '../../constants/products';

vi.mock('../../hooks/use-dashboard-data');

describe('DashboardCard', () => {
    const mockOnCardClick = vi.fn();
    const mockProduct = PRODUCTS.gpilot;

    beforeEach(() => {
        vi.clearAllMocks();
        (useDashboardData as any).mockReturnValue({
            loading: false,
            error: null,
            summary: { avg_profit_month: 10, drawdown: 5 },
            formatCurrency: (val: number) => `$${val}`,
        });
    });

    it('renders correctly with data', () => {
        render(<DashboardCard product={mockProduct} onCardClick={mockOnCardClick} />);
        expect(screen.getByText('Gpilot')).toBeDefined();
        expect(screen.getByText('10%')).toBeDefined();
        expect(screen.getByText('5.00%')).toBeDefined();
    });

    it('displays warning alert when there is an error', () => {
        (useDashboardData as any).mockReturnValue({
            loading: false,
            error: 'API Error',
            summary: null,
            formatCurrency: (val: number) => `$${val}`,
        });
        
        render(<DashboardCard product={mockProduct} onCardClick={mockOnCardClick} />);
        expect(screen.getByText(/API Offline/)).toBeDefined();
    });

    it('calls onCardClick when clicked', () => {
        render(<DashboardCard product={mockProduct} onCardClick={mockOnCardClick} />);
        const cardAction = screen.getByRole('button');
        fireEvent.click(cardAction);
        expect(mockOnCardClick).toHaveBeenCalledWith('Gpilot', mockProduct.serviceBase);
    });
});
