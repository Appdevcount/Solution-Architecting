import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import ServicingProvider from './ServicingProvider';
import * as RequestService from '../../services/RequestService';
import * as LookupService from '../../services/LookupService';

jest.mock('../../services/RequestService', () => ({
  UpdateCCSite: jest.fn(),
}));

jest.mock('../../services/LookupService', () => ({
  SiteLookup: jest.fn(),
  getSiteType: jest.fn(),
}));

jest.mock('./QuickCreateProvider', () => {
  return function DummyQuickCreateProvider({ setShowQuickCreate, RequestId, setSavedRecord, handleCancel, setAlert }) {
    return (
      <div data-testid="quick-create-provider">
        <button onClick={() => setShowQuickCreate(false)}>Cancel Quick Create</button>
        <button onClick={() => {
          setSavedRecord({ SiteName: 'New Provider', NPI: '1234567890' });
          handleCancel();
          setAlert({ show: true, message: 'Provider created successfully', variant: 'success' });
        }}>
          Save Provider
        </button>
      </div>
    );
  };
});

const mockStore = configureStore([]);

describe('ServicingProvider Component', () => {
  let store;
  
  const mockSiteSearchResponse = {
    searchResults: [
      {
        prvno: '12345',
        pname: 'Test Provider',
        npi: '1234567890',
        aprno: '987654321',
        pphon: '123-456-7890',
        geoZip: '10 miles',
        pcity: 'Test City',
        pazip: '12345',
        pstat: 'NY',
        pfax: '123-456-7891'
      },
      {
        prvno: '67890',
        pname: 'Another Provider',
        npi: '0987654321',
        aprno: '123456789',
        pphon: '098-765-4321',
        geoZip: '5 miles',
        pcity: 'Another City',
        pazip: '67890',
        pstat: 'CA',
        pfax: '098-765-4322'
      }
    ]
  };
  
  beforeEach(() => {
    store = mockStore({
      request: {
        RequestId: '12345',
        RequestInformation: {
          Status: 'Open'
        },
        AssignToId: 'test@example.com',
        CCSite: null
      },
      auth: {
        user: {
          email: 'test@example.com',
          roles: ['CCCordSup']
        }
      }
    });
    
    jest.clearAllMocks();
    
    (LookupService.SiteLookup as jest.Mock).mockResolvedValue(mockSiteSearchResponse);
    (RequestService.UpdateCCSite as jest.Mock).mockResolvedValue({
      SiteName: 'Test Provider',
      NPI: '1234567890',
      SiteAddr1: '123 Test St',
      SiteCity: 'Test City',
      SiteZip: '12345',
      SiteState: 'NY',
      SiteType: 'PAR-INN'
    });
  });

  test('renders ServicingProvider component with correct title', () => {
    render(
      <Provider store={store}>
        <ServicingProvider />
      </Provider>
    );

    expect(screen.getByText('Servicing Provider')).toBeInTheDocument();
    expect(screen.getByText('Add')).toBeInTheDocument();
  });

  test('switches to edit mode when Add button is clicked', async () => {
    render(
      <Provider store={store}>
        <ServicingProvider />
      </Provider>
    );

      fireEvent.click(screen.getByText('Add'));
    
    expect(screen.getByText('Provider Zip')).toBeInTheDocument();
    expect(screen.getByText('Provider NPI')).toBeInTheDocument();
    expect(screen.getByText('Provider TIN')).toBeInTheDocument();
    expect(screen.getByText('Provider Name')).toBeInTheDocument();
    expect(screen.getByText('Provider OAOID')).toBeInTheDocument();
    expect(screen.getByText('Provider City')).toBeInTheDocument();
    expect(screen.getByText('Search')).toBeInTheDocument();
    expect(screen.getByText('Quick Create Provider')).toBeInTheDocument();
  });

  test('returns to view mode when Cancel button is clicked', async () => {
    render(
      <Provider store={store}>
        <ServicingProvider />
      </Provider>
    );

      fireEvent.click(screen.getByText('Add'));   
      expect(screen.getByText('Provider Zip')).toBeInTheDocument();
    
      fireEvent.click(screen.getByText('Cancel'));  
    expect(screen.queryByText('Provider Zip')).not.toBeInTheDocument();
    expect(screen.getByText('Add')).toBeInTheDocument();
  });

  test('validates the form when searching without any valid criteria', async () => {
    render(
      <Provider store={store}>
        <ServicingProvider />
      </Provider>
    );

      fireEvent.click(screen.getByText('Add'));  
      fireEvent.click(screen.getByText('Search'));   
    await waitFor(() => {
      expect(screen.getByText('Please enter any Provider details for searching')).toBeInTheDocument();
    });
  });

  test('searches for providers successfully', async () => {
    render(
      <Provider store={store}>
        <ServicingProvider />
      </Provider>
    );

    fireEvent.click(screen.getByText('Add'));
    
    fireEvent.change(screen.getByLabelText('Provider Name'), { target: { value: 'Test Provider' } });
    
    fireEvent.click(screen.getByText('Search'));
    
    
    expect(LookupService.SiteLookup).toHaveBeenCalledWith({
      ProviderZip: '',
      ProviderNPI: '',
      ProviderTIN: '',
      ProviderName: 'Test Provider',
      ProviderCity: '',
      ProviderOAOID: '',
      ProviderEligibilityType: 'INN',
      RequestId: '12345'
    });
    
    await waitFor(() => {
      expect(screen.getByText('Site Name')).toBeInTheDocument();
      
    });
      expect(screen.getAllByText('Test Provider')[0]).toBeInTheDocument();
      expect(screen.getAllByText('Another Provider')[0]).toBeInTheDocument();
      expect(screen.getAllByText('Save Provider').length).toBeGreaterThan(0);
  });


  test('handles API error during provider search', async () => {
    (LookupService.SiteLookup as jest.Mock).mockRejectedValue(
      new Error('API error occurred')
    );

    render(
      <Provider store={store}>
        <ServicingProvider />
      </Provider>
    );

    fireEvent.click(screen.getByText('Add'));
    
    fireEvent.change(screen.getByLabelText('Provider Name'), { target: { value: 'Test Provider' } });
    
    fireEvent.click(screen.getByText('Search'));
        
    await waitFor(() => {
      expect(screen.getByText('API error occurred')).toBeInTheDocument();
    });
  });

  test('handles empty search results', async () => {
    (LookupService.SiteLookup as jest.Mock).mockResolvedValue({
      searchResults: []
    });

    render(
      <Provider store={store}>
        <ServicingProvider />
      </Provider>
    );

    fireEvent.click(screen.getByText('Add'));
    
    fireEvent.change(screen.getByLabelText('Provider Name'), { target: { value: 'Non-existent Provider' } });
    
    fireEvent.click(screen.getByText('Search'));
    
    await waitFor(() => {
      expect(screen.getByText('No results found')).toBeInTheDocument();
    });
  });

  test('selects and saves a provider', async () => {
    render(
      <Provider store={store}>
        <ServicingProvider />
      </Provider>
    );

    fireEvent.click(screen.getByText('Add'));
    
    fireEvent.change(screen.getByLabelText('Provider Name'), { target: { value: 'Test Provider' } });
    
    fireEvent.click(screen.getByText('Search'));
    
    
    await waitFor(() => {
      expect(screen.getAllByText('Save Provider').length).toBeGreaterThan(0);
    });
    
    const saveButtons = screen.getAllByText('Save Provider');
    fireEvent.click(saveButtons[0]);
    
    
    expect(RequestService.UpdateCCSite).toHaveBeenCalled();
   
    await waitFor(() => {
      expect(screen.getByText('Facility Name:')).toBeInTheDocument();
     
    });
    expect(screen.getByText('Test Provider')).toBeInTheDocument();
    expect(screen.getByText('NPI:')).toBeInTheDocument();
    expect(screen.getByText('1234567890')).toBeInTheDocument();
  });

  test('handles API error when saving a provider', async () => {
    (RequestService.UpdateCCSite as jest.Mock).mockRejectedValue(
      new Error('API error occurred during save')
    );

    render(
      <Provider store={store}>
        <ServicingProvider />
      </Provider>
    );

    fireEvent.click(screen.getByText('Add'));
    
    fireEvent.change(screen.getByLabelText('Provider Name'), { target: { value: 'Test Provider' } });
    
    fireEvent.click(screen.getByText('Search'));
    
    
    await waitFor(() => {
      expect(screen.getAllByText('Save Provider').length).toBeGreaterThan(0);
    });
    
    const saveButtons = screen.getAllByText('Save Provider');
    fireEvent.click(saveButtons[0]);
    
    
    await waitFor(() => {
      expect(screen.getByText('API error occurred during save')).toBeInTheDocument();
    });
  });

  test('shows quick create provider form when button is clicked', async () => {
    render(
      <Provider store={store}>
        <ServicingProvider />
      </Provider>
    );

    fireEvent.click(screen.getByText('Add'));
    
    fireEvent.click(screen.getByText('Quick Create Provider'));
    
    expect(screen.getByTestId('quick-create-provider')).toBeInTheDocument();
    expect(screen.getByText('Cancel Quick Create')).toBeInTheDocument();
    expect(screen.getByText('Save Provider')).toBeInTheDocument();
  });

  test('creates a provider using quick create form', async () => {
    render(
      <Provider store={store}>
        <ServicingProvider />
      </Provider>
    );

    fireEvent.click(screen.getByText('Add'));
    
    fireEvent.click(screen.getByText('Quick Create Provider'));
    
    fireEvent.click(screen.getByText('Save Provider'));
    
    
    await waitFor(() => {
      expect(screen.getByText('Provider created successfully')).toBeInTheDocument();
    });
    
    await waitFor(() => {
      expect(screen.getByText('Facility Name:')).toBeInTheDocument();
     
    });
    expect(screen.getByText('New Provider')).toBeInTheDocument();
    expect(screen.getByText('NPI:')).toBeInTheDocument();
    expect(screen.getByText('1234567890')).toBeInTheDocument();
  });

  test('displays Edit button when provider exists', async () => {
    const storeWithProvider = mockStore({
      request: {
        RequestId: '12345',
        RequestInformation: {
          Status: 'Open'
        },
        AssignToId: 'test@example.com',
        CCSite: {
          SiteName: 'Existing Provider',
          NPI: '9876543210',
          SiteAddr1: '456 Existing St',
          SiteCity: 'Existing City',
          SiteZip: '54321',
          SiteState: 'CA',
          SiteType: 'PAR-INN'
        }
      },
      auth: {
        user: {
          email: 'test@example.com',
          roles: ['CCCordSup']
        }
      }
    });
    
    render(
      <Provider store={storeWithProvider}>
        <ServicingProvider />
      </Provider>
    );

    expect(screen.getByText('Edit')).toBeInTheDocument();
    
    expect(screen.getByText('Facility Name:')).toBeInTheDocument();
    expect(screen.getByText('Existing Provider')).toBeInTheDocument();
    expect(screen.getByText('NPI:')).toBeInTheDocument();
    expect(screen.getByText('9876543210')).toBeInTheDocument();
  });

  test('hides action button when request is closed and user is not supervisor', () => {
    const storeWithClosedRequest = mockStore({
      request: {
        RequestId: '12345',
        RequestInformation: {
          Status: 'Closed'
        },
        AssignToId: 'other@example.com',
        CCSite: {
          SiteName: 'Existing Provider',
          NPI: '9876543210'
        }
      },
      auth: {
        user: {
          email: 'test@example.com',
          roles: []
        }
      }
    });
    
    render(
      <Provider store={storeWithClosedRequest}>
        <ServicingProvider />
      </Provider>
    );

    expect(screen.queryByText('Edit')).not.toBeInTheDocument();
  });
});
