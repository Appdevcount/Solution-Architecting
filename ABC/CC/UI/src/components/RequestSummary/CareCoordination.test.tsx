import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import CareCoordinationInfo from './CareCoordination';
import * as RequestService from '../../services/RequestService';

jest.mock('../../services/RequestService', () => ({
  UpdateCareCoordination: jest.fn()
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

jest.mock('../Loader', () => {
  return function DummyLoader() {
    return <div data-testid="loader">Loading...</div>;
  };
});

const mockStore = configureStore([]);

describe('CareCoordinationInfo Component', () => {
  let store;
  
  const careCoordinationInfo = {
    ServiceType: 'Home Health',
    ServiceSubType: 'Home Health Standard',
    Reason: 'Help finding a serving provider',
    StartOfCare: '2025-05-01'
  };
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    store = mockStore({
      request: {
        RequestId: '12345',
        CareCoordinationInformation: careCoordinationInfo,
        RequestInformation: {
          Status: 'Open'
        },
        AssignToId: 'user@example.com'
      },
      auth: {
        user: {
          email: 'user@example.com',
          roles: ['CCCordSup']
        }
      }
    });
    
    (RequestService.UpdateCareCoordination as jest.Mock).mockResolvedValue({
      apiResp: true
    });
  });
  
  test('renders CareCoordinationInfo component with title', () => {
    render(
      <Provider store={store}>
        <CareCoordinationInfo />
      </Provider>
    );
    
    expect(screen.getByText('Care Coordination Information')).toBeInTheDocument();
  });
  
  test('displays care coordination information in view mode', () => {
    render(
      <Provider store={store}>
        <CareCoordinationInfo />
      </Provider>
    );
    
    expect(screen.getByText('Service Type:')).toBeInTheDocument();
    expect(screen.getByText('Home Health')).toBeInTheDocument();
    
    expect(screen.getByText('Service Sub Type:')).toBeInTheDocument();
    expect(screen.getByText('Home Health Standard')).toBeInTheDocument();
    
    expect(screen.getByText('Reason:')).toBeInTheDocument();
    expect(screen.getByText('Help finding a serving provider')).toBeInTheDocument();
    
    expect(screen.getByText('Start of Care:')).toBeInTheDocument();
    expect(screen.getByText('2025-05-01')).toBeInTheDocument();
  });
  
  test('displays Edit button when user has permission', () => {
    render(
      <Provider store={store}>
        <CareCoordinationInfo />
      </Provider>
    );
    
    expect(screen.getByText('Edit')).toBeInTheDocument();
  });
  
  test('switches to edit mode when Edit button is clicked', () => {
    render(
      <Provider store={store}>
        <CareCoordinationInfo />
      </Provider>
    );
    
    fireEvent.click(screen.getByText('Edit'));
    
    expect(screen.getByLabelText('Service Type')).toBeInTheDocument();
    expect(screen.getByLabelText('Service Sub Type')).toBeInTheDocument();
    expect(screen.getByLabelText('Reason')).toBeInTheDocument();
    expect(screen.getByLabelText('Start of Care')).toBeInTheDocument();
    
    expect(screen.getByText('Save')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });
  
  test('displays read-only fields for ServiceType, ServiceSubType, and Reason in edit mode', () => {
    render(
      <Provider store={store}>
        <CareCoordinationInfo />
      </Provider>
    );
    
    fireEvent.click(screen.getByText('Edit'));
    
    const serviceTypeInput = screen.getByLabelText('Service Type');
    const serviceSubTypeInput = screen.getByLabelText('Service Sub Type');
    const reasonInput = screen.getByLabelText('Reason');
    
    expect(serviceTypeInput).toHaveAttribute('readOnly');
    expect(serviceSubTypeInput).toHaveAttribute('readOnly');
    expect(reasonInput).toHaveAttribute('readOnly');
    
    expect(serviceTypeInput).toHaveValue('Home Health');
    expect(serviceSubTypeInput).toHaveValue('Home Health Standard');
    expect(reasonInput).toHaveValue('Help finding a serving provider');
  });
  
  test('allows editing of StartOfCare field in edit mode', () => {
    render(
      <Provider store={store}>
        <CareCoordinationInfo />
      </Provider>
    );
    
    fireEvent.click(screen.getByText('Edit'));
    
    const startOfCareInput = screen.getByLabelText('Start of Care');
    
    expect(startOfCareInput).not.toHaveAttribute('readOnly');
    
    fireEvent.change(startOfCareInput, { target: { value: '2025-06-01' } });
    expect(startOfCareInput).toHaveValue('2025-06-01');
  });
  
  test('returns to view mode when Cancel button is clicked', () => {
    render(
      <Provider store={store}>
        <CareCoordinationInfo />
      </Provider>
    );
    
    fireEvent.click(screen.getByText('Edit'));
    fireEvent.click(screen.getByText('Cancel'));
    
    expect(screen.getByText('Service Type:')).toBeInTheDocument();
    expect(screen.queryByLabelText('Service Type')).not.toBeInTheDocument();
  });
  
  test('shows validation error when StartOfCare is empty', async () => {
    render(
      <Provider store={store}>
        <CareCoordinationInfo />
      </Provider>
    );
    
    fireEvent.click(screen.getByText('Edit'));
    
    const startOfCareInput = screen.getByLabelText('Start of Care');
    fireEvent.change(startOfCareInput, { target: { value: '' } });
    fireEvent.blur(startOfCareInput);
    
    fireEvent.click(screen.getByText('Save'));
    
    await waitFor(() => {
      expect(screen.getByText('Start of Care date is required')).toBeInTheDocument();
    });
    
    expect(RequestService.UpdateCareCoordination).not.toHaveBeenCalled();
  });
  
  test('calls UpdateCareCoordination when form is submitted with valid data', async () => {
    render(
      <Provider store={store}>
        <CareCoordinationInfo />
      </Provider>
    );
    
    fireEvent.click(screen.getByText('Edit'));
    
    const startOfCareInput = screen.getByLabelText('Start of Care');
    fireEvent.change(startOfCareInput, { target: { value: '2025-06-01' } });
    
    fireEvent.click(screen.getByText('Save'));
    
    await waitFor(() => {
      expect(RequestService.UpdateCareCoordination).toHaveBeenCalledWith(
        '2025-06-01',
        '12345',
        'user@example.com'
      );
    });
  });
  
  test('shows success message when API call succeeds', async () => {
    render(
      <Provider store={store}>
        <CareCoordinationInfo />
      </Provider>
    );
    
    fireEvent.click(screen.getByText('Edit'));
    
    const startOfCareInput = screen.getByLabelText('Start of Care');
    fireEvent.change(startOfCareInput, { target: { value: '2025-06-01' } });
    
    fireEvent.click(screen.getByText('Save'));
    
    await waitFor(() => {
      expect(screen.getByText('Success!')).toBeInTheDocument();
    });
    
    expect(screen.getByText('Service Type:')).toBeInTheDocument();
  });
  
  test('shows error message when API call fails', async () => {
    (RequestService.UpdateCareCoordination as jest.Mock).mockResolvedValue({
      apiResp: false
    });
    
    render(
      <Provider store={store}>
        <CareCoordinationInfo />
      </Provider>
    );
    
    fireEvent.click(screen.getByText('Edit'));
    
    const startOfCareInput = screen.getByLabelText('Start of Care');
    fireEvent.change(startOfCareInput, { target: { value: '2025-06-01' } });
    
    fireEvent.click(screen.getByText('Save'));
    
    await waitFor(() => {
      expect(screen.getByText('CareCoordination Information can not be updated!')).toBeInTheDocument();
    });
  });
  
  test('shows error message when API call throws an error', async () => {
    (RequestService.UpdateCareCoordination as jest.Mock).mockRejectedValue(new Error('API Error'));
    
    render(
      <Provider store={store}>
        <CareCoordinationInfo />
      </Provider>
    );
    
    fireEvent.click(screen.getByText('Edit'));
    
    const startOfCareInput = screen.getByLabelText('Start of Care');
    fireEvent.change(startOfCareInput, { target: { value: '2025-06-01' } });
    
    fireEvent.click(screen.getByText('Save'));
    
    await waitFor(() => {
      expect(screen.getByText('API Error')).toBeInTheDocument();
    });
  });
  
  test('shows generic error message when API call throws a non-Error object', async () => {
    (RequestService.UpdateCareCoordination as jest.Mock).mockRejectedValue('Something went wrong');
    
    render(
      <Provider store={store}>
        <CareCoordinationInfo />
      </Provider>
    );
    
    fireEvent.click(screen.getByText('Edit'));
    
    const startOfCareInput = screen.getByLabelText('Start of Care');
    fireEvent.change(startOfCareInput, { target: { value: '2025-06-01' } });
    
    fireEvent.click(screen.getByText('Save'));
    
    await waitFor(() => {
      expect(screen.getByText('An unknown error occurred')).toBeInTheDocument();
    });
  });

  test('closes alert when close button is clicked', async () => {
    render(
      <Provider store={store}>
        <CareCoordinationInfo />
      </Provider>
    );
    
    fireEvent.click(screen.getByText('Edit'));
    
    const startOfCareInput = screen.getByLabelText('Start of Care');
    fireEvent.change(startOfCareInput, { target: { value: '2025-06-01' } });
    
    fireEvent.click(screen.getByText('Save'));
    
    await waitFor(() => {
      expect(screen.getByText('Success!')).toBeInTheDocument();
    });
    
    fireEvent.click(screen.getByText('Close'));
    
    expect(screen.getByTestId('custom-alert')).toHaveAttribute('data-show', 'false');
  });
  
  test('handles case when CareCoordinationInformation is null', () => {
    const storeWithoutCareCoordination = mockStore({
      request: {
        RequestId: '12345',
        CareCoordinationInformation: null,
        RequestInformation: {
          Status: 'Open'
        },
        AssignToId: 'user@example.com'
      },
      auth: {
        user: {
          email: 'user@example.com',
          roles: ['CCCordSup']
        }
      }
    });
    
    render(
      <Provider store={storeWithoutCareCoordination}>
        <CareCoordinationInfo />
      </Provider>
    );
    
    expect(screen.queryByText('Service Type:')).not.toBeInTheDocument();
  });
});
