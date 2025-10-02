import React from 'react';
import { render, screen } from '@testing-library/react';
import Loader from './Loader';


describe('Loader Component',()=>{

test('renders loading text processing...',()=>{
    render(<Loader/>);
    expect(screen.getByText(/Processing/i)).toBeInTheDocument();
})

});