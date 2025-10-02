import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import ActivityComponent from './Activity';
import * as ActivityService from '../../services/Activity';

jest.mock('../../services/Activity', () => ({
  GetActivityDetails: jest.fn(),
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

describe('Activity Component', () => {
  const mockActivities = [
    {
      CreatedBy: 'John Doe',
      Comment: 'created the request',
      CreatedDate: '2025-05-01T10:30:00',
    },
    {
      CreatedBy: 'Jane Smith',
      Comment: 'updated the request status',
      CreatedDate: '2025-05-02T14:45:00',
    },
    {
      CreatedBy: 'Admin User',
      Comment: 'assigned the request',
      CreatedDate: '2025-05-03T09:15:00',
    },
  ];
  
  let store;
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    const initialState = {
      request: {
        RequestId: '12345',
      },
    };
    
    store = mockStore(initialState);
    
    (ActivityService.GetActivityDetails as jest.Mock).mockResolvedValue({
      apiResult: mockActivities
    });
  });

  test('renders Activity component with title', async () => {
    render(
      <Provider store={store}>
        <ActivityComponent />
      </Provider>
    );
    
    expect(screen.getByText('Activity')).toBeInTheDocument();
    
    await waitFor(() => {
      expect(ActivityService.GetActivityDetails).toHaveBeenCalledWith('12345');
    });
  });

  test('displays activities when data is loaded', async () => {
    render(
      <Provider store={store}>
        <ActivityComponent />
      </Provider>
    );
    
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      
    });

      expect(screen.getByText('created the request')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      expect(screen.getByText('updated the request status')).toBeInTheDocument();
      expect(screen.getByText('Admin User')).toBeInTheDocument();
      expect(screen.getByText('assigned the request')).toBeInTheDocument();
    
    expect(screen.getByText('2025-05-01T10:30:00')).toBeInTheDocument();
    expect(screen.getByText('2025-05-02T14:45:00')).toBeInTheDocument();
    expect(screen.getByText('2025-05-03T09:15:00')).toBeInTheDocument();
  });

  test('displays empty state when no activities are returned', async () => {
    (ActivityService.GetActivityDetails as jest.Mock).mockResolvedValue({
      apiResult: []
    });
    
    render(
      <Provider store={store}>
        <ActivityComponent />
      </Provider>
    );
    
    await waitFor(() => {
      expect(ActivityService.GetActivityDetails).toHaveBeenCalledWith('12345');
    });
    
    const activityCards = screen.queryAllByText(/created the request|updated the request status|assigned the request/);
    expect(activityCards.length).toBe(0);
  });

  test('handles API error gracefully', async () => {
    (ActivityService.GetActivityDetails as jest.Mock).mockRejectedValue(new Error('Failed to fetch activities'));
    
    render(
      <Provider store={store}>
        <ActivityComponent />
      </Provider>
    );
    
    await waitFor(() => {
      expect(ActivityService.GetActivityDetails).toHaveBeenCalledWith('12345');
    });
    
    const activityCards = screen.queryAllByText(/created the request|updated the request status|assigned the request/);
    expect(activityCards.length).toBe(0);
  });

  test('refreshes activities when refreshFlag prop changes', async () => {
    const mockResetRefreshFlag = jest.fn();
    
    const { rerender } = render(
      <Provider store={store}>
        <ActivityComponent refreshFlag={false} resetRefreshFlag={mockResetRefreshFlag} />
      </Provider>
    );
    
    await waitFor(() => {
      expect(ActivityService.GetActivityDetails).toHaveBeenCalledTimes(1);
    });
    
    (ActivityService.GetActivityDetails as jest.Mock).mockClear();
    
    rerender(
      <Provider store={store}>
        <ActivityComponent refreshFlag={true} resetRefreshFlag={mockResetRefreshFlag} />
      </Provider>
    );
    
    await waitFor(() => {
      expect(ActivityService.GetActivityDetails).toHaveBeenCalledTimes(1);
    });
    
    expect(mockResetRefreshFlag).toHaveBeenCalledTimes(1);
  });

  test('does not call resetRefreshFlag if not provided', async () => {
    const { rerender } = render(
      <Provider store={store}>
        <ActivityComponent refreshFlag={false} />
      </Provider>
    );
    
    await waitFor(() => {
      expect(ActivityService.GetActivityDetails).toHaveBeenCalledTimes(1);
    });
    
    (ActivityService.GetActivityDetails as jest.Mock).mockClear();
    
    rerender(
      <Provider store={store}>
        <ActivityComponent refreshFlag={true} />
      </Provider>
    );
    
    await waitFor(() => {
      expect(ActivityService.GetActivityDetails).toHaveBeenCalledTimes(1);
    });
    
  });

 
  test('calls GetActivityDetails with correct request ID', async () => {
    const customState = {
      request: {
        RequestId: 'CUSTOM-ID-123',
      },
    };
    
    const customStore = mockStore(customState);
    
    render(
      <Provider store={customStore}>
        <ActivityComponent />
      </Provider>
    );
    
    await waitFor(() => {
      expect(ActivityService.GetActivityDetails).toHaveBeenCalledWith('CUSTOM-ID-123');
    });
  });

  test('handles null apiResult from API', async () => {
    (ActivityService.GetActivityDetails as jest.Mock).mockResolvedValue({
      apiResult: null
    });
    
    render(
      <Provider store={store}>
        <ActivityComponent />
      </Provider>
    );
    
    await waitFor(() => {
      expect(ActivityService.GetActivityDetails).toHaveBeenCalledWith('12345');
    });
    
    const activityCards = screen.queryAllByText(/created the request|updated the request status|assigned the request/);
    expect(activityCards.length).toBe(0);
  });
});
