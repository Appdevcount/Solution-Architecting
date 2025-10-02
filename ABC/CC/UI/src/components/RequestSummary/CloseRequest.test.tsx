import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import CloseRequestForm from './CloseRequest';
import * as RequestService from '../../services/RequestService';

jest.mock('../../services/RequestService', () => ({
  CloseRequest: jest.fn(),
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

describe('CloseRequest Component', () => {
  const mockProps = {
    show: true,
    onHide: jest.fn(),
    onConfirm: jest.fn(),
    onSuccess: jest.fn(),
    title: 'Close Request',
    body: <div>Are you sure you want to close this request?</div>,
    RequestId: '12345',
  };
  
  let store;
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    const initialState = {
      request: {
        RequestId: '12345',
        RequestInformation: {
          Status: 'Open',
        },
      },
      auth: {
        user: {
          email: 'user@example.com',
        },
      },
    };
    
    store = mockStore(initialState);
    
    (RequestService.CloseRequest as jest.Mock).mockResolvedValue({
      apiResp: true,
    });
  });

  test('renders CloseRequest modal with title and body', () => {
    render(
      <Provider store={store}>
        <CloseRequestForm {...mockProps} />
      </Provider>
    );
    
    expect(screen.getByText('Reason')).toBeInTheDocument();
    expect(screen.getByTestId('closed-button')).toBeInTheDocument();
    expect(screen.getByTestId('cancel-button')).toBeInTheDocument();
  });

  test('does not render modal when show is false', () => {
    render(
      <Provider store={store}>
        <CloseRequestForm {...mockProps} show={false} />
      </Provider>
    );
    
    expect(screen.queryByText('Close Request')).not.toBeInTheDocument();
    expect(screen.queryByText('Are you sure you want to close this request?')).not.toBeInTheDocument();
  });

  test('calls onHide when Cancel button is clicked', () => {
    render(
      <Provider store={store}>
        <CloseRequestForm {...mockProps} />
      </Provider>
    );
    
    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);
    
    expect(mockProps.onHide).toHaveBeenCalledTimes(1);
  });

  test('calls onHide when cancel button in header is clicked', () => {
    render(
      <Provider store={store}>
        <CloseRequestForm {...mockProps} />
      </Provider>
    );
    
    const closeButton = screen.getByTestId("cancel-button");
    fireEvent.click(closeButton);
    
    expect(mockProps.onHide).toHaveBeenCalledTimes(1);
  });

  test('shows validation error when form is submitted with empty reason', async () => {
    render(
      <Provider store={store}>
        <CloseRequestForm {...mockProps} />
      </Provider>
    );
    
    const closeButton = screen.getByTestId('closed-button');
    fireEvent.click(closeButton);
    
    await waitFor(() => {
      expect(screen.getByText('Reason cannot consist of only spaces.')).toBeInTheDocument();
    });
    
    expect(RequestService.CloseRequest).not.toHaveBeenCalled();
  });

  test('shows validation error when reason is too short', async () => {
    render(
      <Provider store={store}>
        <CloseRequestForm {...mockProps} />
      </Provider>
    );
    
    const reasonInput = screen.getByPlaceholderText('Enter your reason here...');
    fireEvent.change(reasonInput, { target: { value: 'Test' } });
    
    const closeButton = screen.getByTestId('closed-button');
    fireEvent.click(closeButton);
    
    await waitFor(() => {
      expect(screen.getByText('Reason must be at least 5 characters long.')).toBeInTheDocument();
    });
    
    expect(RequestService.CloseRequest).not.toHaveBeenCalled();
  });

  test('shows validation error when reason is too long', async () => {
    render(
      <Provider store={store}>
        <CloseRequestForm {...mockProps} />
      </Provider>
    );
    
    const reasonInput = screen.getByPlaceholderText('Enter your reason here...');
    const longReason = 'A'.repeat(501);
    fireEvent.change(reasonInput, { target: { value: longReason } });
    
    const closeButton = screen.getByTestId('closed-button');
    fireEvent.click(closeButton);
    
    await waitFor(() => {
      expect(screen.getByText('Reason cannot exceed 500 characters.')).toBeInTheDocument();
    });
    
    expect(RequestService.CloseRequest).not.toHaveBeenCalled();
  });

  test('shows validation error when reason is numeric-only', async () => {
    render(
      <Provider store={store}>
        <CloseRequestForm {...mockProps} />
      </Provider>
    );
    
    const reasonInput = screen.getByPlaceholderText('Enter your reason here...');
    fireEvent.change(reasonInput, { target: { value: '12345' } });
    
    const closeButton = screen.getByTestId('closed-button');
    fireEvent.click(closeButton);
    
    await waitFor(() => {
      expect(screen.getByText('Reason cannot be numeric-only.')).toBeInTheDocument();
    });
    
    expect(RequestService.CloseRequest).not.toHaveBeenCalled();
  });

  test('calls CloseRequest service when form is submitted with valid reason', async () => {
    render(
      <Provider store={store}>
        <CloseRequestForm {...mockProps} />
      </Provider>
    );
    
    const reasonInput = screen.getByPlaceholderText('Enter your reason here...');
    fireEvent.change(reasonInput, { target: { value: 'Valid reason for closing the request' } });
    
    const closeButton = screen.getByTestId('closed-button');;
    fireEvent.click(closeButton);
    
    await waitFor(() => {
      expect(RequestService.CloseRequest).toHaveBeenCalledWith(
        'Valid reason for closing the request',
        'Closed',
        '12345',
        'user@example.com'
      );
    });
  });

  test('calls onSuccess and onConfirm when API returns success', async () => {
    render(
      <Provider store={store}>
        <CloseRequestForm {...mockProps} />
      </Provider>
    );
    
    const reasonInput = screen.getByPlaceholderText('Enter your reason here...');
    fireEvent.change(reasonInput, { target: { value: 'Valid reason for closing the request' } });
    
    const closeButton = screen.getByTestId('closed-button');
    fireEvent.click(closeButton);
    
    await waitFor(() => {
      expect(RequestService.CloseRequest).toHaveBeenCalled();
    });
    
    expect(mockProps.onSuccess).toHaveBeenCalledTimes(1);
    expect(mockProps.onConfirm).toHaveBeenCalledTimes(1);
  });

 
  test('shows error message when API throws an error', async () => {
    (RequestService.CloseRequest as jest.Mock).mockRejectedValue(new Error('API Error'));
    
    render(
      <Provider store={store}>
        <CloseRequestForm {...mockProps} />
      </Provider>
    );
    
    const reasonInput = screen.getByPlaceholderText('Enter your reason here...');
    fireEvent.change(reasonInput, { target: { value: 'Valid reason for closing the request' } });
    
    const closeButton = screen.getByTestId('closed-button');;
    fireEvent.click(closeButton);
    
    await waitFor(() => {
      expect(screen.getByText('API Error')).toBeInTheDocument();
    });
    
    expect(mockProps.onSuccess).not.toHaveBeenCalled();
    expect(mockProps.onConfirm).not.toHaveBeenCalled();
  });

  test('shows generic error message when API throws a non-Error object', async () => {
    (RequestService.CloseRequest as jest.Mock).mockRejectedValue('Something went wrong');
    
    render(
      <Provider store={store}>
        <CloseRequestForm {...mockProps} />
      </Provider>
    );
    
    const reasonInput = screen.getByPlaceholderText('Enter your reason here...');
    fireEvent.change(reasonInput, { target: { value: 'Valid reason for closing the request' } });
    
    const closeButton = screen.getByTestId('closed-button');
    fireEvent.click(closeButton);
    
    await waitFor(() => {
      expect(screen.getByText('An unknown error occurred')).toBeInTheDocument();
    });
    
    expect(mockProps.onSuccess).not.toHaveBeenCalled();
    expect(mockProps.onConfirm).not.toHaveBeenCalled();
  });

  test('closes model when cancel button is clicked', async () => {
    (RequestService.CloseRequest as jest.Mock).mockResolvedValue({
      apiResp: false,
    });
    
    render(
      <Provider store={store}>
        <CloseRequestForm {...mockProps} />
      </Provider>
    );
    
    const reasonInput = screen.getByPlaceholderText('Enter your reason here...');
    fireEvent.change(reasonInput, { target: { value: 'Valid reason for closing the request' } });
    
    const closeButton = screen.getByTestId('closed-button');
    fireEvent.click(closeButton);
   
    const alertCloseButton = screen.getByText('Cancel');
    fireEvent.click(alertCloseButton);

  });

  test('uses status from Redux store when available', async () => {
    render(
      <Provider store={store}>
        <CloseRequestForm {...mockProps} />
      </Provider>
    );
    
    const reasonInput = screen.getByPlaceholderText('Enter your reason here...');
    fireEvent.change(reasonInput, { target: { value: 'Valid reason for closing the request' } });
    
    const closeButton = screen.getByTestId('closed-button');
    fireEvent.click(closeButton);
    
    await waitFor(() => {
      expect(RequestService.CloseRequest).toHaveBeenCalledWith(
        'Valid reason for closing the request',
        'Closed', // Status from Redux store
        '12345',
        'user@example.com'
      );
    });
  });

 
});
