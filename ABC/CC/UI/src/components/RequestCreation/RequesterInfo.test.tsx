import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import RequesterInfo from './RequesterInfo';
import { act } from 'react';

describe('RequesterInfo Component', () => {
  const mockFormik = {
    values: {
      RequesterFirstName: '',
      RequesterLastName: '',
      RequesterEmail: '',
      RequesterFaxNumber: '',
      RequesterPhoneNumber: '',
      RequesterExtension: '',
      RequesterFacility: ''
    },
    touched: {},
    errors: {},
    handleChange: jest.fn(),
    handleBlur: jest.fn(),
    setFieldValue: jest.fn(),
    handleSubmit:jest.fn(),
    handleReset:jest.fn(),
    isSubmitting: false,
    isValidating: false,
    submitCount: 0,
    setTouched:jest.fn(),
    setErros:jest.fn(),
    setValues:jest.fn(),
    validatForm:jest.fn(),
    validateField:jest.fn(),
    resetForm:jest.fn(),
    getFieldProps:jest.fn(),
    getFieldMeta:jest.fn(),
    getFielsHelpers:jest.fn(),
    initialValues:{},
    initialErrors:{},
    initialTouched:{},
    dirty:false,
    isValid:true,
    status:undefined,
    setStatus: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders requester information form', () => {
    render(<RequesterInfo formik={mockFormik as any} />);
    
    expect(screen.getByText('Requester Information')).toBeInTheDocument();
    expect(screen.getByLabelText('First Name *')).toBeInTheDocument();
    expect(screen.getByLabelText('Last Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Fax Number')).toBeInTheDocument();
    expect(screen.getByLabelText('Phone Number')).toBeInTheDocument();
    expect(screen.getByLabelText('Extension')).toBeInTheDocument();
    expect(screen.getByLabelText('Facility')).toBeInTheDocument();
  });

  test('handles input changes for first name', () => {
    render(<RequesterInfo formik={mockFormik as any} />);
    
    const firstNameInput = screen.getByLabelText('First Name *');
    fireEvent.change(firstNameInput, { target: { value: 'John' } });
    
    expect(mockFormik.handleChange).toHaveBeenCalled();
  });

  test('handles input changes for last name', () => {
    render(<RequesterInfo formik={mockFormik as any} />);
    
    const lastNameInput = screen.getByLabelText('Last Name');
    fireEvent.change(lastNameInput, { target: { value: 'Doe' } });
    
    expect(mockFormik.handleChange).toHaveBeenCalled();
  });

  test('handles input changes for email', () => {
    render(<RequesterInfo formik={mockFormik as any} />);
    
    const emailInput = screen.getByLabelText('Email');
    fireEvent.change(emailInput, { target: { value: 'john.doe@example.com' } });
    
    expect(mockFormik.handleChange).toHaveBeenCalled();
  });

  test('handles input changes for fax number', () => {
    render(<RequesterInfo formik={mockFormik as any} />);
    
    const faxInput = screen.getByLabelText('Fax Number');
    fireEvent.change(faxInput, { target: { value: '1234567890' } });
    
    expect(mockFormik.handleChange).toHaveBeenCalled();
  });

  test('handles input changes for phone number', () => {
    render(<RequesterInfo formik={mockFormik as any} />);
    
    const phoneInput = screen.getByLabelText('Phone Number');
    fireEvent.change(phoneInput, { target: { value: '1234567890' } });
    
    expect(mockFormik.handleChange).toHaveBeenCalled();
  });

  test('handles input changes for extension', () => {
    render(<RequesterInfo formik={mockFormik as any} />);
    
    const extensionInput = screen.getByLabelText('Extension');
    fireEvent.change(extensionInput, { target: { value: '123' } });
    
    expect(mockFormik.handleChange).toHaveBeenCalled();
  });

  test('handles input changes for facility', () => {
    render(<RequesterInfo formik={mockFormik as any} />);
    
    const facilityInput = screen.getByLabelText('Facility');
    fireEvent.change(facilityInput, { target: { value: 'Hospital ABC' } });
    
    expect(mockFormik.handleChange).toHaveBeenCalled();
  });

  test('handles blur events', () => {
    render(<RequesterInfo formik={mockFormik as any} />);
    
    const firstNameInput = screen.getByLabelText('First Name *');
    fireEvent.blur(firstNameInput);
    
    expect(mockFormik.handleBlur).toHaveBeenCalled();
  });

  test('displays validation errors for first name when present', () => {
    const formikWithErrors = {
      ...mockFormik,
      touched: {
        RequesterFirstName: true
      },
      errors: {
        RequesterFirstName: 'First name is required'
      }
    };
    
    render(<RequesterInfo formik={formikWithErrors as any} />);
    
    expect(screen.getByText('First name is required')).toBeInTheDocument();
  });

  test('displays validation errors for last name when present', () => {
    const formikWithErrors = {
      ...mockFormik,
      touched: {
        RequesterLastName: true
      },
      errors: {
        RequesterLastName: 'Last name is required'
      }
    };
    
    render(<RequesterInfo formik={formikWithErrors as any} />);
    
    expect(screen.getByText('Last name is required')).toBeInTheDocument();
  });

  test('displays validation errors for email when present', () => {
    const formikWithErrors = {
      ...mockFormik,
      touched: {
        RequesterEmail: true
      },
      errors: {
        RequesterEmail: 'Valid email is required'
      }
    };
    
    render(<RequesterInfo formik={formikWithErrors as any} />);
    
    expect(screen.getByText('Valid email is required')).toBeInTheDocument();
  });

  test('displays validation errors for phone number when present', () => {
    const formikWithErrors = {
      ...mockFormik,
      touched: {
        RequesterPhoneNumber: true
      },
      errors: {
        RequesterPhoneNumber: 'Valid phone number is required'
      }
    };
    
    render(<RequesterInfo formik={formikWithErrors as any} />);
    
    expect(screen.getByText('Valid phone number is required')).toBeInTheDocument();
  });

  test('respects maxLength attributes', () => {
    render(<RequesterInfo formik={mockFormik as any} />);
    
    const firstNameInput = screen.getByLabelText('First Name *');
    expect(firstNameInput).toHaveAttribute('maxLength', '50');
    
    const lastNameInput = screen.getByLabelText('Last Name');
    expect(lastNameInput).toHaveAttribute('maxLength', '50');
    
    const faxInput = screen.getByLabelText('Fax Number');
    expect(faxInput).toHaveAttribute('maxLength', '10');
    
    const phoneInput = screen.getByLabelText('Phone Number');
    expect(phoneInput).toHaveAttribute('maxLength', '10');
    
    const extensionInput = screen.getByLabelText('Extension');
    expect(extensionInput).toHaveAttribute('maxLength', '10');
    
    const facilityInput = screen.getByLabelText('Facility');
    expect(facilityInput).toHaveAttribute('maxLength', '50');
  });
});
