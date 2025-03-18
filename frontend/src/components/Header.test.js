import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Header from './Header';

describe('Header Component', () => {
  const mockProps = {
    darkMode: false,
    toggleDarkMode: jest.fn(),
    isMobile: false
  };

  it('renders correctly', () => {
    render(<Header {...mockProps} />);
    expect(screen.getByText(/Dashboard de Conversão/i)).toBeInTheDocument();
    expect(screen.getByText(/Modo Escuro/i)).toBeInTheDocument();
  });

  it('calls toggleDarkMode when button is clicked', () => {
    render(<Header {...mockProps} />);
    fireEvent.click(screen.getByText(/Modo Escuro/i));
    expect(mockProps.toggleDarkMode).toHaveBeenCalled();
  });

  it('shows correct button text when in dark mode', () => {
    render(<Header {...mockProps} darkMode={true} />);
    expect(screen.getByText(/Modo Claro/i)).toBeInTheDocument();
  });
});
