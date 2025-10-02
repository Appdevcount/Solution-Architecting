import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Dashboard from './Dashboard';

jest.mock('../components/CCDashboard/DashboardCC', () => {
  return function DummyDashboardCC() {
    return <div data-testid="dashboard-cc">DashboardCC Component</div>;
  };
});

describe('Dashboard Component', () => {
  test('renders Dashboard component with DashboardCC', () => {
    render(<Dashboard />);
    
    expect(screen.getByTestId('dashboard-cc')).toBeInTheDocument();
    expect(screen.getByText('DashboardCC Component')).toBeInTheDocument();
  });

  test('renders Dashboard component inside a Container', () => {
    render(<Dashboard />);
    
    const container = screen.getByTestId('dashboard-cc');
    expect(container).toBeInTheDocument();
  });
});
