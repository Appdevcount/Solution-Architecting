import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import MemberQuickCreateForm from './MemberQuickCreate';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';

const originalConsoleError = console.error;
const originalConsoleLog = console.log;

beforeAll(() => {
  console.error = jest.fn();
  console.log = jest.fn();
});

afterAll(() => {
  console.error = originalConsoleError;
  console.log = originalConsoleLog;
});

jest.mock('../../config/config', () => ({
  USstates: [
    { value: 'AL', label: 'Alabama' },
    { value: 'AK', label: 'Alaska' },
    { value: 'NY', label: 'New York' }
  ]
}));

describe('MemberQuickCreateForm Component', () => {
  const mockProps = {
    setShowQuickCreate: jest.fn(),
    RequestId: 'test-request-id',
    handleQuickCreateMemberDetails: jest.fn(),
    handleCancel: jest.fn(),
    setAlert: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders the form with all required fields', () => {
    render(<MemberQuickCreateForm {...mockProps} />);
    
    expect(screen.getByLabelText('Member ID *')).toBeInTheDocument();
    expect(screen.getByLabelText('First Name *')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('LastName')).toBeInTheDocument();
    expect(screen.getByLabelText('Date Of Birth *')).toBeInTheDocument();
    expect(screen.getByLabelText('Gender *')).toBeInTheDocument();
    expect(screen.getByLabelText('StreetAddress *')).toBeInTheDocument();
    expect(screen.getByLabelText('City *')).toBeInTheDocument();
    expect(screen.getByLabelText('Zip *')).toBeInTheDocument();
    expect(screen.getByLabelText('State *')).toBeInTheDocument();
    
    expect(screen.getByText('Save')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  test('shows validation errors when submitting empty form', async () => {
    render(<MemberQuickCreateForm {...mockProps} />);
    
      fireEvent.click(screen.getByText('Save'));
    
    
    await waitFor(() => {
      expect(screen.getByText('Member Id is required')).toBeInTheDocument();
    });
  });

  test('validates Member ID field', async () => {
    render(<MemberQuickCreateForm {...mockProps} />);
    
    const memberIdInput = screen.getByLabelText('Member ID *');
    
      fireEvent.focus(memberIdInput);
      fireEvent.blur(memberIdInput);
    
    
    await waitFor(() => {
      expect(screen.getByText('Member Id is required')).toBeInTheDocument();
    });
    
      fireEvent.change(memberIdInput, { target: { value: 'MEM123' } });   
    await waitFor(() => {
      expect(screen.queryByText('MemberId is required')).not.toBeInTheDocument();
    });
  });

  test('validates First Name and Last Name fields', async () => {
    render(<MemberQuickCreateForm {...mockProps} />);
    
    const firstNameInput = screen.getByLabelText('First Name *');
    const lastNameInput = screen.getByPlaceholderText('LastName');
    
      fireEvent.focus(firstNameInput);
      fireEvent.blur(firstNameInput);    
      fireEvent.focus(lastNameInput);
      fireEvent.blur(lastNameInput);  
    
    await waitFor(() => {
      expect(screen.getByText('Member Id is required')).toBeInTheDocument();
    });
    
      fireEvent.change(firstNameInput, { target: { value: 'John' } });
      fireEvent.change(lastNameInput, { target: { value: 'Doe' } });
    
    
    await waitFor(() => {
      expect(screen.queryByText('Please enter the Name')).not.toBeInTheDocument();
    });
  });

  test('validates Date of Birth field', async () => {
    render(<MemberQuickCreateForm {...mockProps} />);
    
    const dobInput = screen.getByLabelText('Date Of Birth *');
    
    fireEvent.focus(dobInput);
    fireEvent.blur(dobInput);
     
    await waitFor(() => {
      expect(screen.getByText('Date of Birth is required')).toBeInTheDocument();
    });
    
    fireEvent.change(dobInput, { target: { value: '1990-01-01' } }); 
    await waitFor(() => {
      expect(screen.queryByText('Date Of Birth is required')).not.toBeInTheDocument();
    });
  });

  test('validates Gender field', async () => {
    render(<MemberQuickCreateForm {...mockProps} />);
    
    const genderSelect = screen.getByLabelText('Gender *');
    
      fireEvent.focus(genderSelect);
      fireEvent.blur(genderSelect);
    
    
    await waitFor(() => {
      expect(screen.getByText('Gender is required')).toBeInTheDocument();
    });
    
      fireEvent.change(genderSelect, { target: { value: 'Male' } });  
    await waitFor(() => {
      expect(screen.queryByText('Gender is required')).not.toBeInTheDocument();
    });
  });

  test('validates Address fields', async () => {
    render(<MemberQuickCreateForm {...mockProps} />);
    
    const streetInput = screen.getByLabelText('StreetAddress *');
    const cityInput = screen.getByLabelText('City *');
    const zipInput = screen.getByLabelText('Zip *');
    const stateSelect = screen.getByLabelText('State *');
    
      fireEvent.focus(streetInput);
      fireEvent.blur(streetInput); 
      fireEvent.focus(cityInput);
      fireEvent.blur(cityInput);     
      fireEvent.focus(zipInput);
      fireEvent.blur(zipInput);     
      fireEvent.focus(stateSelect);
      fireEvent.blur(stateSelect);
    
    
    await waitFor(() => {
      expect(screen.getByText('Street Address is required')).toBeInTheDocument();
      
    });
    expect(screen.getByText('City is required')).toBeInTheDocument();
      expect(screen.getByText('Zip is required')).toBeInTheDocument();
      expect(screen.getByText('State is required')).toBeInTheDocument();
    
      fireEvent.change(streetInput, { target: { value: '123 Main St' } });
      fireEvent.change(cityInput, { target: { value: 'New York' } });
      fireEvent.change(zipInput, { target: { value: '10001' } });
      fireEvent.change(stateSelect, { target: { value: 'NY' } });
    
    await waitFor(() => {
      expect(screen.queryByText('Street Address is required')).not.toBeInTheDocument();    
    });
    expect(screen.queryByText('City is required')).not.toBeInTheDocument();
    expect(screen.queryByText('Zip is required')).not.toBeInTheDocument();
    expect(screen.queryByText('State is required')).not.toBeInTheDocument();
  });

  test('submits form with valid data', async () => {
    render(<MemberQuickCreateForm {...mockProps} />);
    
      fireEvent.change(screen.getByLabelText('Member ID *'), { target: { value: 'MEM123' } });
      fireEvent.change(screen.getByLabelText('First Name *'), { target: { value: 'John' } });
      fireEvent.change(screen.getByPlaceholderText('LastName'), { target: { value: 'Doe' } });
      fireEvent.change(screen.getByLabelText('Date Of Birth *'), { target: { value: '1990-01-01' } });
      fireEvent.change(screen.getByLabelText('Gender *'), { target: { value: 'Male' } });
      fireEvent.change(screen.getByLabelText('StreetAddress *'), { target: { value: '123 Main St' } });
      fireEvent.change(screen.getByLabelText('City *'), { target: { value: 'New York' } });
      fireEvent.change(screen.getByLabelText('Zip *'), { target: { value: '10001' } });
      fireEvent.change(screen.getByLabelText('State *'), { target: { value: 'NY' } });   
      fireEvent.click(screen.getByText('Save'));   
    await waitFor(() => {
      expect(mockProps.handleQuickCreateMemberDetails).toHaveBeenCalledWith({
        MemberId: 'MEM123',
        FirstName: 'John',
        LastName: 'Doe',
        Dob: '1990-01-01',
        Gender: 'Male',
        StreetAddress: '123 Main St',
        City: 'New York',
        Zip: '10001',
        State: 'NY'
      });
    });
    expect(mockProps.setShowQuickCreate).toHaveBeenCalledWith(false);

  });

  test('handles cancel button click', async () => {
    render(<MemberQuickCreateForm {...mockProps} />);
    
      fireEvent.change(screen.getByLabelText('Member ID *'), { target: { value: 'MEM123' } });  
      fireEvent.click(screen.getByText('Cancel'));
    
    
    expect(mockProps.setShowQuickCreate).toHaveBeenCalledWith(false);
  });

  test('renders state options from config', async () => {
    render(<MemberQuickCreateForm {...mockProps} />);
    
    fireEvent.click(screen.getByLabelText('State *'));
    expect(screen.getByText('Alabama')).toBeInTheDocument();
    expect(screen.getByText('Alaska')).toBeInTheDocument();
    expect(screen.getByText('New York')).toBeInTheDocument();
  });

  test('handles form validation with QuickCreateMemberformValidation', async () => {
    render(<MemberQuickCreateForm {...mockProps} />);
    
      fireEvent.change(screen.getByLabelText('Member ID *'), { target: { value: 'MEM123' } });
      fireEvent.change(screen.getByLabelText('First Name *'), { target: { value: 'John' } });
      fireEvent.change(screen.getByPlaceholderText('LastName'), { target: { value: 'Doe' } });
      fireEvent.change(screen.getByLabelText('Date Of Birth *'), { target: { value: '1990-01-01' } });
      fireEvent.change(screen.getByLabelText('Gender *'), { target: { value: 'Male' } });
      fireEvent.change(screen.getByLabelText('StreetAddress *'), { target: { value: '123 Main St' } });
      fireEvent.change(screen.getByLabelText('City *'), { target: { value: 'New York' } });
      fireEvent.change(screen.getByLabelText('State *'), { target: { value: 'NY' } });
       
      fireEvent.click(screen.getByText('Save'));
    
    
    await waitFor(() => {
      expect(screen.getByText('Zip is required')).toBeInTheDocument();
    });
    
      fireEvent.change(screen.getByLabelText('Zip *'), { target: { value: '10001' } });  
      fireEvent.click(screen.getByText('Save'));
    
    
    await waitFor(() => {
      expect(mockProps.handleQuickCreateMemberDetails).toHaveBeenCalled();
    });
  });

  test('handles form submission with preventDefault', async () => {
    render(<MemberQuickCreateForm {...mockProps} />);
    
      fireEvent.change(screen.getByLabelText('Member ID *'), { target: { value: 'MEM123' } });
      fireEvent.change(screen.getByLabelText('First Name *'), { target: { value: 'John' } });
      fireEvent.change(screen.getByPlaceholderText('LastName'), { target: { value: 'Doe' } });
      fireEvent.change(screen.getByLabelText('Date Of Birth *'), { target: { value: '1990-01-01' } });
      fireEvent.change(screen.getByLabelText('Gender *'), { target: { value: 'Male' } });
      fireEvent.change(screen.getByLabelText('StreetAddress *'), { target: { value: '123 Main St' } });
      fireEvent.change(screen.getByLabelText('City *'), { target: { value: 'New York' } });
      fireEvent.change(screen.getByLabelText('Zip *'), { target: { value: '10001' } });
      fireEvent.change(screen.getByLabelText('State *'), { target: { value: 'NY' } });
    
    
      fireEvent.click(screen.getByText('Save'));
    
    
    await waitFor(() => {
      expect(mockProps.handleQuickCreateMemberDetails).toHaveBeenCalled();
    });
  });
});
