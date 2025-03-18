import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Dashboard from './Dashboard';
import axios from 'axios';

jest.mock('axios');

describe('Dashboard Component', () => {
  beforeEach(() => {
    axios.get = jest.fn().mockResolvedValue({ data: [] });
  });

  it('renders correctly', () => {
    render(<Dashboard />);
    expect(screen.getByText(/Carregando dados.../i)).toBeInTheDocument();
  });
});
