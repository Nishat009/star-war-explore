import React from 'react';

export default function CharacterList({ characters }) {
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
