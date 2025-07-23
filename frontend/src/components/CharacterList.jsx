export default function CharacterList({ characters, loading }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="p-4 rounded-lg bg-gray-800 animate-pulse h-40" />
        ))}
      </div>
    );
  }

  if (!characters || characters.length === 0) {
    return null; // The fallback "No characters found" is now handled in the parent
  }

  return (
    <ul className="grid 2xl:grid-cols-4 xl:grid-cols-3 md:grid-cols-2 gap-4">
      {characters.map((char, index) => (
        <li
          key={char.uid || index}
          className="p-4 rounded-lg bg-gray-800 hover:bg-gray-700 transition duration-200"
        >
          <h2 className="text-xl font-bold mb-2">{char.name}</h2>
          <p><strong>Height:</strong> {char.height}</p>
          <p><strong>Mass:</strong> {char.mass}</p>
          <p><strong>Homeworld:</strong> {char.homeworld}</p>
          <p><strong>Species:</strong> {char.species}</p>
          <p><strong>Films:</strong> {char.films?.length > 0 ? (
            <ul className="list-disc list-inside">
              {char.films.map((film, i) => <li key={i}>{film}</li>)}
            </ul>
          ) : 'None'}</p>
        </li>
      ))}
    </ul>
  );
}
