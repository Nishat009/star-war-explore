import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import debounce from 'lodash.debounce';

function SearchInput({ initialValue = '', onSearch }) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

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

function CharacterList({ characters }) {
  if (!characters || characters.length === 0)
    return <p className="text-gray-500">No characters found.</p>;

  return (
    <ul className="list-disc pl-5">
      {characters.map((char, index) => (
        <li key={char.uid || char.url || index}>
          <a href={`/characters/${char.uid || index}`} className="text-blue-500 hover:underline">
            {char.name}
          </a>
        </li>
      ))}
    </ul>
  );
}

export default function HomePage() {
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const [searchParams, setSearchParams] = useSearchParams();

  const page = parseInt(searchParams.get('page')) || 1;
  const query = searchParams.get('search') || '';

  const [searchTerm, setSearchTerm] = useState(query);

  useEffect(() => {
    setSearchTerm(query);
  }, [query]);

  useEffect(() => {
    async function fetchCharacters() {
      setLoading(true);
      setError(null);

      try {
        const baseUrl = `http://localhost:5000/api/characters`;
        const url = query
          ? `${baseUrl}?search=${encodeURIComponent(query)}`
          : `${baseUrl}?page=${page}`;

        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const fetchedData = await response.json();

        setData(fetchedData);
        setCharacters(fetchedData.results || []);
      } catch (err) {
        setError(`Failed to load characters: ${err.message}`);
      } finally {
        setLoading(false);
      }
    }

    fetchCharacters();
  }, [page, query]);

  const onSearch = (searchValue) => {
    if (searchValue) {
      // When searching, reset to page 1 and add search param
      setSearchParams({ search: searchValue, page: '1' });
    } else {
      // Clear search and reset page to 1
      setSearchParams({ page: '1' });
    }
  };

  const handlePrevious = () => {
    if (data?.previous) {
      const params = { page: data.previous };
      if (query) params.search = query;
      setSearchParams(params);
    }
  };

  const handleNext = () => {
    if (data?.next) {
      const params = { page: data.next };
      if (query) params.search = query;
      setSearchParams(params);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Characters</h1>

      <SearchInput initialValue={searchTerm} onSearch={onSearch} />

      {error && <p className="text-red-500 mb-2">{error}</p>}

      {loading && characters.length > 0 && (
        <p className="text-gray-500 mb-2 italic">Loading...</p>
      )}

      {!loading && characters.length === 0 && (
        <p className="text-gray-500 mb-2">No characters found.</p>
      )}

      <CharacterList characters={characters} />

      {!query && (
        <div className="mt-4 flex gap-2">
          <button
            onClick={handlePrevious}
            className="px-4 py-2 bg-gray-600 text-white rounded disabled:opacity-50"
            disabled={!data?.previous || loading}
          >
            Previous Page
          </button>
          <button
            onClick={handleNext}
            className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
            disabled={!data?.next || loading}
          >
            Next Page
          </button>
        </div>
      )}

      {!query && data && (
        <p className="mt-2 text-sm text-gray-600">
          Page {page} of {data.total_pages || '?'}
        </p>
      )}

      {query && (
        <p className="mt-2 text-sm text-gray-600">
          Showing {characters.length} result(s) for: "<strong>{query}</strong>"
        </p>
      )}
    </div>
  );
}
