import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the typing game', () => {
  render(<App />);
  const startTypingMessage = screen.getByText(/start typing/i);
  expect(startTypingMessage).toBeInTheDocument();


  const wordBox = screen.getByTestId("word-list");
  expect(wordBox).toBeInTheDocument();
  expect(wordBox).not.toBeEmptyDOMElement();
});



