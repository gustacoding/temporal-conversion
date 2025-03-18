import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import StatusCharts from './StatusCharts';

// Mock Chart.js
jest.mock('react-chartjs-2', () => ({
  Pie: () => <div data-testid="mock-pie-chart" />
}));

describe('StatusCharts Component', () => {
  const mockProps = {
    statusDataApi: [
      {
        canal: 'email',
        valido: '10',
        invalido: '5',
        incompleto: '3',
        pendente: '2',
        aberto: '8',
        visualizou: '12'
      }
    ],
    isMobile: false,
    darkMode: false,
    statusLabels: {
      1: 'Válido',
      2: 'Inválido',
      3: 'Incompleto',
      4: 'Pendente',
      5: 'Aberto',
      6: 'Visualizou',
    }
  };

  it('renders charts when data is available', () => {
    const { container } = render(<StatusCharts {...mockProps} />);
    expect(container.querySelector('div[data-testid="mock-pie-chart"]')).toBeInTheDocument();
  });

  it('shows message when no data is available', () => {
    render(<StatusCharts {...mockProps} statusDataApi={[]} />);
    expect(screen.getByText(/Nenhum dado de status disponível/i)).toBeInTheDocument();
  });
});
