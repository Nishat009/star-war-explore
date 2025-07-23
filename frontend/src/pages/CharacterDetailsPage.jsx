// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import { getCharacterDetails } from '../services/api';

// export default function CharacterDetailsPage() {
//   const { id } = useParams();
//   const [character, setCharacter] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchCharacter = async () => {
//       try {
//         setLoading(true);
//         setError(null);
//         const data = await getCharacterDetails(id);
//         setCharacter(data);
//       } catch (err) {
//         console.error(err);
//         setError('Failed to load character details');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCharacter();
//   }, [id]);

//   if (loading) return <p className="text-gray-400">Loading...</p>;
//   if (error) return <p className="text-red-500">{error}</p>;
//   if (!character) return <p className="text-yellow-500">Character not found.</p>;

//   return (
//     <div className="min-h-screen bg-gray-900 text-white p-6">
//       <div className="max-w-4xl mx-auto">
//         <h1 className="text-4xl font-bold mb-6">{character.name}</h1>
//         <div className="bg-gray-800 p-6 rounded-lg shadow-lg space-y-4">
//           <p className="text-lg"><strong>Homeworld:</strong> {character.homeworld}</p>
//           <p className="text-lg"><strong>Species:</strong> {character.species}</p>
//           <p className="text-lg"><strong>Height:</strong> {character.height} cm</p>
//           <p className="text-lg"><strong>Mass:</strong> {character.mass} kg</p>
//           <div>
//             <strong className="text-lg">Films:</strong>
//             {character.films && character.films.length > 0 ? (
//               <ul className="list-disc pl-6 mt-2 space-y-1">
//                 {character.films.map((film, index) => (
//                   <li key={index} className="text-gray-300">{film}</li>
//                 ))}
//               </ul>
//             ) : (
//               <p className="text-gray-400 text-sm mt-2">No film data available</p>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
