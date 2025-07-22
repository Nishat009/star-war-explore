import React, { useState, useEffect, useMemo } from 'react';
import debounce from 'lodash.debounce';

export default function SearchInput({ initialValue = '', onSearch }) {
  const [value, setValue] = useState(initialValue);

  // Update local input when initialValue changes (like URL param)
  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  // Debounced onSearch call
  const debouncedSearch = useMemo(
    () =>
      debounce((val) => {
        onSearch(val.trim());
      }, 400),
    [onSearch]
  );

  const handleChange = (e) => {
    const val = e.target.value;
    setValue(val);
    debouncedSearch(val);
  };

  const handleClear = () => {
    setValue('');
    onSearch('');
  };

  return (
    <div className="mb-4 flex gap-2">
      <input
        type="text"
        placeholder="Search by name..."
        value={value}
        onChange={handleChange}
        className="border px-3 py-2 rounded flex-1"
      />
      {value && (
        <button
          onClick={handleClear}
          className="bg-gray-400 text-white px-4 py-2 rounded"
          type="button"
        >
          Clear
        </button>
      )}
    </div>
  );
}
