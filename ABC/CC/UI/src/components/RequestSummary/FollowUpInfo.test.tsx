import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import FollowUpInfo from './FollowUpInfo';
import * as RequestService from '../../services/RequestService';
import { act } from 'react-dom/test-utils';

// Mock the RequestService
jest.mock('../../services/RequestService', () => ({
  UpdateFollowUpInfo: jest.fn(),
}));

const mockStore = configureStore([]);

describe('FollowUpInfo Component', () => {
  let store;
  
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Create mock store with initial state
    store = mockStore({
      request: {
        RequestId: '12345',
        FollowUpInformation: {
          Date: '2025-05-30',
          Details: 'Test follow-up details'
        },
        RequestInformation: {
          Status: 'Open'
        },
        AssignToId: 'test@example.com'
      },
      auth: {
        user: {
          email: 'test@example.com',
          roles: ['CCCordSup']
        }
      }
    });
  });

  test('renders follow-up information when available', () => {
    render(
      <Provider store={store}>
        <FollowUpInfo />
      </Provider>
    );

    expect(screen.getByText('Follow-Up Information')).toBeInTheDocument();
    expect(screen.getByText('Date:')).toBeInTheDocument();
    expect(screen.getByText('Details:')).toBeInTheDocument();
    expect(screen.getByText('Test follow-up details')).toBeInTheDocument();
  });

  test('displays edit button when user has permission', () => {
    render(
      <Provider store={store}>
        <FollowUpInfo />
      </Provider>
    );

    expect(screen.getByText('Edit')).toBeInTheDocument();
  });

  test('does not display edit button when request is closed', () => {
    const closedStore = mockStore({
      request: {
        RequestId: '12345',
        FollowUpInformation: {
          Date: '2025-05-30',
          Details: 'Test follow-up details'
        },
        RequestInformation: {
          Status: 'Closed'
        },
        AssignToId: 'test@example.com'
      },
      auth: {
        user: {
          email: 'other@example.com',
          roles: []
        }
      }
    });

    render(
      <Provider store={closedStore}>
        <FollowUpInfo />
      </Provider>
    );

    expect(screen.queryByText('Edit')).not.toBeInTheDocument();
  });

  test('displays "Add" button when no follow-up info exists', () => {
    const noInfoStore = mockStore({
      request: {
        RequestId: '12345',
        FollowUpInformation: null,
        RequestInformation: {
          Status: 'Open'
        },
        AssignToId: 'test@example.com'
      },
      auth: {
        user: {
          email: 'test@example.com',
          roles: ['CCCordSup']
        }
      }
    });

    render(
      <Provider store={noInfoStore}>
        <FollowUpInfo />
      </Provider>
    );

    expect(screen.getByText('Please Add follow-up Info')).toBeInTheDocument();
  });

  test('switches to edit mode when edit button is clicked', async () => {
    render(
      <Provider store={store}>
        <FollowUpInfo />
      </Provider>
    );

    fireEvent.click(screen.getByText('Edit'));

    expect(screen.getByLabelText('Date')).toBeInTheDocument();
    expect(screen.getByLabelText('Details')).toBeInTheDocument();
    expect(screen.getByText('Save')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  test('returns to view mode when cancel button is clicked', async () => {
    render(
      <Provider store={store}>
        <FollowUpInfo />
      </Provider>
    );

    fireEvent.click(screen.getByText('Edit'));
    expect(screen.getByLabelText('Date')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Cancel'));
    expect(screen.queryByLabelText('Date')).not.toBeInTheDocument();
    expect(screen.getByText('Test follow-up details')).toBeInTheDocument();
  });

  test('validates required fields', async () => {
    render(
      <Provider store={store}>
        <FollowUpInfo />
      </Provider>
    );

    fireEvent.click(screen.getByText('Edit'));
    
    // Clear the fields
    fireEvent.change(screen.getByLabelText('Date'), { target: { value: '' } });
    fireEvent.change(screen.getByLabelText('Details'), { target: { value: '' } });
    
    // Submit the form
    fireEvent.click(screen.getByText('Save'));
    
    // Check for validation errors
    await waitFor(() => {
      expect(screen.getByText('Date is required')).toBeInTheDocument();
    });
    expect(screen.getByText('Details is required')).toBeInTheDocument();

  });

  test('validates date is in the future', async () => {
    render(
      <Provider store={store}>
        <FollowUpInfo />
      </Provider>
    );

    fireEvent.click(screen.getByText('Edit'));
    
    // Set past date
    fireEvent.change(screen.getByLabelText('Date'), { target: { value: '2020-01-01' } });
    
    // Submit the form
    fireEvent.click(screen.getByText('Save'));
    
    // Check for validation error
    await waitFor(() => {
      expect(screen.getByText('Please select a date from today onwards')).toBeInTheDocument();
    });
  });

  test('validates date is not too far in the future', async () => {
    render(
      <Provider store={store}>
        <FollowUpInfo />
      </Provider>
    );

    fireEvent.click(screen.getByText('Edit'));
    
    // Set date too far in future (more than 45 days)
    const farFutureDate = new Date();
    farFutureDate.setDate(farFutureDate.getDate() + 60);
    const dateString = farFutureDate.toISOString().split('T')[0];
    
    fireEvent.change(screen.getByLabelText('Date'), { target: { value: dateString } });
    
    // Submit the form
    fireEvent.click(screen.getByText('Save'));
    
    // Check for validation error
    await waitFor(() => {
      expect(screen.getByText('Please enter a date that is not greater than 45 days from the current date')).toBeInTheDocument();
    });
  });
  test('handles API error during submission', async () => {
    // Mock API error
    (RequestService.UpdateFollowUpInfo as jest.Mock).mockRejectedValue(
      new Error('API error occurred')
    );

    render(
      <Provider store={store}>
        <FollowUpInfo />
      </Provider>
    );

    fireEvent.click(screen.getByText('Edit'));
    
    // Set valid values
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 10);
    const dateString = futureDate.toISOString().split('T')[0];
    
    fireEvent.change(screen.getByLabelText('Date'), { target: { value: dateString } });
    fireEvent.change(screen.getByLabelText('Details'), { target: { value: 'Updated details' } });
    
    // Submit the form
      fireEvent.click(screen.getByText('Save'));
    
    
    // Check for error message
    await waitFor(() => {
      expect(screen.getByText('API error occurred')).toBeInTheDocument();
    });
  });

  test('handles unsuccessful API response', async () => {
    // Mock unsuccessful API response
    (RequestService.UpdateFollowUpInfo as jest.Mock).mockResolvedValue({
      apiResp: false
    });

    render(
      <Provider store={store}>
        <FollowUpInfo />
      </Provider>
    );

    fireEvent.click(screen.getByText('Edit'));
    
    // Set valid values
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 10);
    const dateString = futureDate.toISOString().split('T')[0];
    
    fireEvent.change(screen.getByLabelText('Date'), { target: { value: dateString } });
    fireEvent.change(screen.getByLabelText('Details'), { target: { value: 'Updated details' } });
    
    // Submit the form
      fireEvent.click(screen.getByText('Save'));
    
    
    // Check for error message
    await waitFor(() => {
      expect(screen.getByText('FollowUp detail can not be updated')).toBeInTheDocument();
    });
  });
});
