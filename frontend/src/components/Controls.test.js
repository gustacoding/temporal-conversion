import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Controls from './Controls';

describe('Controls Component', () => {
  const mockProps = {
    canal: '',
    setCanal: jest.fn(),
    startDate: '2023-01-01',
    setStartDate: jest.fn(),
    endDate: '2023-01-15',
    setEndDate: jest.fn(),
    defaultStartDate: new Date('2023-01-01'),
    currentDate: new Date('2023-01-15'),
    isMobile: false,
    darkMode: false,
    canaisDisponiveis: ['email', 'MOBILE', 'wpp']
  };

  it('renders correctly', () => {
    render(<Controls {...mockProps} />);
    expect(screen.getByLabelText(/Canal/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Data Inicial/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Data Final/i)).toBeInTheDocument();
  });

  it('calls setCanal when canal is changed', () => {
    render(<Controls {...mockProps} />);
    fireEvent.change(screen.getByLabelText(/Canal/i), { target: { value: 'email' } });
    expect(mockProps.setCanal).toHaveBeenCalledWith('email');
  });
});
