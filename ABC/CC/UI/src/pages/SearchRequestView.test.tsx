import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import * as RequestSearch from '../services/RequestSearch';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import SearchRequestView from './SearchRequestView';

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

const mockStore = configureStore([]);

let store = mockStore({
  request: {
    RequestId: '12345',
  },
  auth: {
    user: {
      email: 'test@example.com',         
      hasLEA: false,
    },
  },
});
jest.clearAllMocks();


jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
}));

jest.mock('../services/RequestSearch', () => ({
  SearchRequestById: jest.fn(),
  SearchRequestByName: jest.fn(),
}));

jest.mock('react-table', () => ({
  useTable: () => ({
    getTableProps: jest.fn().mockReturnValue({}),
    getTableBodyProps: jest.fn().mockReturnValue({}),
    headerGroups: [
      {
        getHeaderGroupProps: jest.fn().mockReturnValue({}),
        headers: [
          { 
            getHeaderProps: jest.fn().mockReturnValue({}),
            render: jest.fn().mockReturnValue('CreateDate')
          },
          { 
            getHeaderProps: jest.fn().mockReturnValue({}),
            render: jest.fn().mockReturnValue('PatientName')
          },
          { 
            getHeaderProps: jest.fn().mockReturnValue({}),
            render: jest.fn().mockReturnValue('PatientDOB')
          },
          { 
            getHeaderProps: jest.fn().mockReturnValue({}),
            render: jest.fn().mockReturnValue('Program')
          },
          { 
            getHeaderProps: jest.fn().mockReturnValue({}),
            render: jest.fn().mockReturnValue('CareCoordinationEpisodeId')
          }
        ]
      }
    ],
    rows: [
      {
        getRowProps: jest.fn().mockReturnValue({}),
        cells: [
          { 
            getCellProps: jest.fn().mockReturnValue({}),
            render: jest.fn().mockReturnValue('2023-01-01')
          },
          { 
            getCellProps: jest.fn().mockReturnValue({}),
            render: jest.fn().mockReturnValue('John Doe')
          },
          { 
            getCellProps: jest.fn().mockReturnValue({}),
            render: jest.fn().mockReturnValue('1980-01-01')
          },
          { 
            getCellProps: jest.fn().mockReturnValue({}),
            render: jest.fn().mockReturnValue('Program A')
          },
          { 
            getCellProps: jest.fn().mockReturnValue({}),
            render: jest.fn().mockReturnValue('12345')
          }
        ],
        values: {
          CareCoordinationEpisodeId: '12345'
        },
        original: {
          IsRestrictedMember: false
        }
      },
      {
        getRowProps: jest.fn().mockReturnValue({}),
        cells: [
          { 
            getCellProps: jest.fn().mockReturnValue({}),
            render: jest.fn().mockReturnValue('2023-02-01')
          },
          { 
            getCellProps: jest.fn().mockReturnValue({}),
            render: jest.fn().mockReturnValue('Jane Smith')
          },
          { 
            getCellProps: jest.fn().mockReturnValue({}),
            render: jest.fn().mockReturnValue('1985-02-02')
          },
          { 
            getCellProps: jest.fn().mockReturnValue({}),
            render: jest.fn().mockReturnValue('Program B')
          },
          { 
            getCellProps: jest.fn().mockReturnValue({}),
            render: jest.fn().mockReturnValue('67890')
          }
        ],
        values: {
          CareCoordinationEpisodeId: '67890'
        },
        original: {
          IsRestrictedMember: true
        }
      }
    ],
    prepareRow: jest.fn(),
  }),
  useFilters: jest.fn(),
  useSortBy: jest.fn(),
}));

describe('SearchRequestView Component', () => {
  const mockNavigate = jest.fn();
  
  beforeEach(() => {  
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    
    
    
    (RequestSearch.SearchRequestById as jest.Mock).mockResolvedValue({
      apiResult: [
        {
          CreateDate: '2023-01-01',
          PatientName: 'John Doe',
          PatientDOB: '1980-01-01',
          Program: 'Program A',
          CareCoordinationEpisodeId: '12345',
          PatientID: 'P12345',
          HealthPlan: 'Blue Cross',
          DateOfService: '2023-01-15',
          CaseStatus: 'Open',
          IsRestrictedMember: false
        }
      ],
      apiError: ''
    });
    
    (RequestSearch.SearchRequestByName as jest.Mock).mockResolvedValue({
      apiResult: [
        {
          CreateDate: '2023-01-01',
          PatientName: 'John Doe',
          PatientDOB: '1980-01-01',
          Program: 'Program A',
          CareCoordinationEpisodeId: '12345',
          PatientID: 'P12345',
          HealthPlan: 'Blue Cross',
          DateOfService: '2023-01-15',
          CaseStatus: 'Open',
          IsRestrictedMember: false
        },
        {
          CreateDate: '2023-02-01',
          PatientName: 'Jane Smith',
          PatientDOB: '1985-02-02',
          Program: 'Program B',
          CareCoordinationEpisodeId: '67890',
          PatientID: 'P67890',
          HealthPlan: 'Aetna',
          DateOfService: '2023-02-15',
          CaseStatus: 'Closed',
          IsRestrictedMember: true
        }
      ],
      apiError: ''
    });
  });

  test('renders SearchRequestView component with search options', () => {
    render(<SearchRequestView />);
    
    expect(screen.getByText('Search By:')).toBeInTheDocument();
    expect(screen.getByText('Search by Id')).toBeInTheDocument();
    expect(screen.getByText('Search by Patient')).toBeInTheDocument();
  });

  test('renders ID search form by default', () => {
    render(<SearchRequestView />);
    
    expect(screen.getByText('ID/Number')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Request ID')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Search' })).toBeInTheDocument();
  });


  test('switches to Name search form when Name search button is clicked', () => {
    render(<SearchRequestView />);
    
    const nameSearchButton = screen.getByText('Search by Patient');
    fireEvent.click(nameSearchButton);
    
    expect(screen.getByText('First Name')).toBeInTheDocument();
    expect(screen.getByText('Last Name')).toBeInTheDocument();
    expect(screen.getByText('Date of birth')).toBeInTheDocument();
  });

  test('switches back to ID search form when ID search button is clicked', () => {
    render(<SearchRequestView />);
    
    const nameSearchButton = screen.getByText('Search by Patient');
    fireEvent.click(nameSearchButton);
    
    const idSearchButton = screen.getByText('Search by Id');
    fireEvent.click(idSearchButton);
    
    expect(screen.getByText('ID/Number')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Request ID')).toBeInTheDocument();
  });

  test('shows validation error when ID search form is submitted with invalid ID', async () => {
    render(<SearchRequestView />);
    
    const idInput = screen.getByPlaceholderText('Request ID');
    fireEvent.change(idInput, { target: { value: '123' } });
    
    const searchButton = screen.getByRole('button', { name: 'Search' });
    fireEvent.click(searchButton);
    
    await waitFor(() => {
      expect(screen.getByText('Minimum 4 character')).toBeInTheDocument();
    });
    
    expect(RequestSearch.SearchRequestById).not.toHaveBeenCalled();
  });

   test('submits ID search form with valid ID', async () => {
    render(<SearchRequestView />);
    
    const idInput = screen.getByPlaceholderText('Request ID');
    fireEvent.change(idInput, { target: { value: '12345' } });
    
    const searchButton = screen.getByRole('button', { name: 'Search' });
    fireEvent.click(searchButton);
    
    await waitFor(() => {
      expect(RequestSearch.SearchRequestById).toHaveBeenCalled();
    });
  });
     test('submits Name search form with valid data', async () => {
    render(<SearchRequestView />);
    
    const nameSearchButton = screen.getByText('Search by Patient');
    fireEvent.click(nameSearchButton);
    
    const firstNameInput = screen.getByLabelText('First Name');
    fireEvent.change(firstNameInput, { target: { value: 'John' } });
    
    const lastNameInput = screen.getByLabelText('Last Name');
    fireEvent.change(lastNameInput, { target: { value: 'Doe' } });
    
    const dobInput = screen.getByLabelText('Date of birth');
    fireEvent.change(dobInput, { target: { value: '1980-01-01' } });
    
    const searchButton = screen.getByRole('button', { name: 'Search' });
    fireEvent.click(searchButton);
    
    await waitFor(() => {
      expect(RequestSearch.SearchRequestByName).toHaveBeenCalled();
    });
  });
  
  test('shows validation error when Name search form is submitted with all empty fields', async () => {
    render(<SearchRequestView />);
    
    const nameSearchButton = screen.getByText('Search by Patient');
    fireEvent.click(nameSearchButton);
    
    const searchButton = screen.getByRole('button', { name: 'Search' });
    fireEvent.click(searchButton);
    
    await waitFor(() => {
      expect(screen.getByText('Please enter at least one field')).toBeInTheDocument();
    });
    
    expect(RequestSearch.SearchRequestByName).not.toHaveBeenCalled();
  });



  test('displays search results after successful ID search', async () => {
    render(<SearchRequestView />);
    
    const idInput = screen.getByPlaceholderText('Request ID');
    fireEvent.change(idInput, { target: { value: '12345' } });
    
    const searchButton = screen.getByRole('button', { name: 'Search' });
    fireEvent.click(searchButton);
    
    await waitFor(() => {
      expect(screen.getByText('Result')).toBeInTheDocument();
    });
    expect(screen.getByText('Select a Patient from the search result Below')).toBeInTheDocument();

    
    expect(screen.getByText('CreateDate')).toBeInTheDocument();
    expect(screen.getByText('PatientName')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  test('displays status filter when search results are available', async () => {
    render(<SearchRequestView />);
    
    const idInput = screen.getByPlaceholderText('Request ID');
    fireEvent.change(idInput, { target: { value: '12345' } });
    
    const searchButton = screen.getByRole('button', { name: 'Search' });
    fireEvent.click(searchButton);
    
    await waitFor(() => {
      expect(screen.getByText('Status')).toBeInTheDocument();
    });
    
  
  });

  test('filters results by status when status filter is changed', async () => {
    (RequestSearch.SearchRequestByName as jest.Mock).mockResolvedValue({
      apiResult: [
        {
          CreateDate: '2023-01-01',
          PatientName: 'John Doe',
          PatientDOB: '1980-01-01',
          Program: 'Program A',
          CareCoordinationEpisodeId: '12345',
          PatientID: 'P12345',
          HealthPlan: 'Blue Cross',
          DateOfService: '2023-01-15',
          CaseStatus: 'Open',
          IsRestrictedMember: false
        },
        {
          CreateDate: '2023-02-01',
          PatientName: 'Jane Smith',
          PatientDOB: '1985-02-02',
          Program: 'Program B',
          CareCoordinationEpisodeId: '67890',
          PatientID: 'P67890',
          HealthPlan: 'Aetna',
          DateOfService: '2023-02-15',
          CaseStatus: 'Closed',
          IsRestrictedMember: true
        }
      ],
      apiError: ''
    });
    
    render(<SearchRequestView />);
    
    const nameSearchButton = screen.getByText('Search by Patient');
    fireEvent.click(nameSearchButton);
    
    const firstNameInput = screen.getByLabelText('First Name');
    fireEvent.change(firstNameInput, { target: { value: 'John' } });
    
    const searchButton = screen.getByRole('button', { name: 'Search' });
    fireEvent.click(searchButton);
    
    await waitFor(() => {
      expect(screen.getByText('Status')).toBeInTheDocument();
    });
    
    const statusSelect = screen.getAllByRole('combobox')[0];
    fireEvent.change(statusSelect, { target: { value: 'Open' } });
    
    expect(statusSelect).toHaveValue('Open');
  });

  test('displays pagination controls when results are available', async () => {
    render(<SearchRequestView />);
    
    const idInput = screen.getByPlaceholderText('Request ID');
    fireEvent.change(idInput, { target: { value: '12345' } });
    
    const searchButton = screen.getByRole('button', { name: 'Search' });
    fireEvent.click(searchButton);
    
    await waitFor(() => {
      expect(screen.getByText('Rows Per Page:')).toBeInTheDocument();
      
    });
    expect(screen.getByText('Previous')).toBeInTheDocument();
    expect(screen.getByText('Next')).toBeInTheDocument();
    
    expect(screen.getByText('Page 1 of 1')).toBeInTheDocument();
  });

  test('changes rows per page when rows per page select is changed', async () => {
    render(<SearchRequestView />);
    
    const idInput = screen.getByPlaceholderText('Request ID');
    fireEvent.change(idInput, { target: { value: '12345' } });
    
    const searchButton = screen.getByRole('button', { name: 'Search' });
    fireEvent.click(searchButton);
    
    await waitFor(() => {
      expect(screen.getByLabelText('Rows Per Page:')).toBeInTheDocument();
    });
    
    const rowsPerPageSelect = screen.getByLabelText('Rows Per Page:');
    fireEvent.change(rowsPerPageSelect, { target: { value: '10' } });
    
    expect(rowsPerPageSelect).toHaveValue('10');
  });

  test('navigates to view request when row is clicked', async () => {
    render(<SearchRequestView />);
    
    const idInput = screen.getByPlaceholderText('Request ID');
    fireEvent.change(idInput, { target: { value: '12345' } });
    
    const searchButton = screen.getByRole('button', { name: 'Search' });
    fireEvent.click(searchButton);
    
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });
    
    const rows = screen.getAllByRole('row');
    fireEvent.click(rows[1]); // First data row (index 1 after header row)
    
    expect(mockNavigate).toHaveBeenCalledWith('/viewrequest', expect.objectContaining({
      state: expect.objectContaining({
        RequestId: '12345'
      })
    }));
  });

    test('resets form when switching between search modes', () => {
    render(<SearchRequestView />);
    
    const idInput = screen.getByPlaceholderText('Request ID');
    fireEvent.change(idInput, { target: { value: '12345' } });
    
    const nameSearchButton = screen.getByText('Search by Patient');
    fireEvent.click(nameSearchButton);
    
    const firstNameInput = screen.getByLabelText('First Name');
    fireEvent.change(firstNameInput, { target: { value: 'John' } });
    
    const idSearchButton = screen.getByText('Search by Id');
    fireEvent.click(idSearchButton);
    
    const newIdInput = screen.getByPlaceholderText('Request ID');
    expect(newIdInput).toHaveValue('12345');
  });

    test('handles restricted member rows for users without LEA access', async () => {
    (useSelector as unknown as jest.Mock).mockImplementation(() => {
      return {
        auth: {
          user: {
            email: 'test@example.com',
            hasLEA: false
          }
        }
      };
    });
    
    render(<SearchRequestView />);
    
    const nameSearchButton = screen.getByText('Search by Patient');
    fireEvent.click(nameSearchButton);
    
    const firstNameInput = screen.getByLabelText('First Name');
    fireEvent.change(firstNameInput, { target: { value: 'Jane' } });
    
    const searchButton = screen.getByRole('button', { name: 'Search' });
    fireEvent.click(searchButton);
    
    await waitFor(() => {
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    });
    
    expect(screen.getAllByText('Restricted')[0]).toBeInTheDocument();
  });


  test('displays "No Record Found" message when search returns no results', async () => {
    (RequestSearch.SearchRequestById as jest.Mock).mockResolvedValue({
      apiResult: [],
      apiError: ''
    });
    
    render(<SearchRequestView />);
    
    const idInput = screen.getByPlaceholderText('Request ID');
    fireEvent.change(idInput, { target: { value: '99999' } });
    
    const searchButton = screen.getByRole('button', { name: 'Search' });
    fireEvent.click(searchButton);
    
    await waitFor(() => {
      expect(screen.getByText('No Record Found')).toBeInTheDocument();
    });
  });

  
  
  test('resets pagination when filter is applied', async () => {
    render(<SearchRequestView />);
    
    const nameSearchButton = screen.getByText('Search by Patient');
    fireEvent.click(nameSearchButton);
    
    const firstNameInput = screen.getByLabelText('First Name');
    fireEvent.change(firstNameInput, { target: { value: 'John' } });
    
    const searchButton = screen.getByRole('button', { name: 'Search' });
    fireEvent.click(searchButton);
    
    await waitFor(() => {
      expect(screen.getByText('Status')).toBeInTheDocument();
    });
    
    const statusSelect = screen.getAllByRole('combobox')[0];
    fireEvent.change(statusSelect, { target: { value: 'Open' } });
    
    expect(screen.getByText('Select a Patient from the search result Below')).toBeInTheDocument();
  });
});
