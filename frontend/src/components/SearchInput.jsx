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
      <div className="relative w-full p-2">
  <input
    type="text"
    placeholder="Search by name..."
    value={value}
    onChange={handleChange}
    className="w-full rounded-xs border px-3 py-2 pr-10 bg-gradient-to-bl from-violet-500/10 to-fuchsia-500/10 focus:border-primary/50 focus:outline-none !focus:ring-0 focus:ring-offset-0 border-amber-800/10"
  />
  <Button 
    type="button"
    className="flex bg-linear-to-bl from-violet-500 to-fuchsia-500 rounded-xs px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-0 focus:ring-offset-0 disabled:opacity-50 disabled:pointer-events-none absolute right-4 top-4 !focus:ring-0 p-2 items-center justify-center"
  >
    <Search className="h-3 w-3" />
  </Button>
</div>
    </div>
  );
}
