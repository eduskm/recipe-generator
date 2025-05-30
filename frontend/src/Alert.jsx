import { useState } from 'react';
import React from 'react';

export default function Alert({ action, confirmDelete, cancelDelete }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const shouldShowModal = action === 'delete';

  const handleConfirm = async () => {
    const isSuccess = await confirmDelete(password);

    if (!isSuccess) {
      setError('Incorrect password. Please try again.');
      setPassword(''); 
  };

  const handleCancel = () => {
    setError('');
    setPassword('');
    cancelDelete(); 
  };

  return (
    <>
      {shouldShowModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-40">
          <div className="bg-white rounded-lg p-6 shadow-xl text-center w-full max-w-sm">
            
            <h3 className="text-lg font-semibold mb-2">Delete Account</h3>
            <p className="text-sm text-gray-600 mb-4">
              This is permanent. Please enter your password to confirm.
            </p>

            {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="border p-2 w-full mb-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            
            {/* --- CONTENT END --- */}

            <div className="flex justify-center gap-4">
              {/* This button now calls our new handleConfirm function */}
              <button
                onClick={handleConfirm}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Confirm Delete
              </button>
              {/* calls handleCancel */}
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
}}