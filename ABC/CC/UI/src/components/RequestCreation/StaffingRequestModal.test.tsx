import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import StaffingRequestModal from './StaffingRequestModal';

jest.mock('react-bootstrap/Button', () => {
  return function DummyButton(props) {
    return (
      <button 
        data-testid={`button-${props.variant}`} 
        onClick={props.onClick}
      >
        {props.children}
      </button>
    );
  };
});

jest.mock('react-bootstrap/Modal', () => {
  return function DummyModal(props) {
    if (!props.show) return null;
    
    return (
      <div data-testid="modal" data-backdrop={props.backdrop} data-keyboard={props.keyboard} data-centered={props.centered}>
        {props.children}
        <button data-testid="modal-close" onClick={props.onHide}>Close</button>
      </div>
    );
  };
});

jest.mock('react-bootstrap/Modal', () => {
  const actual = jest.requireActual('react-bootstrap/Modal');
  
  return {
    ...actual,
    Dialog: function DummyDialog(props) {
      return <div data-testid="modal-dialog">{props.children}</div>;
    },
    Body: function DummyBody(props) {
      return <div data-testid="modal-body">{props.children}</div>;
    },
    Footer: function DummyFooter(props) {
      return <div data-testid="modal-footer">{props.children}</div>;
    }
  };
}, { virtual: true });

describe('StaffingRequestModal Component', () => {
  const mockOnClose = jest.fn();
  const mockOnSelectOption = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  test('renders the modal with correct props', () => {
    render(
      <StaffingRequestModal 
        onClose={mockOnClose} 
        onSelectOption={mockOnSelectOption} 
      />
    );
    
    expect(screen.getByText('Was there a service request received where services already staffed by a servicing provider?')).toBeInTheDocument();
    expect(screen.getByText('Yes')).toBeInTheDocument();
    expect(screen.getByText('No')).toBeInTheDocument();



  });
  
  test('renders the question text correctly', () => {
    render(
      <StaffingRequestModal 
        onClose={mockOnClose} 
        onSelectOption={mockOnSelectOption} 
      />
    );
    
    expect(screen.getByText('Was there a service request received where services already staffed by a servicing provider?')).toBeInTheDocument();
  });
  
  test('renders Yes and No buttons', () => {
    render(
      <StaffingRequestModal 
        onClose={mockOnClose} 
        onSelectOption={mockOnSelectOption} 
      />
    );
    
    expect(screen.getByText('Yes')).toBeInTheDocument();
    expect(screen.getByText('No')).toBeInTheDocument();
  });
  
  
  test('calls onSelectOption with true when Yes button is clicked', () => {
    render(
      <StaffingRequestModal 
        onClose={mockOnClose} 
        onSelectOption={mockOnSelectOption} 
      />
    );
    
    fireEvent.click(screen.getByText('Yes'));
    expect(mockOnSelectOption).toHaveBeenCalledTimes(1);
    expect(mockOnSelectOption).toHaveBeenCalledWith(true);
  });
  
  test('calls onSelectOption with false when No button is clicked', () => {
    render(
      <StaffingRequestModal 
        onClose={mockOnClose} 
        onSelectOption={mockOnSelectOption} 
      />
    );
    
    fireEvent.click(screen.getByText('No'));
    expect(mockOnSelectOption).toHaveBeenCalledTimes(1);
    expect(mockOnSelectOption).toHaveBeenCalledWith(false);
  });
  
  test('renders paragraph with correct styling', () => {
    render(
      <StaffingRequestModal 
        onClose={mockOnClose} 
        onSelectOption={mockOnSelectOption} 
      />
    );
    
    const paragraph = screen.getByText('Was there a service request received where services already staffed by a servicing provider?');
    expect(paragraph.tagName).toBe('P');
    
  });
  
  test('renders buttons with dark variant', () => {
    render(
      <StaffingRequestModal 
        onClose={mockOnClose} 
        onSelectOption={mockOnSelectOption} 
      />
    );
    
    const yesButton = screen.getByText('Yes');
    const noButton = screen.getByText('No');
    
    expect(yesButton).toBeInTheDocument();
    expect(noButton).toBeInTheDocument();
  });
});
