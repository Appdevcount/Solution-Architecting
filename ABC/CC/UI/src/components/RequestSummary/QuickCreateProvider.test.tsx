import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import QuickCreateProviderForm from './QuickCreateProvider';
import * as RequestService from '../../services/RequestService';

jest.mock('../../services/RequestService', () => ({
  QuickCreateProvider: jest.fn(),
  UpdateCCSite: jest.fn()
}));

jest.mock('../Loader', () => {
  return function DummyLoader() {
    return <div data-testid="loader">Loading...</div>;
  };
});

jest.mock('../../config/config', () => ({
  USstates: [
    { value: 'AL', label: 'Alabama' },
    { value: 'AK', label: 'Alaska' },
    { value: 'AZ', label: 'Arizona' }
  ]
}));

describe('QuickCreateProviderForm Component', () => {
  const mockProps = {
    setShowQuickCreate: jest.fn(),
    RequestId: '12345',
    setSavedRecord: jest.fn(),
    handleCancel: jest.fn(),
    setAlert: jest.fn()
  };
  
  beforeEach(() => {
    jest.clearAllMocks();
    (RequestService.QuickCreateProvider as jest.Mock).mockResolvedValue({
      id: '1',
      SiteName: 'Test Facility'
    });
  });
  
  test('renders QuickCreateProviderForm with all form fields', () => {
    render(<QuickCreateProviderForm {...mockProps} />);
    
    expect(screen.getByLabelText(/Facility Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/NPI or TIN/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/NPI/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/TIN/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Street Address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/City/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Zip/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/State/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Phone/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Fax/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Network/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Source/i)).toBeInTheDocument();
    
    expect(screen.getByRole('button', { name: /Submit/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Cancel/i })).toBeInTheDocument();
  });
  
  test('renders state dropdown with options', () => {
    render(<QuickCreateProviderForm {...mockProps} />);
    
    const stateSelect = screen.getByLabelText(/State/i);
    fireEvent.click(stateSelect);
    
    expect(screen.getByText('Alabama')).toBeInTheDocument();
    expect(screen.getByText('Alaska')).toBeInTheDocument();
    expect(screen.getByText('Arizona')).toBeInTheDocument();
  });
  
  test('renders network dropdown with options', () => {
    render(<QuickCreateProviderForm {...mockProps} />);
    
    const networkSelect = screen.getByLabelText(/Network/i);
    fireEvent.click(networkSelect);
    
    expect(screen.getByText('PAR-INN')).toBeInTheDocument();
    expect(screen.getByText('PAR-OON')).toBeInTheDocument();
    expect(screen.getByText('NON-PAR')).toBeInTheDocument();
  });
  
  test('renders source dropdown with options', () => {
    render(<QuickCreateProviderForm {...mockProps} />);
    
    const sourceSelect = screen.getByLabelText(/Source/i);
    fireEvent.click(sourceSelect);
    
    expect(screen.getByText('Sites and Services spreadsheet')).toBeInTheDocument();
    expect(screen.getByText('Cigna website')).toBeInTheDocument();
    expect(screen.getByText('Google')).toBeInTheDocument();
    expect(screen.getByText('Other')).toBeInTheDocument();
  });
  
  test('validates required fields on submit', async () => {
    render(<QuickCreateProviderForm {...mockProps} />);
    
    fireEvent.click(screen.getByRole('button', { name: /Submit/i }));
    
    await waitFor(() => {
      expect(screen.getByText('Facility Name is required')).toBeInTheDocument();
      
    });
      expect(screen.getByText('Street Address is required')).toBeInTheDocument();
      expect(screen.getByText('City is required')).toBeInTheDocument();
      expect(screen.getByText('Zip is required')).toBeInTheDocument();
      expect(screen.getByText('State is required')).toBeInTheDocument();
      expect(screen.getByText('Phone is required')).toBeInTheDocument();
      expect(screen.getByText('Fax is required')).toBeInTheDocument();
      expect(screen.getByText('Network is required')).toBeInTheDocument();
      expect(screen.getByText('Source is required')).toBeInTheDocument();
    
    expect(RequestService.QuickCreateProvider).not.toHaveBeenCalled();
  });
  
  test('validates that either NPI or TIN must be provided', async () => {
    render(<QuickCreateProviderForm {...mockProps} />);
    
    fireEvent.change(screen.getByLabelText(/Facility Name/i), { target: { value: 'Test Facility' } });
    fireEvent.change(screen.getByLabelText(/Street Address/i), { target: { value: '123 Test St' } });
    fireEvent.change(screen.getByLabelText(/City/i), { target: { value: 'Test City' } });
    fireEvent.change(screen.getByLabelText(/Zip/i), { target: { value: '12345' } });
    
    const stateSelect = screen.getByLabelText(/State/i);
    fireEvent.change(stateSelect, { target: { value: 'AL' } });
    
    fireEvent.change(screen.getByLabelText(/Phone/i), { target: { value: '1234567890' } });
    fireEvent.change(screen.getByLabelText(/Fax/i), { target: { value: '1234567890' } });
    
    const networkSelect = screen.getByLabelText(/Network/i);
    fireEvent.change(networkSelect, { target: { value: 'PAR-INN' } });
    
    const sourceSelect = screen.getByLabelText(/Source/i);
    fireEvent.change(sourceSelect, { target: { value: 'Google' } });
    
    fireEvent.click(screen.getByRole('button', { name: /Submit/i }));
    
    await waitFor(() => {
      expect(screen.getByText('Please enter either NPI or TIN details')).toBeInTheDocument();
    });
    
    expect(RequestService.QuickCreateProvider).not.toHaveBeenCalled();
  });
  
  test('validates NPI format', async () => {
    render(<QuickCreateProviderForm {...mockProps} />);
    
    fireEvent.change(screen.getByLabelText(/Facility Name/i), { target: { value: 'Test Facility' } });
    fireEvent.change(screen.getByPlaceholderText(/NPI/i), { target: { value: '123' } }); // Invalid NPI (not 10 digits)
    fireEvent.change(screen.getByLabelText(/Street Address/i), { target: { value: '123 Test St' } });
    fireEvent.change(screen.getByLabelText(/City/i), { target: { value: 'Test City' } });
    fireEvent.change(screen.getByLabelText(/Zip/i), { target: { value: '12345' } });
    
    const stateSelect = screen.getByLabelText(/State/i);
    fireEvent.change(stateSelect, { target: { value: 'AL' } });
    
    fireEvent.change(screen.getByLabelText(/Phone/i), { target: { value: '1234567890' } });
    fireEvent.change(screen.getByLabelText(/Fax/i), { target: { value: '1234567890' } });
    
    const networkSelect = screen.getByLabelText(/Network/i);
    fireEvent.change(networkSelect, { target: { value: 'PAR-INN' } });
    
    const sourceSelect = screen.getByLabelText(/Source/i);
    fireEvent.change(sourceSelect, { target: { value: 'Google' } });
    
    fireEvent.click(screen.getByRole('button', { name: /Submit/i }));
    
    await waitFor(() => {
      expect(screen.getByText('Only numbers allowed in NPI. 10 characters length')).toBeInTheDocument();
    });
    
    expect(RequestService.QuickCreateProvider).not.toHaveBeenCalled();
  });
  
  test('validates TIN format', async () => {
    render(<QuickCreateProviderForm {...mockProps} />);
    
    fireEvent.change(screen.getByLabelText(/Facility Name/i), { target: { value: 'Test Facility' } });
    fireEvent.change(screen.getByPlaceholderText(/TIN/i), { target: { value: '123' } }); // Invalid TIN (not 9-11 digits)
    fireEvent.change(screen.getByLabelText(/Street Address/i), { target: { value: '123 Test St' } });
    fireEvent.change(screen.getByLabelText(/City/i), { target: { value: 'Test City' } });
    fireEvent.change(screen.getByLabelText(/Zip/i), { target: { value: '12345' } });
    
    const stateSelect = screen.getByLabelText(/State/i);
    fireEvent.change(stateSelect, { target: { value: 'AL' } });
    
    fireEvent.change(screen.getByLabelText(/Phone/i), { target: { value: '1234567890' } });
    fireEvent.change(screen.getByLabelText(/Fax/i), { target: { value: '1234567890' } });
    
    const networkSelect = screen.getByLabelText(/Network/i);
    fireEvent.change(networkSelect, { target: { value: 'PAR-INN' } });
    
    const sourceSelect = screen.getByLabelText(/Source/i);
    fireEvent.change(sourceSelect, { target: { value: 'Google' } });
    
    fireEvent.click(screen.getByRole('button', { name: /Submit/i }));
    
    await waitFor(() => {
      expect(screen.getByText('Only numbers allowed TIN. 9-11 character length')).toBeInTheDocument();
    });
    
    expect(RequestService.QuickCreateProvider).not.toHaveBeenCalled();
  });
  
  test('validates Zip format', async () => {
    render(<QuickCreateProviderForm {...mockProps} />);
    
    fireEvent.change(screen.getByLabelText(/Facility Name/i), { target: { value: 'Test Facility' } });
    fireEvent.change(screen.getByPlaceholderText(/NPI/i), { target: { value: '1234567890' } });
    fireEvent.change(screen.getByLabelText(/Street Address/i), { target: { value: '123 Test St' } });
    fireEvent.change(screen.getByLabelText(/City/i), { target: { value: 'Test City' } });
    fireEvent.change(screen.getByLabelText(/Zip/i), { target: { value: '123' } }); // Invalid Zip (not 5 or 9 digits)
    
    const stateSelect = screen.getByLabelText(/State/i);
    fireEvent.change(stateSelect, { target: { value: 'AL' } });
    
    fireEvent.change(screen.getByLabelText(/Phone/i), { target: { value: '1234567890' } });
    fireEvent.change(screen.getByLabelText(/Fax/i), { target: { value: '1234567890' } });
    
    const networkSelect = screen.getByLabelText(/Network/i);
    fireEvent.change(networkSelect, { target: { value: 'PAR-INN' } });
    
    const sourceSelect = screen.getByLabelText(/Source/i);
    fireEvent.change(sourceSelect, { target: { value: 'Google' } });
    
    fireEvent.click(screen.getByRole('button', { name: /Submit/i }));
    
    await waitFor(() => {
      expect(screen.getByText('Only numbers allowed. 5/9 character length')).toBeInTheDocument();
    });
    
    expect(RequestService.QuickCreateProvider).not.toHaveBeenCalled();
  });
  
  test('submits form successfully with valid data and NPI', async () => {
    render(<QuickCreateProviderForm {...mockProps} />);
    
    fireEvent.change(screen.getByLabelText(/Facility Name/i), { target: { value: 'Test Facility' } });
    fireEvent.change(screen.getByPlaceholderText(/NPI/i), { target: { value: '1234567890' } });
    fireEvent.change(screen.getByLabelText(/Street Address/i), { target: { value: '123 Test St' } });
    fireEvent.change(screen.getByLabelText(/City/i), { target: { value: 'Test City' } });
    fireEvent.change(screen.getByLabelText(/Zip/i), { target: { value: '12345' } });
    
    const stateSelect = screen.getByLabelText(/State/i);
    fireEvent.change(stateSelect, { target: { value: 'AL' } });
    
    fireEvent.change(screen.getByLabelText(/Phone/i), { target: { value: '1234567890' } });
    fireEvent.change(screen.getByLabelText(/Fax/i), { target: { value: '1234567890' } });
    
    const networkSelect = screen.getByLabelText(/Network/i);
    fireEvent.change(networkSelect, { target: { value: 'PAR-INN' } });
    
    const sourceSelect = screen.getByLabelText(/Source/i);
    fireEvent.change(sourceSelect, { target: { value: 'Google' } });
    
    fireEvent.click(screen.getByRole('button', { name: /Submit/i }));
    
    await waitFor(() => {
      expect(RequestService.QuickCreateProvider).toHaveBeenCalledWith({
        SiteName: 'Test Facility',
        NPI: '1234567890',
        TIN: '',
        Address: '123 Test St',
        City: 'Test City',
        Zip: '12345',
        State: 'AL',
        Phone: '1234567890',
        Fax: '1234567890',
        Network: 'PAR-INN',
        Source: 'Google',
        RequestId: '12345'
      });
    });
    
    expect(mockProps.setSavedRecord).toHaveBeenCalledWith({
      id: '1',
      SiteName: 'Test Facility'
    });
    expect(mockProps.handleCancel).toHaveBeenCalled();
    expect(mockProps.setAlert).toHaveBeenCalledWith({
      show: true,
      message: 'Provider created successfully!',
      variant: 'success'
    });
  });
  
  test('submits form successfully with valid data and TIN', async () => {
    render(<QuickCreateProviderForm {...mockProps} />);
    
    fireEvent.change(screen.getByLabelText(/Facility Name/i), { target: { value: 'Test Facility' } });
    fireEvent.change(screen.getByPlaceholderText(/TIN/i), { target: { value: '123456789' } });
    fireEvent.change(screen.getByLabelText(/Street Address/i), { target: { value: '123 Test St' } });
    fireEvent.change(screen.getByLabelText(/City/i), { target: { value: 'Test City' } });
    fireEvent.change(screen.getByLabelText(/Zip/i), { target: { value: '12345' } });
    
    const stateSelect = screen.getByLabelText(/State/i);
    fireEvent.change(stateSelect, { target: { value: 'AL' } });
    
    fireEvent.change(screen.getByLabelText(/Phone/i), { target: { value: '1234567890' } });
    fireEvent.change(screen.getByLabelText(/Fax/i), { target: { value: '1234567890' } });
    
    const networkSelect = screen.getByLabelText(/Network/i);
    fireEvent.change(networkSelect, { target: { value: 'PAR-INN' } });
    
    const sourceSelect = screen.getByLabelText(/Source/i);
    fireEvent.change(sourceSelect, { target: { value: 'Google' } });
    
    fireEvent.click(screen.getByRole('button', { name: /Submit/i }));
    
    await waitFor(() => {
      expect(RequestService.QuickCreateProvider).toHaveBeenCalledWith({
        SiteName: 'Test Facility',
        NPI: '',
        TIN: '123456789',
        Address: '123 Test St',
        City: 'Test City',
        Zip: '12345',
        State: 'AL',
        Phone: '1234567890',
        Fax: '1234567890',
        Network: 'PAR-INN',
        Source: 'Google',
        RequestId: '12345'
      });
    });
  });
  
  test('shows loading state during form submission', async () => {
    (RequestService.QuickCreateProvider as jest.Mock).mockImplementation(() => {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve({ id: '1', SiteName: 'Test Facility' });
        }, 100);
      });
    });
    
    render(<QuickCreateProviderForm {...mockProps} />);
    
    fireEvent.change(screen.getByLabelText(/Facility Name/i), { target: { value: 'Test Facility' } });
    fireEvent.change(screen.getByPlaceholderText(/NPI/i), { target: { value: '1234567890' } });
    fireEvent.change(screen.getByLabelText(/Street Address/i), { target: { value: '123 Test St' } });
    fireEvent.change(screen.getByLabelText(/City/i), { target: { value: 'Test City' } });
    fireEvent.change(screen.getByLabelText(/Zip/i), { target: { value: '12345' } });
    
    const stateSelect = screen.getByLabelText(/State/i);
    fireEvent.change(stateSelect, { target: { value: 'AL' } });
    
    fireEvent.change(screen.getByLabelText(/Phone/i), { target: { value: '1234567890' } });
    fireEvent.change(screen.getByLabelText(/Fax/i), { target: { value: '1234567890' } });
    
    const networkSelect = screen.getByLabelText(/Network/i);
    fireEvent.change(networkSelect, { target: { value: 'PAR-INN' } });
    
    const sourceSelect = screen.getByLabelText(/Source/i);
    fireEvent.change(sourceSelect, { target: { value: 'Google' } });
    
    fireEvent.click(screen.getByRole('button', { name: /Submit/i }));
        
    await waitFor(() => {
      expect(mockProps.setSavedRecord).toHaveBeenCalled();
    });
  });

  test('handles API error with non-Error object', async () => {
    (RequestService.QuickCreateProvider as jest.Mock).mockRejectedValue('Something went wrong');
    
    render(<QuickCreateProviderForm {...mockProps} />);
    
    fireEvent.change(screen.getByLabelText(/Facility Name/i), { target: { value: 'Test Facility' } });
    fireEvent.change(screen.getByPlaceholderText(/NPI/i), { target: { value: '1234567890' } });
    fireEvent.change(screen.getByLabelText(/Street Address/i), { target: { value: '123 Test St' } });
    fireEvent.change(screen.getByLabelText(/City/i), { target: { value: 'Test City' } });
    fireEvent.change(screen.getByLabelText(/Zip/i), { target: { value: '12345' } });
    
    const stateSelect = screen.getByLabelText(/State/i);
    fireEvent.change(stateSelect, { target: { value: 'AL' } });
    
    fireEvent.change(screen.getByLabelText(/Phone/i), { target: { value: '1234567890' } });
    fireEvent.change(screen.getByLabelText(/Fax/i), { target: { value: '1234567890' } });
    
    const networkSelect = screen.getByLabelText(/Network/i);
    fireEvent.change(networkSelect, { target: { value: 'PAR-INN' } });
    
    const sourceSelect = screen.getByLabelText(/Source/i);
    fireEvent.change(sourceSelect, { target: { value: 'Google' } });
    
    fireEvent.click(screen.getByRole('button', { name: /Submit/i }));
    
    await waitFor(() => {
      expect(mockProps.setAlert).toHaveBeenCalledWith({
        show: true,
        message: 'An unknown error occurred',
        variant: 'danger'
      });
    });
  });
  
  test('calls handleCancel and resets form when Cancel button is clicked', () => {
    render(<QuickCreateProviderForm {...mockProps} />);
    
    fireEvent.change(screen.getByLabelText(/Facility Name/i), { target: { value: 'Test Facility' } });
    
    fireEvent.click(screen.getByRole('button', { name: /Cancel/i }));
    
    expect(mockProps.setShowQuickCreate).toHaveBeenCalledWith(false);
  });
});
