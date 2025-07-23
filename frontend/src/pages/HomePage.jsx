import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import SearchInput from '../components/SearchInput';
import CharacterList from '../components/CharacterList';


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
      setCharacters(fetchedData.characters || []); // ✅ fixed
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
  if (page > 1) {
    const params = { page: (page - 1).toString() };
    if (query) params.search = query;
    setSearchParams(params);
  }
};

const handleNext = () => {
  if (data?.totalPages && page < data.totalPages) {
    const params = { page: (page + 1).toString() };
    if (query) params.search = query;
    setSearchParams(params);
  }
};


  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">

      <div className="max-w-5xl mx-auto">
        <h1 className='text-5xl md:text-7xl font-bold bg-gradient-primary mb-6 flex justify-center text-center font-inter tracking-tight bg-gradient-to-r mx-auto from-violet-500 to-fuchsia-500 text-transparent bg-clip-text '>Star Wars Explorer</h1>
        <div className="h-1 w-32 bg-linear-to-bl from-violet-500 to-fuchsia-500 rounded-full mx-auto mb-6 "></div>
        <h3 className='text-xl md:text-2xl text-stone-400 max-w-3xl mx-auto text-center font-light mb-10'>Track the Force across planets, species, and starship. Uncover characters, planets, starships, and more from a galaxy far, far away...</h3>
        <SearchInput initialValue={searchTerm} onSearch={onSearch} />
        {error && <p className="text-red-400 text-lg mb-4">{error}</p>}
        {loading && characters.length > 0 && (
          <p className="text-gray-400 text-lg mb-4 italic">Loading...</p>
        )}
        {!loading && characters.length === 0 && (
          <p className="text-gray-400 text-lg mb-4">No characters found.</p>
        )}
       <CharacterList characters={characters} />
        {!query && (
          <div className="mt-6 flex gap-3">
            <button
              onClick={handlePrevious}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 transition duration-200"
              disabled={!data?.previous || loading}
            >
              Previous
            </button>
            <button
              onClick={handleNext}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition duration-200"
              disabled={!data?.next || loading}
            >
              Next
            </button>
          </div>
        )}
        {!query && data && (
          <p className="mt-4 text-gray-400 text-sm">
            Page {page} of {data.total_pages || '?'}
          </p>
        )}
        {query && (
          <p className="mt-4 text-gray-400 text-sm">
            Showing {characters.length} result(s) for: "<strong>{query}</strong>"
          </p>
        )}
      </div>
    </div>
  );
}
