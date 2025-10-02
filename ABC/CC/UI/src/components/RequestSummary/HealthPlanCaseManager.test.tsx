import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import HealthPlanCaseManager from './HealthPlanCaseManager';
import * as RequestService from '../../services/RequestService';

jest.mock('../../services/RequestService', () => ({
  ManageHealthPlanCaseManager: jest.fn(),
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

describe('HealthPlanCaseManager Component', () => {
  const mockCaseManager = {
    FirstName: 'John',
    LastName: 'Doe',
    PhoneNumber: '1234567890',
    Extension: '0011223344',
    Email: 'john.doe@example.com'
  };
  
  let store;
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    const initialState = {
      request: {
        RequestId: '12345',
        HealthPlanCaseManager: mockCaseManager,
        AssignToId: 'user@example.com',
        RequestInformation: {
          Status: 'Open'
        }
      },
      auth: {
        user: {
          email: 'user@example.com',
          roles: ['CCCordSup']
        }
      }
    };
    
    store = mockStore(initialState);
    
    (RequestService.ManageHealthPlanCaseManager as jest.Mock).mockResolvedValue({
      apiresp: true
    });
  });

  test('renders HealthPlanCaseManager component with title', () => {
    render(
      <Provider store={store}>
        <HealthPlanCaseManager />
      </Provider>
    );
    
    expect(screen.getByText('Health Plan Case Manager')).toBeInTheDocument();
  });

  test('displays case manager information in view mode', () => {
    render(
      <Provider store={store}>
        <HealthPlanCaseManager />
      </Provider>
    );
    
    expect(screen.getByText('First Name')).toBeInTheDocument();
    expect(screen.getByText('John')).toBeInTheDocument();
    expect(screen.getByText('Last Name')).toBeInTheDocument();
    expect(screen.getByText('Doe')).toBeInTheDocument();
    expect(screen.getByText('Phone Number')).toBeInTheDocument();
    expect(screen.getByText('1234567890')).toBeInTheDocument();
    expect(screen.getByText('Extension')).toBeInTheDocument();
    expect(screen.getByText('0011223344')).toBeInTheDocument();
    expect(screen.getByText('john.doe@example.com')).toBeInTheDocument();
  });

  test('displays Edit button when user is case owner and supervisor', () => {
    render(
      <Provider store={store}>
        <HealthPlanCaseManager />
      </Provider>
    );
    
    expect(screen.getByText('Edit')).toBeInTheDocument();
  });

  test('switches to edit mode when Edit button is clicked', () => {
    render(
      <Provider store={store}>
        <HealthPlanCaseManager />
      </Provider>
    );
    
    const editButton = screen.getByText('Edit');
    fireEvent.click(editButton);
    
    expect(screen.getByLabelText('First Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Last Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Phone number')).toBeInTheDocument();
    expect(screen.getByLabelText('Extension')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByText('Save')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  test('returns to view mode when Cancel button is clicked in edit mode', () => {
    render(
      <Provider store={store}>
        <HealthPlanCaseManager />
      </Provider>
    );
    
    const editButton = screen.getByText('Edit');
    fireEvent.click(editButton);
    
    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);
    
    expect(screen.getByText('Edit')).toBeInTheDocument();
    expect(screen.getByText('John')).toBeInTheDocument();
  });

  test('shows validation error when form is submitted with empty first name', async () => {
    render(
      <Provider store={store}>
        <HealthPlanCaseManager />
      </Provider>
    );
    
    const editButton = screen.getByText('Edit');
    fireEvent.click(editButton);
    
    const firstNameInput = screen.getByLabelText('First Name');
    fireEvent.change(firstNameInput, { target: { value: '' } });
    
    const saveButton = screen.getByText('Save');
    fireEvent.click(saveButton);
    
    await waitFor(() => {
      expect(screen.getByText('First Name is required')).toBeInTheDocument();
    });
    
    expect(RequestService.ManageHealthPlanCaseManager).not.toHaveBeenCalled();
  });

  test('shows validation error when form is submitted with empty last name', async () => {
    render(
      <Provider store={store}>
        <HealthPlanCaseManager />
      </Provider>
    );
    
    const editButton = screen.getByText('Edit');
    fireEvent.click(editButton);
    
    const lastNameInput = screen.getByLabelText('Last Name');
    fireEvent.change(lastNameInput, { target: { value: '' } });
    
    const saveButton = screen.getByText('Save');
    fireEvent.click(saveButton);
    
    await waitFor(() => {
      expect(screen.getByText('Last Name is required')).toBeInTheDocument();
    });
    
    expect(RequestService.ManageHealthPlanCaseManager).not.toHaveBeenCalled();
  });

  test('shows validation error when form is submitted with invalid phone number', async () => {
    render(
      <Provider store={store}>
        <HealthPlanCaseManager />
      </Provider>
    );
    
    const editButton = screen.getByText('Edit');
    fireEvent.click(editButton);
    
    const phoneInput = screen.getByLabelText('Phone number');
    fireEvent.change(phoneInput, { target: { value: '123' } });
    
    const saveButton = screen.getByText('Save');
    fireEvent.click(saveButton);
    
    await waitFor(() => {
      expect(screen.getByText('Must be a valid phone number')).toBeInTheDocument();
    });
    
    expect(RequestService.ManageHealthPlanCaseManager).not.toHaveBeenCalled();
  });

  test('shows validation error when form is submitted with invalid extension', async () => {
    render(
      <Provider store={store}>
        <HealthPlanCaseManager />
      </Provider>
    );
    
    const editButton = screen.getByText('Edit');
    fireEvent.click(editButton);
    
    const extensionInput = screen.getByLabelText('Extension');
    fireEvent.change(extensionInput, { target: { value: '123' } });
    
    const saveButton = screen.getByText('Save');
    fireEvent.click(saveButton);
    
    await waitFor(() => {
      expect(screen.getByText('Must be a valid Extension number')).toBeInTheDocument();
    });
    
    expect(RequestService.ManageHealthPlanCaseManager).not.toHaveBeenCalled();
  });

  test('shows validation error when form is submitted with invalid email', async () => {
    render(
      <Provider store={store}>
        <HealthPlanCaseManager />
      </Provider>
    );
    
    const editButton = screen.getByText('Edit');
    fireEvent.click(editButton);
    
    const emailInput = screen.getByLabelText('Email');
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    
    const saveButton = screen.getByText('Save');
    fireEvent.click(saveButton);
    
    await waitFor(() => {
      expect(screen.getByText('Must be a valid email address')).toBeInTheDocument();
    });
    
    expect(RequestService.ManageHealthPlanCaseManager).not.toHaveBeenCalled();
  });

  test('submits form with valid data and shows success message', async () => {
    render(
      <Provider store={store}>
        <HealthPlanCaseManager />
      </Provider>
    );
    
    const editButton = screen.getByText('Edit');
    fireEvent.click(editButton);
    
    const firstNameInput = screen.getByLabelText('First Name');
    fireEvent.change(firstNameInput, { target: { value: 'Jane' } });
    
    const lastNameInput = screen.getByLabelText('Last Name');
    fireEvent.change(lastNameInput, { target: { value: 'Smith' } });
    
    const phoneInput = screen.getByLabelText('Phone number');
    fireEvent.change(phoneInput, { target: { value: '9876543210' } });
    
    const extensionInput = screen.getByLabelText('Extension');
    fireEvent.change(extensionInput, { target: { value: '9876543210' } });
    
    const emailInput = screen.getByLabelText('Email');
    fireEvent.change(emailInput, { target: { value: 'jane.smith@example.com' } });
    
    const saveButton = screen.getByText('Save');
    fireEvent.click(saveButton);
    
    await waitFor(() => {
      expect(RequestService.ManageHealthPlanCaseManager).toHaveBeenCalledWith(
        'Jane',
        'Smith',
        '9876543210',
        '9876543210',
        'jane.smith@example.com',
        '12345',
        'user@example.com'
      );
    });
    
    expect(screen.getByText('Health Plan Case Manager detail has been updated!')).toBeInTheDocument();
  });

  test('shows error message when API returns failure', async () => {
    (RequestService.ManageHealthPlanCaseManager as jest.Mock).mockResolvedValue({
      apiresp: false
    });
    
    render(
      <Provider store={store}>
        <HealthPlanCaseManager />
      </Provider>
    );
    
    const editButton = screen.getByText('Edit');
    fireEvent.click(editButton);
    
    const saveButton = screen.getByText('Save');
    fireEvent.click(saveButton);
    
    await waitFor(() => {
      expect(screen.getByText('Health Plan Case Manager detail can not be updated')).toBeInTheDocument();
    });
  });

  test('shows error message when API throws an error', async () => {
    (RequestService.ManageHealthPlanCaseManager as jest.Mock).mockRejectedValue(new Error('API Error'));
    
    render(
      <Provider store={store}>
        <HealthPlanCaseManager />
      </Provider>
    );
    
    const editButton = screen.getByText('Edit');
    fireEvent.click(editButton);
    
    const saveButton = screen.getByText('Save');
    fireEvent.click(saveButton);
    
    await waitFor(() => {
      expect(screen.getByText('API Error')).toBeInTheDocument();
    });
  });

  test('shows generic error message when API throws a non-Error object', async () => {
    (RequestService.ManageHealthPlanCaseManager as jest.Mock).mockRejectedValue('Something went wrong');
    
    render(
      <Provider store={store}>
        <HealthPlanCaseManager />
      </Provider>
    );
    
    const editButton = screen.getByText('Edit');
    fireEvent.click(editButton);
    
    const saveButton = screen.getByText('Save');
    fireEvent.click(saveButton);
    
    await waitFor(() => {
      expect(screen.getByText('An unknown error occurred')).toBeInTheDocument();
    });
  });

  test('shows success alert message for submitting form with valid response', async () => {
    (RequestService.ManageHealthPlanCaseManager as jest.Mock).mockImplementation(() => {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve({ apiresp: true });
        }, 100);
      });
    });
    
    render(
      <Provider store={store}>
        <HealthPlanCaseManager />
      </Provider>
    );
    
    const editButton = screen.getByText('Edit');
    fireEvent.click(editButton);
    
    const saveButton = screen.getByText('Save');
    fireEvent.click(saveButton);
        
    await waitFor(() => {
      expect(screen.getByText('Health Plan Case Manager detail has been updated!')).toBeInTheDocument();
    });
  });

  test('displays Add button when no case manager info exists', () => {
    const noInfoState = {
      request: {
        RequestId: '12345',
        HealthPlanCaseManager: null,
        AssignToId: 'user@example.com',
        RequestInformation: {
          Status: 'Open'
        }
      },
      auth: {
        user: {
          email: 'user@example.com',
          roles: ['CCCordSup']
        }
      }
    };
    
    const noInfoStore = mockStore(noInfoState);
    
    render(
      <Provider store={noInfoStore}>
        <HealthPlanCaseManager />
      </Provider>
    );
    
    expect(screen.getByText('Add')).toBeInTheDocument();
  });

  test('closes alert when close button is clicked', async () => {
    render(
      <Provider store={store}>
        <HealthPlanCaseManager />
      </Provider>
    );
    
    const editButton = screen.getByText('Edit');
    fireEvent.click(editButton);
    
    const saveButton = screen.getByText('Save');
    fireEvent.click(saveButton);
    
    await waitFor(() => {
      expect(screen.getByText('Health Plan Case Manager detail has been updated!')).toBeInTheDocument();
    });
    
    const closeButton = screen.getByText('Close');
    fireEvent.click(closeButton);
    
    const alert = screen.getByTestId('custom-alert');
    expect(alert).toHaveAttribute('data-show', 'false');
  });
});
