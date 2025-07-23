import React, { useState, useEffect, useMemo } from 'react';
import debounce from 'lodash.debounce';
import { Search } from 'lucide-react';
import Button from './Button';

export default function SearchInput({ initialValue = '', onSearch }) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const debouncedSearch = useMemo(
    () => debounce((val) => onSearch(val.trim()), 400),
    [onSearch]
  );

  const handleChange = (e) => {
    const val = e.target.value;
    setValue(val);
    debouncedSearch(val);
  };

 

  return (
    <div className="mb-6 flex gap-3 mx-20">
      <input
        type="text"
        placeholder="Search by name..."
        value={value}
        onChange={handleChange}
        className="flex w-full rounded-xs border px-3 py-2 bg-linear-to-bl from-violet-500/10 to-fuchsia-500/10 !focus:border-amber-800/30 focus-visible:border-amber-800/30 focus-within:shadow-amber-800 !focus-within:border-amber-800/30 focus-within:border-transparent focus:ring-2 focus:ring-primary/50 focus:border-primary/50 border-amber-800/10"
      />
      <Button 
          onClick={onSearch}
        >
          <Search className="h-4 w-4" />
        </Button>
      {/* {value && (
        <button
          onClick={handleClear}
          className="px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition duration-200"
          type="button"
        >
          Clear
        </button>
      )} */}
    </div>
  );
}
