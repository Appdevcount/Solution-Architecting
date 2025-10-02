import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CareCoordination from './CareCoordination';
import { act } from 'react';
describe('CareCoordination Component', () => {
  const mockFormik = {
    values: {
      Reason: '',
      StartOfCare: '',
      isEscalated: false,
      Notes: ''
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
    initialValues:{
        Reason: '',
        StartOfCare: '',
        isEscalated: false,
        Notes: ''
    },
    initialErrors:{},
    initialTouched:{},
    dirty:false,
    isValid:true,
    status:undefined,
    setStatus: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders care coordination information form', () => {
    render(<CareCoordination formik={mockFormik as any} />);
    
    expect(screen.getByText('Care Coordination Information')).toBeInTheDocument();
    expect(screen.getByText('Reason *')).toBeInTheDocument();
    expect(screen.getByText('Start of Care *')).toBeInTheDocument();
    expect(screen.getByText('Is Escalated')).toBeInTheDocument();
    expect(screen.getByText('Notes')).toBeInTheDocument();
  });

  test('displays reason dropdown with options', () => {
    render(<CareCoordination formik={mockFormik as any} />);
    
    const selectElement = screen.getByLabelText('Reason *');
    expect(selectElement).toBeInTheDocument();
    
    expect(screen.getByText('Select Reason')).toBeInTheDocument();
    expect(screen.getByText('Missed/Late Service')).toBeInTheDocument();
    expect(screen.getByText('Help finding a serving provider')).toBeInTheDocument();
    expect(screen.getByText('Other')).toBeInTheDocument();
    expect(screen.getByText('Member escalation')).toBeInTheDocument();
  });

  test('handles reason selection', () => {
    render(<CareCoordination formik={mockFormik as any} />);
    
    const selectElement = screen.getByLabelText('Reason *');
    fireEvent.change(selectElement, { target: { value: 'Other' } });
    
    expect(mockFormik.handleChange).toHaveBeenCalled();
  });

  test('handles start of care date selection', () => {
    render(<CareCoordination formik={mockFormik as any} />);
    
    const dateInput = screen.getByLabelText('Start of Care *');
    fireEvent.change(dateInput, { target: { value: '2025-05-15' } });
    
    expect(mockFormik.handleChange).toHaveBeenCalled();
  });

  test('handles is escalated checkbox toggle', () => {
    render(<CareCoordination formik={mockFormik as any} />);
    
    const checkbox = screen.getByLabelText('Is Escalated');
    fireEvent.click(checkbox);
    
    expect(mockFormik.handleChange).toHaveBeenCalled();
  });

  test('handles notes input', () => {
    render(<CareCoordination formik={mockFormik as any} />);
    
    const notesInput = screen.getByLabelText('Notes');
    fireEvent.change(notesInput, { target: { value: 'Test notes' } });
    
    expect(mockFormik.handleChange).toHaveBeenCalled();
  });

  test('displays validation errors for reason when present', () => {
    const formikWithErrors = {
      ...mockFormik,
      touched: {
        Reason: true
      },
      errors: {
        Reason: 'Reason is required'
      }
    };
    
    render(<CareCoordination formik={formikWithErrors as any} />);
    
    expect(screen.getByText('Reason is required')).toBeInTheDocument();
  });

  test('displays validation errors for start of care when present', () => {
    const formikWithErrors = {
      ...mockFormik,
      touched: {
        StartOfCare: true
      },
      errors: {
        StartOfCare: 'Start of care date is required'
      }
    };
    
    render(<CareCoordination formik={formikWithErrors as any} />);
    
    expect(screen.getByText('Start of care date is required')).toBeInTheDocument();
  });

  test('displays validation errors for notes when present', () => {
    const formikWithErrors = {
      ...mockFormik,
      touched: {
        Notes: true
      },
      errors: {
        Notes: 'Notes are required'
      }
    };
    
    render(<CareCoordination formik={formikWithErrors as any} />);
    
    expect(screen.getByText('Notes are required')).toBeInTheDocument();
  });

  test('handles blur events', () => {
    render(<CareCoordination formik={mockFormik as any} />);
    
    const reasonSelect = screen.getByLabelText('Reason *');
    fireEvent.blur(reasonSelect);
    
    expect(mockFormik.handleBlur).toHaveBeenCalled();
  });

  test('renders with pre-filled values', () => {
    const formikWithValues = {
      ...mockFormik,
      values: {
        Reason: 'Other',
        StartOfCare: '2025-05-15',
        isEscalated: true,
        Notes: 'Test notes'
      }
    };
    
    render(<CareCoordination formik={formikWithValues as any} />);
    
    const reasonSelect = screen.getByLabelText('Reason *');
    expect(reasonSelect).toHaveValue('Other');
    
    const dateInput = screen.getByLabelText('Start of Care *');
    expect(dateInput).toHaveValue('2025-05-15');
    
    const checkbox = screen.getByLabelText('Is Escalated');
    expect(checkbox).toBeChecked();
    
    const notesInput = screen.getByLabelText('Notes');
    expect(notesInput).toHaveValue('Test notes');
  });
});
