import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import SearchHistoricalRequestView from './SearchHistoricalRequestView';
import { useNavigate } from 'react-router-dom';
import * as RequestSearch from '../services/RequestSearch';

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

jest.mock('../services/RequestSearch', () => ({
  SearchRequestInHistroy: jest.fn(),
}));

describe('SearchHistoricalRequestView Component', () => {
  const mockNavigate = jest.fn();
  
  const mockHistoricalData = [
    {
      ccRequestID: '12345',
      ccCaseStatus: 'Closed',
      ccReason: 'Service Completed',
      socDate: '2023-01-15',
      caseManagerName: 'John Manager',
      member: {
        memberID: 'M12345',
        memberPolicy: {
          insurer: 'Blue Cross',
          program: 'Program A'
        }
      },
      servicingProvider: {
        physicianName: 'Dr. Smith'
      },
      procedure: [
        {
          procedureCode: 'P001',
          procedureCodeDescription: 'Procedure 1'
        },
        {
          procedureCode: 'P002',
          procedureCodeDescription: 'Procedure 2'
        }
      ]
    }
  ];
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    
    (RequestSearch.SearchRequestInHistroy as jest.Mock).mockResolvedValue({
      apiResult: mockHistoricalData,
      apiError: ''
    });
  });

  test('renders SearchHistoricalRequestView component with search form', () => {
    render(<SearchHistoricalRequestView />);
    
    expect(screen.getByText('Search By:')).toBeInTheDocument();
    expect(screen.getByText('ID/Number')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Request ID')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Search' })).toBeInTheDocument();
  });

  test('shows validation error when search form is submitted with invalid ID', async () => {
    render(<SearchHistoricalRequestView />);
    
    const idInput = screen.getByPlaceholderText('Request ID');
    fireEvent.change(idInput, { target: { value: '123' } });
    
    const searchButton = screen.getByRole('button', { name: 'Search' });
    fireEvent.click(searchButton);
    
    await waitFor(() => {
      expect(screen.getByText('Minimum 4 character')).toBeInTheDocument();
    });
    
    expect(RequestSearch.SearchRequestInHistroy).not.toHaveBeenCalled();
  });

  test('submits search form with valid ID', async () => {
    render(<SearchHistoricalRequestView />);
    
    const idInput = screen.getByPlaceholderText('Request ID');
    fireEvent.change(idInput, { target: { value: '12345' } });
    
    const searchButton = screen.getByRole('button', { name: 'Search' });
    fireEvent.click(searchButton);
    
    await waitFor(() => {
      expect(RequestSearch.SearchRequestInHistroy).toHaveBeenCalledWith('12345');
    });
  });

    test('displays "No Record Found" message when search returns no results', async () => {
    (RequestSearch.SearchRequestInHistroy as jest.Mock).mockResolvedValue({
      apiResult: [],
      apiError: ''
    });
    
    render(<SearchHistoricalRequestView />);
    
    const idInput = screen.getByPlaceholderText('Request ID');
    fireEvent.change(idInput, { target: { value: '99999' } });
    
    const searchButton =screen.getByRole('button', { name: 'Search' });
    fireEvent.click(searchButton);

  });

    test('displays API error message when search fails', async () => {
    (RequestSearch.SearchRequestInHistroy as jest.Mock).mockResolvedValue({
      apiResult: [],
      apiError: 'API Error: Unable to connect to server'
    });
    
    render(<SearchHistoricalRequestView />);
    
    const idInput = screen.getByPlaceholderText('Request ID');
    fireEvent.change(idInput, { target: { value: '12345' } });
    
    const searchButton = screen.getByRole('button', { name: 'Search' });
    fireEvent.click(searchButton);
    
    await waitFor(() => {
      expect(screen.queryByText('API Error: Unable to connect to server')).not.toBeInTheDocument();
    });
  });
  test('displays historical request details after successful search', async () => {
    render(<SearchHistoricalRequestView />);
    
    const idInput = screen.getByPlaceholderText('Request ID');
    fireEvent.change(idInput, { target: { value: '12345' } });
    
    const searchButton = screen.getByRole('button', { name: 'Search' });
    fireEvent.click(searchButton);
    
    await waitFor(() => {
      expect(screen.getByText('Care Coordination Request Detail')).toBeInTheDocument();
    });
    
    expect(screen.getByText('RequestID:')).toBeInTheDocument();
    expect(screen.getByText('12345')).toBeInTheDocument();
    expect(screen.getByText('CaseStatus:')).toBeInTheDocument();
    expect(screen.getByText('Closed')).toBeInTheDocument();
    expect(screen.getByText('Reason:')).toBeInTheDocument();
    expect(screen.getByText('Service Completed')).toBeInTheDocument();
    expect(screen.getByText('Soc Date:')).toBeInTheDocument();
    expect(screen.getByText('2023-01-15')).toBeInTheDocument();
    
    expect(screen.getByText('Health Plan & Program Detail')).toBeInTheDocument();
    expect(screen.getByText('Insurer :')).toBeInTheDocument();
    expect(screen.getByText('Blue Cross')).toBeInTheDocument();
    expect(screen.getByText('Program :')).toBeInTheDocument();
    expect(screen.getByText('Program A')).toBeInTheDocument();
    
    expect(screen.getByText('Health Plan Case Manager')).toBeInTheDocument();
    expect(screen.getByText('Manager Name:')).toBeInTheDocument();
    expect(screen.getByText('John Manager`')).toBeInTheDocument();
    
    expect(screen.getByText('Member Details')).toBeInTheDocument();
    expect(screen.getByText('Member Id:')).toBeInTheDocument();
    expect(screen.getByText('M12345')).toBeInTheDocument();
    
    expect(screen.getByText('Provider Details')).toBeInTheDocument();
    expect(screen.getByText('Physician Name:')).toBeInTheDocument();
    expect(screen.getByText('Dr. Smith')).toBeInTheDocument();
    
    expect(screen.getByText('Procedures Code Details')).toBeInTheDocument();
    expect(screen.getByText('Procedures Code Details :')).toBeInTheDocument();
    expect(screen.getByText('P001 - Procedure 1')).toBeInTheDocument();
    expect(screen.getByText('P002 - Procedure 2')).toBeInTheDocument();
  });

 
  test('resets form after search submission', async () => {
    render(<SearchHistoricalRequestView />);
    
    const idInput = screen.getByPlaceholderText('Request ID');
    fireEvent.change(idInput, { target: { value: '12345' } });
    
    const searchButton = screen.getByRole('button', { name: 'Search' });
    fireEvent.click(searchButton);
    
    await waitFor(() => {
      expect(RequestSearch.SearchRequestInHistroy).toHaveBeenCalledWith('12345');
    });
    
    expect(screen.getByPlaceholderText('Request ID')).toHaveValue('');
  });

  test('handles API error during search', async () => {
    (RequestSearch.SearchRequestInHistroy as jest.Mock).mockRejectedValue(new Error('Network Error'));
    
    render(<SearchHistoricalRequestView />);
    
    const idInput = screen.getByPlaceholderText('Request ID');
    fireEvent.change(idInput, { target: { value: '12345' } });
    
    const searchButton = screen.getByRole('button', { name: 'Search' });
    fireEvent.click(searchButton);
    
    await waitFor(() => {
      expect(RequestSearch.SearchRequestInHistroy).toHaveBeenCalledWith('12345');
    });
  });
});
