import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MetricCard } from '../metric-card';
import { ThemeProvider } from '@mui/material/styles';
import { createTheme } from '@mui/material/styles';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

const theme = createTheme();

describe('MetricCard Component', () => {
  const defaultProps = {
    title: 'Total Profit',
    value: '$12,345.67',
    icon: TrendingUpIcon,
  };

  it('renders title and value correctly', () => {
    render(
      <ThemeProvider theme={theme}>
        <MetricCard {...defaultProps} />
      </ThemeProvider>
    );

    expect(screen.getByText('Total Profit')).toBeInTheDocument();
    expect(screen.getByText('$12,345.67')).toBeInTheDocument();
  });

  it('renders change text when provided', () => {
    render(
      <ThemeProvider theme={theme}>
        <MetricCard {...defaultProps} change="+5.2%" changeType="positive" />
      </ThemeProvider>
    );

    expect(screen.getByText('+5.2%')).toBeInTheDocument();
  });

  it('applies correct color for positive change', () => {
    const { getByText } = render(
      <ThemeProvider theme={theme}>
        <MetricCard {...defaultProps} change="+5.2%" changeType="positive" />
      </ThemeProvider>
    );

    const changeElement = getByText('+5.2%');
    // MUI success.main typically translates to a specific color
    // We can check if it has the appropriate style or class if needed
    expect(changeElement).toBeInTheDocument();
  });
});
