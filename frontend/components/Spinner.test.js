// Import the Spinner component into this file and test
// that it renders what it should for the different props it can take.
import React from 'react';
import { render, screen } from '@testing-library/react';
import Spinner from './Spinner'; 

describe('Spinner Component', () => {

  test('sanity', () => {
    expect(true).toBe(true); 
  });

 
  test('renders Spinner when "on" is true', () => {
    render(<Spinner on={true} />);
    const spinnerElement = screen.getByTestId('spinner'); 
    expect(spinnerElement).toBeInTheDocument();
  });


  test('does not render Spinner when "on" is false', () => {
    render(<Spinner on={false} />);
    const spinnerElement = screen.queryByTestId('spinner'); 
    expect(spinnerElement).toBeNull();
  });
});