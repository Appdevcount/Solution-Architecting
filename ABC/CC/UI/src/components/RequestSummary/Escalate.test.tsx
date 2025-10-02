import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import Escalate from './Escalate';
import * as RequestService from '../../services/RequestService';

jest.mock('../../services/RequestService', () => ({
  UpdateEscalate: jest.fn(),
}));

jest.mock('../CustomAlert', () => {
  return function DummyCustomAlert(props) {
    return (
      <div data-testid="custom-alert" data-show={props.show} data-variant={props.variant}>
        {props.message}
        <button onClick={props.onClose}>Close</button>
      </div>
    );
  };
});

const mockStore = configureStore([]);

describe('Escalate Component', () => {
  const mockProps = {
    show: true,
    onHide: jest.fn(),
    onSuccess: jest.fn(),
    title: 'Escalate Request',
    body: <div>Are you sure you want to escalate this request?</div>,
  };
  
  let store;
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    const initialState = {
      request: {
        RequestId: '12345',
      },
      auth: {
        user: {
          email: 'user@example.com',
        },
      },
    };
    
    store = mockStore(initialState);
    
    (RequestService.UpdateEscalate as jest.Mock).mockResolvedValue({
      apiResp: true,
    });
  });

  test('renders Escalate modal with title and body', () => {
    render(
      <Provider store={store}>
        <Escalate {...mockProps} />
      </Provider>
    );
    
    expect(screen.getByText('Escalate Request')).toBeInTheDocument();
    expect(screen.getByText('Are you sure you want to escalate this request?')).toBeInTheDocument();
    expect(screen.getByText('Yes')).toBeInTheDocument();
    expect(screen.getByText('No')).toBeInTheDocument();
  });

  test('does not render modal when show is false', () => {
    render(
      <Provider store={store}>
        <Escalate {...mockProps} show={false} />
      </Provider>
    );
    
    expect(screen.queryByText('Escalate Request')).not.toBeInTheDocument();
    expect(screen.queryByText('Are you sure you want to escalate this request?')).not.toBeInTheDocument();
  });

  test('calls onHide when No button is clicked', () => {
    render(
      <Provider store={store}>
        <Escalate {...mockProps} />
      </Provider>
    );
    
    const noButton = screen.getByText('No');
    fireEvent.click(noButton);
    
    expect(mockProps.onHide).toHaveBeenCalledTimes(1);
  });

  test('calls onHide when close button in header is clicked', () => {
    render(
      <Provider store={store}>
        <Escalate {...mockProps} />
      </Provider>
    );
    
    const closeButton = screen.getByLabelText('Close');
    fireEvent.click(closeButton);
    
    expect(mockProps.onHide).toHaveBeenCalledTimes(1);
  });

  test('calls UpdateEscalate service when Yes button is clicked', async () => {
    render(
      <Provider store={store}>
        <Escalate {...mockProps} />
      </Provider>
    );
    
    const yesButton = screen.getByText('Yes');
    fireEvent.click(yesButton);
    
    await waitFor(() => {
      expect(RequestService.UpdateEscalate).toHaveBeenCalledWith('12345', 'user@example.com');
    });
  });

  test('shows success message and calls onSuccess when API returns success', async () => {
    render(
      <Provider store={store}>
        <Escalate {...mockProps} />
      </Provider>
    );
    
    const yesButton = screen.getByText('Yes');
    fireEvent.click(yesButton);
    
    await waitFor(() => {
      expect(screen.getByText('Request Updated Successfully!')).toBeInTheDocument();
    });
    
    expect(mockProps.onSuccess).toHaveBeenCalledTimes(1);
  });

  test('shows error message when API returns failure', async () => {
    (RequestService.UpdateEscalate as jest.Mock).mockResolvedValue({
      apiResp: false,
    });
    
    render(
      <Provider store={store}>
        <Escalate {...mockProps} />
      </Provider>
    );
    
    const yesButton = screen.getByText('Yes');
    fireEvent.click(yesButton);
    
    await waitFor(() => {
      expect(screen.getByText('Request is not updated!')).toBeInTheDocument();
    });
    
    expect(mockProps.onSuccess).not.toHaveBeenCalled();
  });

  test('shows error message when API throws an error', async () => {
    (RequestService.UpdateEscalate as jest.Mock).mockRejectedValue(new Error('API Error'));
    
    render(
      <Provider store={store}>
        <Escalate {...mockProps} />
      </Provider>
    );
    
    const yesButton = screen.getByText('Yes');
    fireEvent.click(yesButton);
    
    await waitFor(() => {
      expect(screen.getByText('API Error')).toBeInTheDocument();
    });
    
    expect(mockProps.onSuccess).not.toHaveBeenCalled();
  });

  test('shows generic error message when API throws a non-Error object', async () => {
    (RequestService.UpdateEscalate as jest.Mock).mockRejectedValue('Something went wrong');
    
    render(
      <Provider store={store}>
        <Escalate {...mockProps} />
      </Provider>
    );
    
    const yesButton = screen.getByText('Yes');
    fireEvent.click(yesButton);
    
    await waitFor(() => {
      expect(screen.getByText('An unknown error occurred')).toBeInTheDocument();
    });
    
    expect(mockProps.onSuccess).not.toHaveBeenCalled();
  });

  test('closes alert when close button is clicked', async () => {
    render(
      <Provider store={store}>
        <Escalate {...mockProps} />
      </Provider>
    );
    
    const yesButton = screen.getByText('Yes');
    fireEvent.click(yesButton);
    
    await waitFor(() => {
      expect(screen.getByText('Request Updated Successfully!')).toBeInTheDocument();
    });
    
    const closeButton = screen.getByText('Close');
    fireEvent.click(closeButton);
    
    const alert = screen.getByTestId('custom-alert');
    expect(alert).toHaveAttribute('data-show', 'false');
  });

  test('passes correct request ID from Redux store to API call', async () => {
    const customState = {
      request: {
        RequestId: 'CUSTOM-ID-123',
      },
      auth: {
        user: {
          email: 'user@example.com',
        },
      },
    };
    
    const customStore = mockStore(customState);
    
    render(
      <Provider store={customStore}>
        <Escalate {...mockProps} />
      </Provider>
    );
    
    const yesButton = screen.getByText('Yes');
    fireEvent.click(yesButton);
    
    await waitFor(() => {
      expect(RequestService.UpdateEscalate).toHaveBeenCalledWith('CUSTOM-ID-123', 'user@example.com');
    });
  });

  test('passes correct user email from Redux store to API call', async () => {
    const customState = {
      request: {
        RequestId: '12345',
      },
      auth: {
        user: {
          email: 'custom@example.com',
        },
      },
    };
    
    const customStore = mockStore(customState);
    
    render(
      <Provider store={customStore}>
        <Escalate {...mockProps} />
      </Provider>
    );
    
    const yesButton = screen.getByText('Yes');
    fireEvent.click(yesButton);
    
    await waitFor(() => {
      expect(RequestService.UpdateEscalate).toHaveBeenCalledWith('12345', 'custom@example.com');
    });
  });
});
