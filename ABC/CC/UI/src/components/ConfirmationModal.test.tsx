import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ConfirmationModal from './ConfirmationModal';


describe('Confirmation Modal Component',()=>{
const defaultProps= {
    show:true,
    onHide: jest.fn(),
    onConfirm:jest.fn(),
    title:'Test Modal title',
    body:<span>Are you sure want to proceed?</span>
};
    beforeEach(()=>{
       jest.clearAllMocks();
    })


test('renders modal with title and body',()=>{
    render(<ConfirmationModal {...defaultProps}/>);
    expect(screen.getByText(/Test Modal title/i)).toBeInTheDocument();
    expect(screen.getByText(/are you sure/i)).toBeInTheDocument();
});

test('calls onHde when cancel button is clicked',()=>{
    render(<ConfirmationModal {...defaultProps}/>);
    fireEvent.click(screen.getByText('Cancel'))

    expect(defaultProps.onHide).toHaveBeenCalledTimes(1);
})


test('calls onConfirm when confirm button is clicked',()=>{
    render(<ConfirmationModal {...defaultProps}/>);
    fireEvent.click(screen.getByText('Confirm'))

    expect(defaultProps.onConfirm).toHaveBeenCalledTimes(1);
})


test('does not render modal when show is false',async()=>{
    render(<ConfirmationModal  {...defaultProps} show={false}/>);
    expect(screen.queryByText(/Test Modal Title/i)).not.toBeInTheDocument();
})

})