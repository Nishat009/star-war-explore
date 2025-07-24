import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import SearchInput from '../components/SearchInput';
import CharacterList from '../components/CharacterList';
import Pagination from '../components/Pagination';

const PAGE_SIZE = 10;

export default function HomePage() {
  const [allCharacters, setAllCharacters] = useState([]);
  const [filteredCharacters, setFilteredCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get('page')) || 1;
  const query = searchParams.get('search') || '';
  const [searchTerm, setSearchTerm] = useState(query);

  // Load from localStorage or API
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setError(null);

      try {
        const cached = localStorage.getItem('allCharacters');
        if (cached) {
          const parsed = JSON.parse(cached);
          setAllCharacters(parsed);
        } else {
          const res = await fetch('http://localhost:5000/api/characters?all=true');
          const data = await res.json();
          localStorage.setItem('allCharacters', JSON.stringify(data.characters));
          setAllCharacters(data.characters);
        }
      } catch (err) {
        console.error(err);
        setError('Failed to load characters');
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  // Filter & paginate based on query and page
  useEffect(() => {
    const q = query.toLowerCase();
    const filtered = allCharacters.filter(char =>
      char.name.toLowerCase().includes(q)
    );
    setFilteredCharacters(filtered);
  }, [allCharacters, query]);

  // Pagination
  const paginatedCharacters = filteredCharacters.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  const totalPages = Math.ceil(filteredCharacters.length / PAGE_SIZE);

  // Sync search term in input
  useEffect(() => {
    setSearchTerm(query);
  }, [query]);

  const onSearch = (searchValue) => {
    if (searchValue) {
      setSearchParams({ search: searchValue, page: '1' });
    } else {
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
    if (page < totalPages) {
      const params = { page: (page + 1).toString() };
      if (query) params.search = query;
      setSearchParams(params);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className='text-5xl md:text-7xl font-bold bg-gradient-primary mb-6 flex justify-center text-center font-inter tracking-tight bg-gradient-to-r mx-auto from-violet-500 to-fuchsia-500 text-transparent bg-clip-text'>
          Star Wars Explorer
        </h1>
        <div className="h-1 w-32 bg-linear-to-bl from-violet-500 to-fuchsia-500 rounded-full mx-auto mb-6"></div>
        <h3 className='text-xl md:text-2xl text-stone-400 max-w-3xl mx-auto text-center font-light mb-10'>
          Track the Force across planets, species, and starship. Uncover characters, planets, starships, and more from a galaxy far, far away...
        </h3>

        <SearchInput initialValue={searchTerm} onSearch={onSearch} />

        {error && <p className="text-red-400 text-lg mb-4">{error}</p>}
        {loading && <p className="text-gray-400 text-lg mb-4 italic">Loading...</p>}
        {!loading && paginatedCharacters.length === 0 && (
          <p className="text-gray-400 text-lg mb-4">No characters found.</p>
        )}

        <CharacterList characters={paginatedCharacters} />

        {!loading && filteredCharacters.length > 0 && (
  <Pagination
    page={page}
    totalPages={totalPages}
    onPrevious={handlePrevious}
    onNext={handleNext}
  />
)}

      </div>
    </div>
  );
}
