
import {act} from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import MemberInfo from './MemberInformation';

const mockStore = configureStore([]);
const initialState = {
    request: {
        MemberInformation: {
            Address: 'North, Manchester, CT 06040',
            PhoneNumber: '--',
            PrimaryLanguage: 'EN',
            PrimaryCarePhysician: '--',
            MemberId: 'U9308027801',
            InsuranceCategory: 'Commercial',
            MemberPlanType: 'BEN',
            TPA: '--',
            GroupId: '1011044',
            GroupName: 'LEA NOV-10 ACCOUNT 8- 1011044',
            LOBCode: '--',
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
describe('MemberInfo', () => {
    let store;

    beforeEach(() => {
        store = mockStore(initialState);
    });

    test('renders MemberInfo component with member information', () =>  {
        render(
            <Provider store={store}>
                <MemberInfo />
            </Provider>
        );

        expect(screen.getByText('Member Information')).toBeInTheDocument();
        expect(screen.getByText('North, Manchester, CT 06040')).toBeInTheDocument();
        // expect(screen.getByText('--')).toBeInTheDocument();
        expect(screen.getByText('EN')).toBeInTheDocument();
        expect(screen.getByText('U9308027801')).toBeInTheDocument();
        expect(screen.getByText('Commercial')).toBeInTheDocument();
        expect(screen.getByText('BEN')).toBeInTheDocument();
        expect(screen.getByText('1011044')).toBeInTheDocument();
        expect(screen.getByText('LEA NOV-10 ACCOUNT 8- 1011044')).toBeInTheDocument();
    });

    test('does not render table when MemberInformation is null', () => {
        const emptyState = {
            request: {},
        };
        store = mockStore(emptyState);

        render(
            <Provider store={store}>
                <MemberInfo />
            </Provider>
        );

        expect(screen.getByText('Member Information')).toBeInTheDocument();
        expect(screen.queryByText('North, Manchester, CT 06040')).not.toBeInTheDocument();
    });
});