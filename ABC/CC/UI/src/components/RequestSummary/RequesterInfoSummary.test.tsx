
import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import RequesterInfoSummary from './RequesterInfoSummary';

const mockStore = configureStore([]);
const initialState = {
    request: {
        RequesterInformation: {
            Name: 'John Doe',
            PhoneNumber: '123-456-7890',
            Email: 'john.doe@example.com',
            Facility: 'General Hospital',
        },
    },
};
beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation((message) => {
        if (message.includes('ReactDOMTestUtils.act')) {
            return;
        }
        console.error(message);
    });
});
describe('RequesterInfoSummary', () => {
    let store;

    beforeEach(() => {
        store = mockStore(initialState);
    });

    test('renders RequesterInfoSummary component with requester information', () => {
        render(
            <Provider store={store}>
                <RequesterInfoSummary />
            </Provider>
        );

        expect(screen.getByText('Requester Information Summary')).toBeInTheDocument();
        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.getByText('123-456-7890')).toBeInTheDocument();
        expect(screen.getByText('john.doe@example.com')).toBeInTheDocument();
        expect(screen.getByText('General Hospital')).toBeInTheDocument();
    });

    test('does not render table when RequesterInformation is null', () => {
        const emptyState = {
            request: {},
        };
        store = mockStore(emptyState);

        render(
            <Provider store={store}>
                <RequesterInfoSummary />
            </Provider>
        );

        expect(screen.getByText('Requester Information Summary')).toBeInTheDocument();
        expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
    });
});