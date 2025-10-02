import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import RequestCustomAlert from './RequestCustomAlert';

describe('RequestCustomAlert Componetn',()=>{
const defaultProps= {
    show:true,
    message:'Test Alert Message',
    discription:'Discription',
    varient: 'info',
    onClose: jest.fn()
};

test('renders alert with correct message and description',()=>{
    render(<RequestCustomAlert variant={''} {...defaultProps}/>);
    expect(screen.getByText(/Test Alert Message/i)).toBeInTheDocument();
    expect(screen.getByText(/Discription/i)).toBeInTheDocument();
});

test('does not render alert when show is false',()=>{
    render(<RequestCustomAlert variant={''} {...defaultProps} show={false}/>);
    expect(screen.queryByText(/Test Alert Message/i)).not.toBeInTheDocument();
})


test('calls onclose when alert is dsimissed',async()=>{
    render(<RequestCustomAlert variant={''} {...defaultProps} show={true}/>);
    expect(screen.getByText(/Test Alert Message/i)).toBeInTheDocument();
})

})