// src/components/Pagination.jsx
import React from 'react';
import Button from './Button';

export default function Pagination({ page, totalPages, onPrevious, onNext }) {
  return (
    <div className="mt-6 flex flex-col items-center gap-2">
      <div className="flex gap-3">
        <Button
          onClick={onPrevious}
          className="flex items-center px-4 py-2 font-medium bg-purple-500/40 text-white hover:bg-fuchsia-600/40 rounded-lg disabled:opacity-50 transition duration-200 cursor-pointer"
          disabled={page <= 1}
        >
          Previous
        </Button>
        <Button
          onClick={onNext}
          className="flex items-center px-4 py-2 font-medium bg-purple-500/40 text-white hover:bg-fuchsia-600/40 rounded-lg disabled:opacity-50 transition duration-200 cursor-pointer"
          disabled={page >= totalPages}
        >
          Next
        </Button>
      </div>
      <p className="text-sm text-gray-400">
        Page {page} of {totalPages}
      </p>
    </div>
  );
}
