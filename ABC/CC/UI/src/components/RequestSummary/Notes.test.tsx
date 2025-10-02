import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import Notes from './Notes';
import * as RequestService from '../../services/RequestService';
import { act } from 'react-dom/test-utils';

jest.mock('../../services/RequestService', () => ({
  AddNote: jest.fn(),
}));

const mockStore = configureStore([]);
const initialState = {
    request: {
        Notes: [
            {
                Id: 1,
                Notes: 'Existing note',
                CreatedDate: '2025-01-01 10:00:00',
                CareCoordinationEpisodeId: '12345',
                CareCoordinationEpisodeDate: '',
                CreatedBy: 'User1',
            },
        ],
        RequestId: '12345',
        RequestInformation: {
            Status: 'Open'
        },
        AssignToId: 'test@example.com'
    },
    auth: {
        user: {
            email: 'test@example.com',
            roles: ['CCCordSup']
        }
    }
};

beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation((message) => {
        if (message.includes('ReactDOMTestUtils.act')) {
            return;
        }
        console.error(message);
    });
});

// afterAll(() => {
//     console.error.mockRestore();
// });

describe('Notes', () => {
    let store;

    beforeEach(() => {
        store = mockStore(initialState);
        jest.clearAllMocks();
    });

    test('renders Notes component with existing notes', () => {
        render(
            <Provider store={store}>
                <Notes />
            </Provider>
        );

        expect(screen.getByText('Notes')).toBeInTheDocument();
        expect(screen.getByText('Existing note')).toBeInTheDocument();
        expect(screen.getByText('2025-01-01 10:00:00')).toBeInTheDocument();
        expect(screen.getByText('Add Note')).toBeInTheDocument();
    });

    test('displays add note form when Add Note button is clicked', () => {
        render(
            <Provider store={store}>
                <Notes />
            </Provider>
        );

        fireEvent.click(screen.getByText('Add Note'));
        
        expect(screen.getByLabelText('Note')).toBeInTheDocument();
        expect(screen.getByText('Save')).toBeInTheDocument();
    });

    test('validates required fields when submitting empty form', async () => {
        render(
            <Provider store={store}>
                <Notes />
            </Provider>
        );

        fireEvent.click(screen.getByText('Add Note'));
        fireEvent.click(screen.getByText('Save'));
        
        await waitFor(() => {
            expect(screen.getByText('Note is required')).toBeInTheDocument();
        });
    });

    test('cancels adding note when Cancel button is clicked', () => {
        render(
            <Provider store={store}>
                <Notes />
            </Provider>
        );

        fireEvent.click(screen.getByText('Add Note'));
        expect(screen.getByLabelText('Note')).toBeInTheDocument();
        
        fireEvent.click(screen.getByText('Cancel'));
        expect(screen.queryByLabelText('Note')).not.toBeInTheDocument();
    });

    test('handles API error when adding note', async () => {
        (RequestService.AddNote as jest.Mock).mockRejectedValue(
            new Error('API error occurred')
        );
        
        render(
            <Provider store={store}>
                <Notes />
            </Provider>
        );

        fireEvent.click(screen.getByText('Add Note'));
        
        fireEvent.change(screen.getByLabelText('Note'), { 
            target: { value: 'Test note with error' } 
        });
        
            fireEvent.click(screen.getByText('Save'));
        
        
        await waitFor(() => {
            expect(screen.getByText('API error occurred')).toBeInTheDocument();
        });
    });

    test('does not show Add Note button when request is closed and user is not owner', () => {
        const closedRequestStore = mockStore({
            ...initialState,
            request: {
                ...initialState.request,
                RequestInformation: {
                    Status: 'Closed'
                },
                AssignToId: 'other@example.com'
            },
            auth: {
                user: {
                    email: 'test@example.com',
                    roles: []
                }
            }
        });
        
        render(
            <Provider store={closedRequestStore}>
                <Notes />
            </Provider>
        );
        
        expect(screen.queryByText('Add Note')).not.toBeInTheDocument();
    });

    test('shows Add Note button when user is supervisor even if request is Open', () => {
        const openRequestStore = mockStore({
            ...initialState,
            request: {
                ...initialState.request,
                RequestInformation: {
                    Status: 'Open'
                },
                AssignToId: 'other@example.com'
            }
        });
        
        render(
            <Provider store={openRequestStore}>
                <Notes />
            </Provider>
        );
        
        expect(screen.getByText('Add Note')).toBeInTheDocument();
    });
});
