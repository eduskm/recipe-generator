import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import UserDashboard from '../UserDashboard';

test('renders dashboard and logs out user', () => {
  const mockLogout = jest.fn();
  const fakeUser = { email: 'user@test.com' };

  render(<UserDashboard user={fakeUser} onLogout={mockLogout} />);
  expect(screen.getByText(/welcome/i)).toBeInTheDocument();

  fireEvent.click(screen.getByText(/logout/i));
  expect(mockLogout).toHaveBeenCalled();
});
