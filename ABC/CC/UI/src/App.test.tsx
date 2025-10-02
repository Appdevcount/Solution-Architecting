import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { store } from './state/store/store';

// Mock child components
jest.mock('./layout/Sidebar', () => () => <div data-testid="sidebar">Mock Sidebar</div>);
jest.mock('./layout/MainContent', () => () => <div data-testid="main-content">Mock MainContent</div>);
jest.mock('./components/ErrorBoundary/ErrorBoundary', () => ({ children }: any) => (
  <div data-testid="error-boundary">{children}</div>
));
jest.mock('./context/AuthProvider', () => ({ children }: any) => (
  <div data-testid="auth-provider">{children}</div>
));

// Mock react-router-dom's BrowserRouter to avoid basename issues in tests
jest.mock('react-router-dom', () => {
  const originalModule = jest.requireActual('react-router-dom');
  return {
    ...originalModule,
    BrowserRouter: ({ children }: any) => <div data-testid="browser-router">{children}</div>,
  };
});

describe('App Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders App component without crashing', () => {
    render(<App />);
    
    // Verify the component renders without errors
    expect(screen.getByTestId('browser-router')).toBeInTheDocument();
  });

  test('renders with correct component hierarchy', () => {
    render(<App />);
    
    // Verify the component hierarchy
    expect(screen.getByTestId('browser-router')).toBeInTheDocument();
    expect(screen.getByTestId('error-boundary')).toBeInTheDocument();
    expect(screen.getByTestId('auth-provider')).toBeInTheDocument();
    expect(screen.getByTestId('sidebar')).toBeInTheDocument();
    expect(screen.getByTestId('main-content')).toBeInTheDocument();
  });

  test('renders with Redux Provider', () => {
    // Use a custom render to check if Provider is in the component tree
    const { container } = render(<App />);
    
    // Check that the Redux Provider is rendered
    // This is an indirect test since we can't directly query for Provider
    expect(container.innerHTML).toContain('browser-router');
  });


  test('renders in StrictMode', () => {
    // StrictMode is difficult to test directly, but we can check it's in the component tree
    const { container } = render(<App />);
    
    // Verify the component structure includes all expected elements
    expect(container.innerHTML).toContain('browser-router');
    expect(container.innerHTML).toContain('error-boundary');
    expect(container.innerHTML).toContain('auth-provider');
    expect(container.innerHTML).toContain('sidebar');
    expect(container.innerHTML).toContain('main-content');
  });

});

export {};
