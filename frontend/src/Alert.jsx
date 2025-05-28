import { useState } from 'react';
import React from 'react';

// The confirmDelete function from the parent will be passed in.
export default function Alert({ action, confirmDelete, cancelDelete }) {
  // State for the password input and any potential errors
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // This determines if the modal should be visible at all.
  // We'll only handle the 'delete' action for now.
  const shouldShowModal = action === 'delete';

  // Wrapper for the confirm function to pass the password
  const handleConfirm = async () => {
    // Call the function passed from UserDashboard, providing the password
    const isSuccess = await confirmDelete(password);

    // If the parent function returns false (indicating a failed API call)
    if (!isSuccess) {
      setError('Incorrect password. Please try again.');
      setPassword(''); // Clear the password field
    }
  };

  const handleCancel = () => {
    // Clear state before closing the modal
    setError('');
    setPassword('');
    cancelDelete(); // Call the parent's cancel function
  };

  return (
    <>
      {shouldShowModal && (
        // Your original modal backdrop styling
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-40">
          {/* Your original modal container styling */}
          <div className="bg-white rounded-lg p-6 shadow-xl text-center w-full max-w-sm">
            
            {/* --- NEW/MODIFIED CONTENT STARTS HERE --- */}

            <h3 className="text-lg font-semibold mb-2">Delete Account</h3>
            <p className="text-sm text-gray-600 mb-4">
              This is permanent. Please enter your password to confirm.
            </p>

            {/* Display error message if there is one */}
            {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

            {/* New Password Input Field */}
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="border p-2 w-full mb-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            
            {/* --- CONTENT ENDS HERE --- */}

            <div className="flex justify-center gap-4">
              {/* This button now calls our new handleConfirm function */}
              <button
                onClick={handleConfirm}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Confirm Delete
              </button>
              {/* This button now calls our new handleCancel function */}
              <button
                onClick={handleCancel}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}