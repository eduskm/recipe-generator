import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import RegisterForm from '../RegisterForm';

beforeEach(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ success: true })
    })
  );
});

test('registers user and shows success message', async () => {
  render(<RegisterForm onRegister={() => {}} />);
  fireEvent.change(screen.getByPlaceholderText(/name/i), {
    target: { value: 'Test User' }
  });
  fireEvent.change(screen.getByPlaceholderText(/email/i), {
    target: { value: 'user@example.com' }
  });
  fireEvent.change(screen.getByPlaceholderText(/password/i), {
    target: { value: 'securepass123' }
  });

  fireEvent.click(screen.getByText(/register/i));

  await waitFor(() =>
    expect(screen.getByText(/account created/i)).toBeInTheDocument()
  );
});
