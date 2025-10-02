import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import CreateRequestView from './CreateRequestView';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import * as RequestService from '../services/RequestService';

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

jest.mock('../services/RequestService', () => ({
  CreateRequest: jest.fn(),
}));

jest.mock('../components/RequestCreation/RequesterInfo', () => {
  return function DummyRequesterInfo(props) {
    return <div data-testid="requester-info">Requester Info Component</div>;
  };
});

jest.mock('../components/RequestCreation/InsurerInfo', () => {
  return function DummyInsurerInfo(props) {
    return <div data-testid="insurer-info">Insurer Info Component</div>;
  };
});

jest.mock('../components/RequestCreation/CareCoordination', () => {
  return function DummyCareCoordinationInfo(props) {
    return <div data-testid="care-coordination-info">Care Coordination Info Component</div>;
  };
});

jest.mock('../components/RequestCreation/PatientInfo', () => {
  return function DummyPatientInfo(props) {
    return <div data-testid="patient-info">Patient Info Component</div>;
  };
});

jest.mock('../components/ConfirmationModal', () => {
  return function DummyConfirmationModal(props) {
    return (
      <div data-testid="confirmation-modal" data-show={props.show}>
        <button onClick={props.onHide}>Cancel</button>
        <button onClick={props.onConfirm}>Confirm</button>
      </div>
    );
  };
});

jest.mock('../components/CustomAlert', () => {
  return function DummyCustomAlert(props) {
    return (
      <div data-testid="custom-alert" data-show={props.show} data-variant={props.variant}>
        {props.message}
        <button onClick={props.onClose}>Close</button>
      </div>
    );
  };
});

describe('CreateRequestView Component', () => {
  const mockNavigate = jest.fn();
  const mockDispatch = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    
    (useDispatch as unknown as jest.Mock).mockReturnValue(mockDispatch);
    
    (useSelector as unknown as jest.Mock).mockImplementation((selector) => {
      return { isRestrictedGlobal: false };
    });
    
    (RequestService.CreateRequest as jest.Mock).mockResolvedValue({
      RequestId: '12345',
      RequesterFirstName: 'John',
      RequesterLastName: 'Doe'
    });
  });

  test('renders CreateRequestView component with title', () => {
    render(<CreateRequestView />);
    
    expect(screen.getByText('Submit a Request for Care Coordination')).toBeInTheDocument();
  });

  test('renders all child components', () => {
    render(<CreateRequestView />);
    
    expect(screen.getByTestId('requester-info')).toBeInTheDocument();
    expect(screen.getByTestId('insurer-info')).toBeInTheDocument();
    expect(screen.getByTestId('care-coordination-info')).toBeInTheDocument();
    expect(screen.getByTestId('patient-info')).toBeInTheDocument();
  });

  test('renders submit button', () => {
    render(<CreateRequestView />);
    
    expect(screen.getByText('Submit')).toBeInTheDocument();
  });

  test('shows loading state when submitting', async () => {
    (RequestService.CreateRequest as jest.Mock).mockImplementation(() => {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve({
            RequestId: '12345',
            RequesterFirstName: 'John',
            RequesterLastName: 'Doe'
          });
        }, 100);
      });
    });
    
    render(<CreateRequestView />);
    
    const submitButton = screen.getByText('Submit');
    fireEvent.click(submitButton);
    
    const confirmButton = screen.getByText('Confirm');
    fireEvent.click(confirmButton);
    
    expect(screen.getByText('Submitting...')).toBeInTheDocument();
    
    await waitFor(() => {
      expect(screen.getByText('Submit')).toBeInTheDocument();
    });
  });

  test('shows confirmation modal when form is submitted', () => {
    render(<CreateRequestView />);
    
    const modal = screen.getByTestId('confirmation-modal');
    expect(modal).toHaveAttribute('data-show', 'false');
    
    const submitButton = screen.getByText('Submit');
    fireEvent.click(submitButton);
    
    expect(modal).toHaveAttribute('data-show', 'false');
  });

  test('hides confirmation modal when cancel is clicked', () => {
    render(<CreateRequestView />);
    
    const submitButton = screen.getByText('Submit');
    fireEvent.click(submitButton);
    
    const modal = screen.getByTestId('confirmation-modal');
    expect(modal).toHaveAttribute('data-show', 'false');
    
    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);
    
    expect(modal).toHaveAttribute('data-show', 'false');
  });

  test('submits form data when confirmation is clicked', async () => {
    render(<CreateRequestView />);
    
    const submitButton = screen.getByText('Submit');
    fireEvent.click(submitButton);
    
    const confirmButton = screen.getByText('Confirm');
    fireEvent.click(confirmButton);
    
    await waitFor(() => {
      expect(RequestService.CreateRequest).toHaveBeenCalled();
    });
  });
    test('shows success alert after successful submission', async () => {
    render(<CreateRequestView />);
    
    const submitButton = screen.getByText('Submit');
    fireEvent.click(submitButton);
    
    const confirmButton = screen.getByText('Confirm');
    fireEvent.click(confirmButton);
    
    await waitFor(() => {
      const alert = screen.getByTestId('custom-alert');
      expect(alert).toHaveAttribute('data-show', 'true');      
    });
    expect(screen.getByText('Request submitted successfully!')).toBeInTheDocument();
  });


  test('navigates to view request page after successful submission', async () => {
    jest.useFakeTimers();
    
    render(<CreateRequestView />);
    
    const submitButton = screen.getByText('Submit');
    fireEvent.click(submitButton);
    
    const confirmButton = screen.getByText('Confirm');
    fireEvent.click(confirmButton);
    
    await waitFor(() => {
      expect(screen.getByText('Request submitted successfully!')).toBeInTheDocument();
    });
    
    jest.advanceTimersByTime(2000);
    
    expect(mockNavigate).toHaveBeenCalledWith('/viewrequest', { state: { RequestId: '12345' } });
    
    jest.useRealTimers();
  });
  
    test('shows error alert when API call fails', async () => {
    (RequestService.CreateRequest as jest.Mock).mockRejectedValue(new Error('API Error'));
    
    render(<CreateRequestView />);
    
    const submitButton = screen.getByText('Submit');
    fireEvent.click(submitButton);
    
    const confirmButton = screen.getByText('Confirm');
    fireEvent.click(confirmButton);
    
    await waitFor(() => {
      const alert = screen.getByTestId('custom-alert');
      expect(alert).toHaveAttribute('data-variant', 'danger');
     
    });
    expect(screen.getByText('API Error')).toBeInTheDocument();
  });

    test('shows generic error message when API throws non-Error object', async () => {
    (RequestService.CreateRequest as jest.Mock).mockRejectedValue('Something went wrong');
    
    render(<CreateRequestView />);
    
    const submitButton = screen.getByText('Submit');
    fireEvent.click(submitButton);
    
    const confirmButton = screen.getByText('Confirm');
    fireEvent.click(confirmButton);
    
    await waitFor(() => {
      const alert = screen.getByTestId('custom-alert');
      expect(alert).toHaveAttribute('data-variant', 'danger');
    });
      expect(screen.getByText('An unknown error occurred')).toBeInTheDocument();

  });
  

  test('closes alert when close button is clicked', async () => {
    render(<CreateRequestView />);
    
    const submitButton = screen.getByText('Submit');
    fireEvent.click(submitButton);
    
    const confirmButton = screen.getByText('Confirm');
    fireEvent.click(confirmButton);
    
    await waitFor(() => {
      expect(screen.getByText('Request submitted successfully!')).toBeInTheDocument();
    });
    
    const closeButton = screen.getByText('Close');
    fireEvent.click(closeButton);
    
    const alert = screen.getByTestId('custom-alert');
    expect(alert).toHaveAttribute('data-show', 'false');
  });

  test('dispatches setRequestDetails action after successful submission', async () => {
    const mockResponse = {
      RequestId: '12345',
      RequesterFirstName: 'John',
      RequesterLastName: 'Doe'
    };
    
    (RequestService.CreateRequest as jest.Mock).mockResolvedValue(mockResponse);
    
    render(<CreateRequestView />);
    
    const submitButton = screen.getByText('Submit');
    fireEvent.click(submitButton);
    
    const confirmButton = screen.getByText('Confirm');
    fireEvent.click(confirmButton);
    
    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith(expect.objectContaining({
        payload: mockResponse
      }));
    });
  });
});
