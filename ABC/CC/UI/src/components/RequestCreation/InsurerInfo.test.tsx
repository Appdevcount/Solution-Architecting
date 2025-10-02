import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import InsurerInfo from './InsurerInfo';
import { act } from 'react';

describe('InsurerInfo Component', () => {
  const mockFormik  = {
    values: {
      InsurerName: '',
      CareCoordinationType: '',
      CareCoordinationSubType: ''
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
  } ;
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders insurer information form', () => {
    render(<InsurerInfo formik={mockFormik as any} />);
    
    expect(screen.getByText('Insurer Information')).toBeInTheDocument();
    expect(screen.getByText('Insurer Name *')).toBeInTheDocument();
    expect(screen.getByText('Select Insurer')).toBeInTheDocument();
  });

  test('displays insurer dropdown with options', () => {
    render(<InsurerInfo formik={mockFormik as any} />);
    
    const selectElement = screen.getByLabelText('Insurer Name *');
    expect(selectElement).toBeInTheDocument();
    
    expect(screen.getByText('Cigna')).toBeInTheDocument();
  });

  test('does not show care coordination types when no insurer is selected', () => {
    render(<InsurerInfo formik={mockFormik as any} />);
    
    expect(screen.queryByText('Care Coordination Type')).not.toBeInTheDocument();
  });

  test('shows care coordination types when insurer is selected', () => {
    const updatedFormik = {
      ...mockFormik,
      values: {
        ...mockFormik.values,
        InsurerName: 'Cigna'
      }
    };
    
    render(<InsurerInfo formik={updatedFormik as any} />);
    
    expect(screen.getByText('Care Coordination Type')).toBeInTheDocument();
    expect(screen.getByText('DME')).toBeInTheDocument();
    expect(screen.getByText('Home Health')).toBeInTheDocument();
    expect(screen.getByText('Sleep')).toBeInTheDocument();
  });

  test('shows subtypes when care coordination type is selected', () => {
    const updatedFormik = {
      ...mockFormik,
      values: {
        ...mockFormik.values,
        InsurerName: 'Cigna',
        CareCoordinationType: 'DME'
      }
    };
    
    render(<InsurerInfo formik={updatedFormik as any} />);
    
    expect(screen.getByText('Standard')).toBeInTheDocument();
    expect(screen.getByText('O&P')).toBeInTheDocument();
  });
  
  test('handles insurer change', () => {
    render(<InsurerInfo formik={mockFormik as any} />);
    
    const selectElement = screen.getByLabelText('Insurer Name *');
    fireEvent.change(selectElement, { target: { value: 'Cigna' } });
    
    expect(mockFormik.handleChange).toHaveBeenCalled();
  });

  test('displays validation errors when present', () => {
    const formikWithErrors = {
      ...mockFormik,
      touched: {
        InsurerName: true
      },
      errors: {
        InsurerName: 'Insurer is required'
      }
    };
    
    render(<InsurerInfo formik={formikWithErrors as any} />);
    
    expect(screen.getByText('Insurer is required')).toBeInTheDocument();
  });

  test('handles care coordination type selection', () => {
    const updatedFormik = {
      ...mockFormik,
      values: {
        ...mockFormik.values,
        InsurerName: 'Cigna'
      }
    };
    
    render(<InsurerInfo formik={updatedFormik as any} />);
    
    const dmeRadio = screen.getByLabelText('DME');
    fireEvent.click(dmeRadio);
    
    expect(mockFormik.handleChange).toHaveBeenCalled();
  });

  test('handles care coordination subtype selection', () => {
    const updatedFormik = {
      ...mockFormik,
      values: {
        ...mockFormik.values,
        InsurerName: 'Cigna',
        CareCoordinationType: 'DME'
      }
    };
    
    render(<InsurerInfo formik={updatedFormik as any} />);
    
    const standardRadio = screen.getByLabelText('Standard');
    fireEvent.click(standardRadio);
    
    expect(mockFormik.handleChange).not.toHaveBeenCalled();
  });

  test('displays validation errors for care coordination type', () => {
    const formikWithErrors = {
      ...mockFormik,
      values: {
        ...mockFormik.values,
        InsurerName: 'Cigna'
      },
      touched: {
        CareCoordinationType: true
      },
      errors: {
        CareCoordinationType: 'Care coordination type is required'
      }
    };
    
    render(<InsurerInfo formik={formikWithErrors as any} />);
    
    expect(screen.getByText('Care coordination type is required')).toBeInTheDocument();
  });

});
