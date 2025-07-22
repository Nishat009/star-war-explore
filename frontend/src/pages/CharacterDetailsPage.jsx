import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getCharacterDetails } from '../services/api';

export default function CharacterDetailsPage() {
  const { id } = useParams();
  const [character, setCharacter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCharacter = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getCharacterDetails(id);
        setCharacter(data);
      } catch (err) {
        console.error(err);
        setError('Failed to load character details');
      } finally {
        setLoading(false);
      }
    };

    fetchCharacter();
  }, [id]);

  if (loading) return <p className="text-gray-400">Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!character) return <p className="text-yellow-500">Character not found.</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">{character.name}</h1>
      <div className="bg-gray-800 text-white p-6 rounded shadow-md space-y-3">
        <p><strong>Homeworld:</strong> {character.homeworld}</p>
        <p><strong>Species:</strong> {character.species}</p>
        <p><strong>Height:</strong> {character.height} cm</p>
        <p><strong>Mass:</strong> {character.mass} kg</p>
        <div>
          <strong>Films:</strong>
          {character.films && character.films.length > 0 ? (
            <ul className="list-disc pl-5 mt-1">
              {character.films.map((film, index) => (
                <li key={index}>{film}</li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-300">No film data available</p>
          )}
        </div>
      </div>
    </div>
  );
}
