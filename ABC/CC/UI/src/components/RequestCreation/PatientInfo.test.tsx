import { act } from 'react';
import { render, screen, fireEvent, waitFor, getByText } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import PatientInfo from './PatientInfo';
import * as LookupService from '../../services/LookupService';
import * as requestSlice from '../../state/reducers/requestSlice';
import { notDeepEqual } from 'assert';

jest.mock('../../services/LookupService', () => ({
  PatientLookupAPI: jest.fn(),
  PaitentEligibility: jest.fn(),
  formatCompactDateToMMDDYYY: jest.fn(date => date ? 'MM/DD/YYYY' : ''),
  formatDateToMMDDYYY: jest.fn(date => date ? 'MM/DD/YYYY' : '')
}));

jest.mock('../../state/reducers/requestSlice', () => ({
  setIsRestrictedGlobal: jest.fn(() => ({ type: 'mock/setIsRestrictedGlobal' }))
}));

jest.mock('../TableComponent', () => {
  return function MockTableComponent(props) {
    return (
      <div data-testid="table-component">
        <button 
          data-testid="row-click-button" 
          onClick={() => props.handleRowClick({
            MemberId: '12345',
            MemberName: 'Doe, John',
            Address: '123 Main St, City, State',
            MemberDOB: '01/01/1990',
            InsuranceCategory: 'Commercial',
            EligibilityDates: '01/01/2023 to 12/31/2023',
            Gender: 'Male',
            Zip: '12345'
          })}>
          Simulate Row Click
        </button>
      </div>
    );
  };
});

jest.mock('./RequestCustomAlert', () => {
  return function MockRequestCustomAlert(props) {
    return (
      <div data-testid="request-custom-alert">
        {props.show && (
          <div>
            <span>{props.message}</span>
            <span>{props.discription}</span>
            <button onClick={() => props.onClose()}>Close</button>
          </div>
        )}
      </div>
    );
  };
});

jest.mock('../CustomAlert', () => {
  return function MockCustomAlert(props) {
    return (
      <div data-testid="custom-alert">
        {props.show && (
          <div>
            <span>{props.message}</span>
            <button onClick={() => props.onClose()}>Close</button>
          </div>
        )}
      </div>
    );
  };
});

jest.mock('./MemberQuickCreate', () => {
  return function MockMemberQuickCreateForm(props) {
    return (
      <div data-testid="member-quick-create-form">
        <button 
          data-testid="quick-create-submit" 
          onClick={() => props.handleQuickCreateMemberDetails({
            MemberId: 'QC12345',
            FirstName: 'Jane',
            LastName: 'Smith',
            StreetAddress: '456 Oak St',
            City: 'Townsville',
            State: 'ST',
            Zip: '67890',
            Gender: 'Female',
            Dob: '02/15/1985'
          })}>
          Submit Quick Create
        </button>
        <button 
          data-testid="quick-create-cancel" 
          onClick={() => props.handleCancel()}>
          Cancel
        </button>
      </div>
    );
  };
});

jest.mock('./StaffingRequestModal', () => {
  return function MockStaffingRequestModal(props) {
    return (
      <div data-testid="staffing-request-modal">
        <button 
          data-testid="modal-close" 
          onClick={() => props.onClose()}>
          Close
        </button>
        <button 
          data-testid="modal-select-yes" 
          onClick={() => props.onSelectOption(true)}>
          Yes
        </button>
        <button 
          data-testid="modal-select-no" 
          onClick={() => props.onSelectOption(false)}>
          No
        </button>
      </div>
    );
  };
});

const mockStore = configureStore([]);

describe('PatientInfo', () => {
  let store;
  let formik;

  beforeEach(() => {
    formik = {
      values: {
        MemberIdSearchterm: '',
        MemberFirstNameSearchterm: '',
        MemberLastNameSearchterm: '',
        MemberDOBSearchterm: '',
        MemberId: '',
        IsRestrictedMember: false,
        MemberFirstName: '',
        MemberLastName: '',
        MemberDOB: '',
        MemberAddress: '',
        MemberInsuranceCategory: '',
        MemberEligibilityDates: ''
      },
      touched: {},
      errors: {},
      handleChange: jest.fn(),
      handleBlur: jest.fn(),
      setFieldValue: jest.fn(),
      setFieldTouched: jest.fn()
    };

    store = mockStore({
      auth: {
        user: {
          hasLEA: true
        }
      }
    });

    jest.clearAllMocks();
  });

  test('renders the patient info form', () => {
    render(
      <Provider store={store}>
        <PatientInfo formik={formik} />
      </Provider>
    );

    expect(screen.getByText('Member Information')).toBeInTheDocument();
    expect(screen.getByLabelText('Member ID *')).toBeInTheDocument();
    expect(screen.getByLabelText('First Name *')).toBeInTheDocument();
    expect(screen.getByLabelText('Last Name *')).toBeInTheDocument();
    expect(screen.getByLabelText('Date of Birth *')).toBeInTheDocument();
    expect(screen.getByText('Search Patient')).toBeInTheDocument();
    expect(screen.getByText('Quick Create Member')).toBeInTheDocument();
  });

  test('handles patient lookup with results', async () => {
    const mockPatientResponse = {
      apiResult: [
        {
          patientID: '12345',
          firstName: 'John',
          lastName: 'Doe',
          patientAddr1: '123 Main St',
          patientAddr2: '',
          patientCity: 'City',
          patientDOB: '19900101',
          category: 'Commercial',
          patientEffDate: '20230101',
          patientTermDate: '20231231',
          patientZip: '12345',
          patientGender: 'M',
          isRestrictedMember: false
        }
      ]
    };
    
    (LookupService.PatientLookupAPI  as jest.Mock).mockResolvedValue(mockPatientResponse);

    formik.values = {
      ...formik.values,
      MemberIdSearchterm: '12345',
      MemberFirstNameSearchterm: 'John',
      MemberLastNameSearchterm: 'Doe',
      MemberDOBSearchterm: '1990-01-01'
    };

    render(
      <Provider store={store}>
        <PatientInfo formik={formik} />
      </Provider>
    );

    const searchButton = screen.getByText('Search Patient');
      fireEvent.click(searchButton);
    

    expect(LookupService.PatientLookupAPI).toHaveBeenCalledWith({
      memberId: '12345',
      memberFirstName: 'John',
      memberLastName: 'Doe',
      memberDOB: '1990-01-01'
    });

    await waitFor(() => {
      expect(screen.getByTestId('table-component')).toBeInTheDocument();
    });
  });

  test('shows error when patient lookup returns no results', async () => {
    (LookupService.PatientLookupAPI  as jest.Mock).mockResolvedValue({ apiResult: [] });

    formik.values = {
      ...formik.values,
      MemberIdSearchterm: '99999',
      MemberFirstNameSearchterm: 'Nobody',
      MemberLastNameSearchterm: 'NoSuchPerson',
      MemberDOBSearchterm: '2000-01-01'
    };

    render(
      <Provider store={store}>
        <PatientInfo formik={formik} />
      </Provider>
    );

    const searchButton = screen.getByText('Search Patient');
      fireEvent.click(searchButton);
    

    await waitFor(() => {
      expect(screen.getByTestId('custom-alert')).toBeInTheDocument();
    });
  });
  test('shows error for restricted member when user has no LEA access', async () => {
    store = mockStore({
      auth: {
        user: {
          hasLEA: false
        }
      }
    });

    const mockRestrictedResponse = {
      apiResult: [
        {
          patientID: '12345',
          firstName: 'John',
          lastName: 'Doe',
          patientAddr1: '123 Main St',
          patientCity: 'City',
          patientDOB: '19900101',
          category: 'Commercial',
          patientEffDate: '20230101',
          patientTermDate: '20231231',
          isRestrictedMember: true
        }
      ]
    };
    
    (LookupService.PatientLookupAPI as jest.Mock).mockResolvedValue(mockRestrictedResponse);

    formik.values = {
      ...formik.values,
      MemberIdSearchterm: '12345',
      MemberFirstNameSearchterm: 'John',
      MemberLastNameSearchterm: 'Doe',
      MemberDOBSearchterm: '1990-01-01'
    };

    render(
      <Provider store={store}>
        <PatientInfo formik={formik} />
      </Provider>
    );

    const searchButton = screen.getByText('Search Patient');
    fireEvent.click(searchButton);
    

    await waitFor(() => {
      expect(screen.getByTestId('custom-alert')).toBeInTheDocument();
    });
  })
 test('handles row click and eligibility check for in-scope member', async () => {
    const mockEligibilityResponse = {
      apiResult: [
        {
          memberInScope: 'TRUE'
        }
      ]
    };
    
    (LookupService.PaitentEligibility as jest.Mock).mockResolvedValue(mockEligibilityResponse);

    const mockPatientResponse = {
      apiResult: [
        {
          patientID: '12345',
          firstName: 'John',
          lastName: 'Doe',
          patientAddr1: '123 Main St',
          patientCity: 'City',
          patientDOB: '19900101',
          category: 'Commercial',
          patientEffDate: '20230101',
          patientTermDate: '20231231',
          patientZip: '12345',
          patientGender: 'M',
          isRestrictedMember: false,
          patientPhone: '555-123-4567',
          patientName: 'Doe, John',
          oAOSubNo: '12345',
          oAOPerNo: '67890',
          memberCode: 'MC001',
          iPACode: 'IPA001',
          patientGroupNumber: 'GRP001',
          patientGroupDescription: 'Group Description',
          lineOfBusiness: 'LOB001',
          eMAIL: 'john.doe@example.com',
          jurisdictionState: 'CA',
          tIT19: 'TIT19',
          planType: 'PT001',
          patientPUSRDF: 'PUSRDF001',
          extID: 'EXT001',
        }
      ],
      language: 'English',
      erisa: 'ERISA001',
      funding: 'FUND001'
    };
    
    (LookupService.PatientLookupAPI as jest.Mock).mockResolvedValue(mockPatientResponse);

    formik.values = {
      ...formik.values,
      MemberIdSearchterm: '12345',
      MemberFirstNameSearchterm: 'John',
      MemberLastNameSearchterm: 'Doe',
      MemberDOBSearchterm: '1990-01-01'
    };

    render(
      <Provider store={store}>
        <PatientInfo formik={formik} />
      </Provider>
    );

    const searchButton = await screen.findByText('Search Patient');
    fireEvent.click(searchButton);
    
    const rowClickButton = await screen.findByTestId('row-click-button');
    fireEvent.click(rowClickButton);
    

    expect(LookupService.PaitentEligibility).toHaveBeenCalled();

    await waitFor(() => {
      expect(screen.getByTestId('staffing-request-modal')).toBeInTheDocument();
    });

    expect(formik.setFieldValue).toHaveBeenCalledWith('MemberId', '12345');
    expect(formik.setFieldValue).toHaveBeenCalledWith('MemberFirstName', 'Doe, John');
  });
  test('Closes In Scope confirmation model when selected No', async () => {
    const mockEligibilityResponse = {
      apiResult: [
        {
          memberInScope: 'TRUE'
        }
      ]
    };
    
    (LookupService.PaitentEligibility as jest.Mock).mockResolvedValue(mockEligibilityResponse);

    const mockPatientResponse = {
      apiResult: [
        {
          patientID: '12345',
          firstName: 'John',
          lastName: 'Doe',
          patientAddr1: '123 Main St',
          patientCity: 'City',
          patientDOB: '19900101',
          category: 'Commercial',
          patientEffDate: '20230101',
          patientTermDate: '20231231',
          patientZip: '12345',
          patientGender: 'M',
          isRestrictedMember: false,
          patientPhone: '555-123-4567',
          patientName: 'Doe, John',
          oAOSubNo: '12345',
          oAOPerNo: '67890',
          memberCode: 'MC001',
          iPACode: 'IPA001',
          patientGroupNumber: 'GRP001',
          patientGroupDescription: 'Group Description',
          lineOfBusiness: 'LOB001',
          eMAIL: 'john.doe@example.com',
          jurisdictionState: 'CA',
          tIT19: 'TIT19',
          planType: 'PT001',
          patientPUSRDF: 'PUSRDF001',
          extID: 'EXT001',
        }
      ],
      language: 'English',
      erisa: 'ERISA001',
      funding: 'FUND001'
    };
    
    (LookupService.PatientLookupAPI as jest.Mock).mockResolvedValue(mockPatientResponse);

    formik.values = {
      ...formik.values,
      MemberIdSearchterm: '12345',
      MemberFirstNameSearchterm: 'John',
      MemberLastNameSearchterm: 'Doe',
      MemberDOBSearchterm: '1990-01-01'
    };

    render(
      <Provider store={store}>
        <PatientInfo formik={formik} />
      </Provider>
    );

    const searchButton = await screen.findByText('Search Patient');
    fireEvent.click(searchButton);
    
    const rowClickButton = await screen.findByTestId('row-click-button');
    fireEvent.click(rowClickButton);
    

    expect(LookupService.PaitentEligibility).toHaveBeenCalled();

    await waitFor(() => {
      expect(screen.getByTestId('staffing-request-modal')).toBeInTheDocument();
    });
       const NoButton = await screen.findByRole('button',{name:/no/i});
      fireEvent.click(NoButton);

       expect(formik.setFieldValue).toHaveBeenCalledWith('MemberId', '12345');
       expect(formik.setFieldValue).toHaveBeenCalledWith('MemberFirstName', 'Doe, John');
  });
 
   test('shows alert for non-delegated member', async () => {
    const mockEligibilityResponse = {
      apiResult: [
        {
          memberInScope: 'FALSE'
        }
      ]
    };
    
    (LookupService.PaitentEligibility as jest.Mock).mockResolvedValue(mockEligibilityResponse);

    render(
      <Provider store={store}>
        <PatientInfo formik={formik} />
      </Provider>
    );

    const rowClickButton = await screen.findByText('Search Patient');
    fireEvent.click(rowClickButton);

    await waitFor(() => {
      expect(screen.getByTestId('request-custom-alert')).toBeInTheDocument();
    });
  });
  
  test('handles quick create button click', () => {
    render(
      <Provider store={store}>
        <PatientInfo formik={formik} />
      </Provider>
    );

    const quickCreateButton = screen.getByText('Quick Create Member');
    fireEvent.click(quickCreateButton);

    expect(screen.getByTestId('member-quick-create-form')).toBeInTheDocument();
    
    expect(formik.setFieldValue).toHaveBeenCalledWith('MemberId', '');
    expect(formik.setFieldTouched).toHaveBeenCalledWith('MemberId', false, false);
    expect(formik.setFieldValue).toHaveBeenCalledWith('MemberFirstName', '');
    expect(formik.setFieldValue).toHaveBeenCalledWith('MemberLastName', '');
    expect(formik.setFieldValue).toHaveBeenCalledWith('MemberDOB', '');
  });

  test('handles quick create cancel', () => {
    formik.values = {
      ...formik.values,
      MemberIdSearchterm: '',
      MemberFirstNameSearchterm: '',
      MemberLastNameSearchterm: '',
      MemberDOBSearchterm: ''
    };

    render(
      <Provider store={store}>
        <PatientInfo formik={formik} />
      </Provider>
    );

    const quickCreateButton = screen.getByText('Quick Create Member');
    fireEvent.click(quickCreateButton);

    expect(screen.getByTestId('member-quick-create-form')).toBeInTheDocument();

    const cancelButton = screen.getByTestId('quick-create-cancel');
    fireEvent.click(cancelButton);

    expect(screen.queryByTestId('member-quick-create-form')).not.toBeInTheDocument();
  });

  

  test('handles quick create submission', () => {
    render(
      <Provider store={store}>
        <PatientInfo formik={formik} />
      </Provider>
    );

    const quickCreateButton = screen.getByText('Quick Create Member');
    fireEvent.click(quickCreateButton);

    const submitButton = screen.getByTestId('quick-create-submit');
    fireEvent.click(submitButton);

    expect(formik.setFieldValue).toHaveBeenCalledWith('MemberId', 'QC12345');
    expect(formik.setFieldValue).toHaveBeenCalledWith('MemberFirstName', 'Jane');
    expect(formik.setFieldValue).toHaveBeenCalledWith('MemberLastName', 'Smith');
    expect(formik.setFieldValue).toHaveBeenCalledWith('MemberDOB', '02/15/1985');
    expect(formik.setFieldValue).toHaveBeenCalledWith('MemberFullName', 'Smith, Jane');
  });

 
});
