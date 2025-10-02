import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import ProcedureCode from './ProcedureCode';
import * as ProcedureCodeService from '../../services/ProcedureCodeSevice';

jest.mock('../../services/ProcedureCodeSevice', () => ({
  GetProcedureCode: jest.fn(),
  AddProcedureCode: jest.fn(),
  RemoveProcedureCode: jest.fn()
}));

const mockStore = configureStore([]);

describe('ProcedureCode Component', () => {
  let store;
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    store = mockStore({
      request: {
        RequestId: 'test-request-id',
        HealthPlan: 'test-health-plan',
        CompanyId: 'test-company-id',
        ProcedureCode: [],
        RequestInformation: {
          Status: 'Open'
        },
        CareCoordinationInformation: {
          ServiceType: 'Home Health'
        },
        AssignToId: 'test-user@example.com'
      },
      auth: {
        user: {
          email: 'test-user@example.com',
          roles: ['CCCordSup']
        }
      }
    });
  });

  test('renders procedure code component', () => {
    render(
      <Provider store={store}>
        <ProcedureCode />
      </Provider>
    );
    
    expect(screen.getByText('Procedure Code')).toBeInTheDocument();
    expect(screen.getByText('Edit')).toBeInTheDocument();
  });

  test('displays procedure codes when available', () => {
    const procedureCodes = [
      { procedureCode: 'PC001', procedureDesc: 'Procedure 1' },
      { procedureCode: 'PC002', procedureDesc: 'Procedure 2' }
    ];
    
    store = mockStore({
      ...store.getState(),
      request: {
        ...store.getState().request,
        ProcedureCode: procedureCodes
      }
    });
    
    render(
      <Provider store={store}>
        <ProcedureCode />
      </Provider>
    );
    
    expect(screen.getByText('PC001')).toBeInTheDocument();
    expect(screen.getByText('Procedure 1')).toBeInTheDocument();
    expect(screen.getByText('PC002')).toBeInTheDocument();
    expect(screen.getByText('Procedure 2')).toBeInTheDocument();
  });

  test('shows edit form when edit button is clicked', async () => {
    render(
      <Provider store={store}>
        <ProcedureCode />
      </Provider>
    );
    
      fireEvent.click(screen.getByText('Edit'));
    
    
    expect(screen.getByText('Search Procedure')).toBeInTheDocument();
    expect(screen.getByText('Search')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  test('shows validation error when searching with empty query', async () => {
    render(
      <Provider store={store}>
        <ProcedureCode />
      </Provider>
    );
    
      fireEvent.click(screen.getByText('Edit'));    
      fireEvent.click(screen.getByText('Search'));
    
    
    await waitFor(() => {
      expect(screen.getByText('Procedure Code or Description is required')).toBeInTheDocument();
    });
  });

  test('searches for procedure codes', async () => {
    const mockSearchResults = {
      apiError: '',
      apiResult: {
        procedureCodeDetails: [
          { procedureCode: 'PC003', procedureDesc: 'Procedure 3' }
        ]
      }
    };
    
    (ProcedureCodeService.GetProcedureCode as jest.Mock).mockResolvedValue(mockSearchResults);
    
    render(
      <Provider store={store}>
        <ProcedureCode />
      </Provider>
    );
    
      fireEvent.click(screen.getByText('Edit'));
    
    
    const searchInput = screen.getByLabelText('Search Procedure');
    
      fireEvent.change(searchInput, { target: { value: 'test search' } });        
      fireEvent.click(screen.getByText('Search'));   
    await waitFor(() => {
      expect(ProcedureCodeService.GetProcedureCode).toHaveBeenCalledWith(
        'test-health-plan',
        'test-company-id',
        'test search'
      );
    });
    
    expect(screen.getByText('PC003')).toBeInTheDocument();
    expect(screen.getByText('Procedure 3')).toBeInTheDocument();
    expect(screen.getByText('Save')).toBeInTheDocument();
  });

  test('handles search with no results', async () => {
    const mockSearchResults = {
      apiError: '',
      apiResult: {
        procedureCodeDetails: []
      }
    };
    
    (ProcedureCodeService.GetProcedureCode as jest.Mock).mockResolvedValue(mockSearchResults);
    
    render(
      <Provider store={store}>
        <ProcedureCode />
      </Provider>
    );
    
      fireEvent.click(screen.getByText('Edit'));   
      const searchInput = screen.getByLabelText('Search Procedure');  
      fireEvent.change(searchInput, { target: { value: 'no results' } });   
      fireEvent.click(screen.getByText('Search'));  
    await waitFor(() => {
      expect(screen.getByText('No Record Found')).toBeInTheDocument();
    });
  });

  test('handles search error', async () => {
    const mockSearchResults = {
      apiError: 'Error searching for procedure codes',
      apiResult: null
    };
    
    (ProcedureCodeService.GetProcedureCode as jest.Mock).mockResolvedValue(mockSearchResults);
    
    render(
      <Provider store={store}>
        <ProcedureCode />
      </Provider>
    );
    
      fireEvent.click(screen.getByText('Edit'));  
      const searchInput = screen.getByLabelText('Search Procedure');   
      fireEvent.change(searchInput, { target: { value: 'error search' } });  
      fireEvent.click(screen.getByText('Search'));   
    await waitFor(() => {
      expect(screen.getByText('Error searching for procedure codes')).toBeInTheDocument();
    });
  });

  test('adds a procedure code', async () => {
    const mockSearchResults = {
      apiError: '',
      apiResult: {
        procedureCodeDetails: [
          { procedureCode: 'PC003', procedureDesc: 'Procedure 3' }
        ]
      }
    };
    
    const mockAddResponse = {
      apiError: '',
      apiResult: null
    };
    
    (ProcedureCodeService.GetProcedureCode as jest.Mock).mockResolvedValue(mockSearchResults);
    (ProcedureCodeService.AddProcedureCode as jest.Mock).mockResolvedValue(mockAddResponse);
    
    render(
      <Provider store={store}>
        <ProcedureCode />
      </Provider>
    );
    
      fireEvent.click(screen.getByText('Edit'));
      const searchInput = screen.getByLabelText('Search Procedure');   
      fireEvent.change(searchInput, { target: { value: 'test search' } }); 
      fireEvent.click(screen.getByText('Search'));
    
    
    await waitFor(() => {
      expect(screen.getByText('PC003')).toBeInTheDocument();
    });
    
      fireEvent.click(screen.getByText('Save'));   
    await waitFor(() => {
      expect(ProcedureCodeService.AddProcedureCode).toHaveBeenCalledWith(
        'test-request-id',
        'PC003',
        'Procedure 3'
      );
    });

  });

  test('removes a procedure code', async () => {
    const procedureCodes = [
      { procedureCode: 'PC001', procedureDesc: 'Procedure 1' }
    ];
    
    store = mockStore({
      ...store.getState(),
      request: {
        ...store.getState().request,
        ProcedureCode: procedureCodes
      }
    });
    
    const mockRemoveResponse = {
      apiError: '',
      apiResult: null
    };
    
    (ProcedureCodeService.RemoveProcedureCode as jest.Mock).mockResolvedValue(mockRemoveResponse);
    
    render(
      <Provider store={store}>
        <ProcedureCode />
      </Provider>
    );
    
      fireEvent.click(screen.getByText('Edit'));  
      fireEvent.click(screen.getByText('Remove'));
   
    await waitFor(() => {
      expect(ProcedureCodeService.RemoveProcedureCode).toHaveBeenCalledWith(
        'test-request-id',
        'PC001',
        'Procedure 1'
      );
    });

  });

  test('handles pagination', async () => {
    const mockSearchResults = {
      apiError: '',
      apiResult: {
        procedureCodeDetails: Array.from({ length: 10 }, (_, i) => ({
          procedureCode: `PC00${i + 1}`,
          procedureDesc: `Procedure ${i + 1}`
        }))
      }
    };
    
    (ProcedureCodeService.GetProcedureCode as jest.Mock).mockResolvedValue(mockSearchResults);
    
    render(
      <Provider store={store}>
        <ProcedureCode />
      </Provider>
    );
    
      fireEvent.click(screen.getByText('Edit'));   
      const searchInput = screen.getByLabelText('Search Procedure');   
      fireEvent.change(searchInput, { target: { value: 'test search' } });   
      fireEvent.click(screen.getByText('Search'));
    
    
    await waitFor(() => {
      expect(screen.getByText('Page 1 of 2')).toBeInTheDocument();
    });
    
      fireEvent.click(screen.getByText('Next'));
    
    await waitFor(() => {
      expect(screen.getByText('Page 2 of 2')).toBeInTheDocument();
    });
    
      fireEvent.click(screen.getByText('Previous'));
    
    
    await waitFor(() => {
      expect(screen.getByText('Page 1 of 2')).toBeInTheDocument();
    });
    
    const rowsPerPageSelect = screen.getByLabelText('Rows Per Page:');
    
      fireEvent.change(rowsPerPageSelect, { target: { value: '10' } });
    
    await waitFor(() => {
      expect(screen.getByText('Page 1 of 1')).toBeInTheDocument();
    });
  });

  test('handles cancel button click', async () => {
    render(
      <Provider store={store}>
        <ProcedureCode />
      </Provider>
    );
    
    fireEvent.click(screen.getByText('Edit'));
      
    expect(screen.getByText('Search Procedure')).toBeInTheDocument();
    
    fireEvent.click(screen.getByText('Cancel'));
    
    expect(screen.queryByText('Search Procedure')).not.toBeInTheDocument();
  });

  test('shows Private Duty Nurse checkbox for Home Health service type', async () => {
    store = mockStore({
        ...store.getState(),
        request: {
          ...store.getState().request,
          CareCoordinationInformation: {
            ServiceType: 'Home Health'
          }
        }
      });
    render(
      <Provider store={store}>
        <ProcedureCode />
      </Provider>
    );
    
    fireEvent.click(screen.getByText('Edit'));  
    expect(screen.getByText('Private Duty Nurse')).toBeInTheDocument();  
   
  });

  test('shows Custom Need checkbox for DME service type', async () => {
    store = mockStore({
      ...store.getState(),
      request: {
        ...store.getState().request,
        CareCoordinationInformation: {
          ServiceType: 'Durable Medical Equipment(DME)'
        }
      }
    });
    
    render(
      <Provider store={store}>
        <ProcedureCode />
      </Provider>
    );
    
    fireEvent.click(screen.getByText('Edit'));
    
    
    expect(screen.getByText('Custom Need')).toBeInTheDocument();
  });
});
