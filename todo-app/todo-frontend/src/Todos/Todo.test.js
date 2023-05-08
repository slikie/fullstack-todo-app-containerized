import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Todo from './Todo';

test('renders todo text', () => {
  const todo = { _id: '1', text: 'Buy groceries', done: false };
  const { getByText } = render(<Todo todo={todo} />);
  const todoText = getByText(/buy groceries/i);
  expect(todoText).toBeInTheDocument();
})