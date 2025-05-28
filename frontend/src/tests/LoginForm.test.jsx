import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginForm from '../LoginForm';

beforeEach(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: false,
      json: () => Promise.resolve({ error: 'Invalid email or password' })
    })
  );
});

test('renders LoginForm and detects email input', () => {
  render(<LoginForm onLogin={() => {}} />);
  expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
});

test('shows error when login fails', async () => {
  render(<LoginForm onLogin={() => {}} />);
  fireEvent.change(screen.getByPlaceholderText(/email/i), {
    target: { value: 'test@example.com' }
  });
  fireEvent.change(screen.getByPlaceholderText(/password/i), {
    target: { value: 'wrongpassword' }
  });
  fireEvent.click(screen.getByText(/login/i));

  await waitFor(() =>
    expect(screen.getByText(/invalid email or password/i)).toBeInTheDocument()
  );
});
