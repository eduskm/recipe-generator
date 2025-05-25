import { useState } from 'react';

export default function Alert({ onClick, action, confirmDelete, cancelDelete }) {
  const shouldShowModal = action === 'delete' || action === 'wrongLogin';

  return (
    <>
      {shouldShowModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-40">
          <div className="bg-white rounded-lg p-6 shadow-xl text-center">
            <h3 className="text-lg font-semibold mb-4">
              Are you sure you want to delete your account?
            </h3>
            <div className="flex justify-center gap-4">
              <button
                onClick={confirmDelete}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Yes, Delete
              </button>
              <button
                onClick={cancelDelete}
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
