import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import ConversionChart from './ConversionChart';

// Mock Chart.js
jest.mock('react-chartjs-2', () => ({
  Line: () => <div data-testid="mock-line-chart" />
}));

describe('ConversionChart Component', () => {
  const mockData = [
    { periodo: '2023-01-01', canal: 'email', taxa_conversao: '10' },
    { periodo: '2023-01-02', canal: 'email', taxa_conversao: '20' }
  ];

  it('renders correctly', () => {
    const { container } = render(<ConversionChart data={mockData} isMobile={false} darkMode={false} />);
    expect(container.querySelector('div[data-testid="mock-line-chart"]')).toBeInTheDocument();
  });
});
