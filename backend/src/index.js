// const express = require('express');
// const cors = require('cors');
// const axios = require('axios');
// require('dotenv').config();

// const app = express();
// const PORT = process.env.PORT || 5000;
// const SWAPI_BASE_URL = process.env.SWAPI_BASE_URL || 'https://www.swapi.tech/api';

// app.use(cors());
// app.use(express.json());

// let allCharacters = [];
// let cacheLoaded = false;

// function extractIdFromUrl(url) {
//   const match = url.match(/\/people\/(\d+)/);
//   return match ? match[1] : null;
// }

// async function loadAllCharacters() {
//   try {
//     let nextUrl = `${SWAPI_BASE_URL}/people?page=1&limit=100`;
//     let characters = [];

//     while (nextUrl) {
//       const res = await axios.get(nextUrl);
//       characters = characters.concat(res.data.results);
//       nextUrl = res.data.next;
//     }

//     allCharacters = characters;
//     cacheLoaded = true;
//     console.log('Character cache loaded with', allCharacters.length, 'characters.');
//   } catch (err) {
//     console.error('Error loading character cache:', err.message);
//   }
// }

// app.get('/api/characters', async (req, res) => {
//   try {
//     const search = req.query.search?.toLowerCase() || '';
//     const page = parseInt(req.query.page) || 1;
//     const pageSize = 10;

//     if (!cacheLoaded) {
//       await loadAllCharacters();
//       if (!cacheLoaded) return res.status(500).json({ error: 'Failed to load characters.' });
//     }

//     let filtered = allCharacters;
//     if (search) {
//       filtered = allCharacters.filter((char) => char.name.toLowerCase().includes(search));
//     }

//     const totalPages = Math.ceil(filtered.length / pageSize);
//     const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

//     const detailedCharacters = await Promise.all(paginated.map(async (char) => {
//       const id = extractIdFromUrl(char.url);
//       try {
//         const detailRes = await axios.get(`${SWAPI_BASE_URL}/people/${id}`);
//         const characterData = detailRes.data.result.properties;

//         const [homeworld, films, species] = await Promise.all([
//           characterData.homeworld
//             ? axios.get(characterData.homeworld).then(res => res.data.result.properties.name).catch(() => 'Unknown')
//             : 'Unknown',

//           // Films logic with fallback
//           (async () => {
//             const filmsArray = characterData.films || [];
//             if (Array.isArray(filmsArray) && filmsArray.length) {
//               return await Promise.all(
//                 filmsArray.map(async (filmUrl, index) => {
//                   try {
//                     const film = await axios.get(filmUrl, { timeout: 10000 });
//                     return film.data.result.properties.title;
//                   } catch (err) {
//                     console.error(`Film ${index + 1} fetch error: ${filmUrl} - ${err.message}`);
//                     return 'Unknown';
//                   }
//                 })
//               );
//             } else {
//               try {
//                 const fallbackFilms = await axios.get(`${SWAPI_BASE_URL}/films`);
//                 const allFilms = fallbackFilms.data?.result || [];
//                 return allFilms
//                   .filter(film => film.properties.characters?.includes(characterData.url))
//                   .map(film => film.properties.title) || ['Unknown'];
//               } catch (err) {
//                 console.error('Fallback films fetch error:', err.message);
//                 return ['Unknown'];
//               }
//             }
//           })(),

//           // Species logic with fallback
//           (async () => {
//             try {
//               const speciesArray = characterData.species || [];
//               if (speciesArray.length > 0) {
//                 const speciesRes = await axios.get(speciesArray[0]);
//                 return speciesRes.data.result.properties.name;
//               } else {
//                 const allSpeciesRes = await axios.get(`${SWAPI_BASE_URL}/species`);
//                 const allSpecies = allSpeciesRes.data?.results || [];

//                 for (const species of allSpecies) {
//                   try {
//                     const speciesDetails = await axios.get(species.url);
//                     const people = speciesDetails.data?.result?.properties?.people || [];

//                     if (people.some((url) => url.endsWith(`/people/${id}`))) {
//                       return speciesDetails.data?.result?.properties?.name || 'Unknown';
//                     }
//                   } catch (e) {
//                     continue; // skip faulty species
//                   }
//                 }

//                 return 'Unknown';
//               }
//             } catch (err) {
//               console.error('Species fetch error:', err.message);
//               return 'Unknown';
//             }
//           })()
//         ]);

//         return {
//           uid: id,
//           name: characterData.name,
//           height: characterData.height,
//           mass: characterData.mass,
//           homeworld,
//           species,
//           films
//         };
//       } catch (err) {
//         console.error(`Error fetching character ${id}:`, err.message);
//         return null;
//       }
//     }));

//     res.json({
//       characters: detailedCharacters.filter(Boolean),
//       totalPages
//     });
//   } catch (error) {
//     console.error('Failed to fetch characters:', error.message);
//     res.status(500).json({ error: 'Failed to fetch characters.' });
//   }
// });


// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });



const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const SWAPI_BASE_URL = process.env.SWAPI_BASE_URL || 'https://www.swapi.tech/api';

app.use(cors());
app.use(express.json());

let allCharacters = [];
let cacheLoaded = false;

// Caches
const homeworldCache = new Map();
const speciesCache = new Map();
const filmCache = new Map();
let allSpecies = [];
let allFilms = [];

// Helper
function extractIdFromUrl(url) {
  const match = url.match(/\/people\/(\d+)/);
  return match ? match[1] : null;
}

// Load characters
async function loadAllCharacters() {
  try {
    let nextUrl = `${SWAPI_BASE_URL}/people?page=1&limit=100`;
    let characters = [];

    while (nextUrl) {
      const res = await axios.get(nextUrl);
      characters = characters.concat(res.data.results);
      nextUrl = res.data.next;
    }

    allCharacters = characters;
    cacheLoaded = true;
    console.log('✅ Character cache loaded:', allCharacters.length);
  } catch (err) {
    console.error('❌ Error loading character cache:', err.message);
  }
}

// Cache film/species lists to improve fallback matching
async function preloadFilmsAndSpecies() {
  try {
    const speciesRes = await axios.get(`${SWAPI_BASE_URL}/species`);
    allSpecies = speciesRes.data.results || [];

    const filmRes = await axios.get(`${SWAPI_BASE_URL}/films`);
    allFilms = filmRes.data.result || [];
  } catch (err) {
    console.error('❌ Failed to preload species/films:', err.message);
  }
}

async function fetchWithCache(url, cache, fallback = 'Unknown') {
  if (cache.has(url)) return cache.get(url);

  try {
    const res = await axios.get(url);
    const name = res.data.result.properties.name;
    cache.set(url, name);
    return name;
  } catch (err) {
    console.error(`Error fetching ${url}:`, err.message);
    cache.set(url, fallback);
    return fallback;
  }
}

// Main route
app.get('/api/characters', async (req, res) => {
  try {
    const search = req.query.search?.toLowerCase() || '';
    const page = parseInt(req.query.page) || 1;
    const pageSize = 10;

    if (!cacheLoaded) {
      await Promise.all([loadAllCharacters(), preloadFilmsAndSpecies()]);
    }

    let filtered = allCharacters;
    if (search) {
      filtered = allCharacters.filter((char) =>
        char.name.toLowerCase().includes(search)
      );
    }

    const totalPages = Math.ceil(filtered.length / pageSize);
    const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

    const detailedCharacters = await Promise.all(
      paginated.map(async (char) => {
        const id = extractIdFromUrl(char.url);
        try {
          const detailRes = await axios.get(`${SWAPI_BASE_URL}/people/${id}`);
          const characterData = detailRes.data.result.properties;

          const homeworld = characterData.homeworld
            ? await fetchWithCache(characterData.homeworld, homeworldCache)
            : 'Unknown';

          // 🧠 Fallback: Match character via species -> people list
          let speciesName = 'Unknown';
          try {
            if (characterData.species?.length) {
              speciesName = await fetchWithCache(characterData.species[0], speciesCache);
            } else {
              for (const sp of allSpecies) {
                const speciesDetail = await axios.get(sp.url);
                const people = speciesDetail.data.result.properties.people || [];
                if (people.some((url) => url.endsWith(`/people/${id}`))) {
                  speciesName = speciesDetail.data.result.properties.name;
                  speciesCache.set(sp.url, speciesName);
                  break;
                }
              }
            }
          } catch (err) {
            console.error('Species fallback error:', err.message);
          }

          // 🎬 Fallback: Match character URL in films -> characters list
          let films = [];
          try {
            if (characterData.films?.length) {
              films = await Promise.all(
                characterData.films.map(async (filmUrl) =>
                  await fetchWithCache(filmUrl, filmCache, 'Unknown')
                )
              );
            } else {
              films = allFilms
                .filter((film) =>
                  film.properties.characters?.includes(characterData.url)
                )
                .map((film) => film.properties.title);
            }
          } catch (err) {
            console.error('Film fallback error:', err.message);
          }

          return {
            uid: id,
            name: characterData.name,
            height: characterData.height,
            mass: characterData.mass,
            homeworld,
            species: speciesName,
            films: films.length ? films : ['Unknown'],
          };
        } catch (err) {
          console.error(`❌ Character ${id} failed:`, err.message);
          return null;
        }
      })
    );

    res.json({
      characters: detailedCharacters.filter(Boolean),
      totalPages,
    });
  } catch (error) {
    console.error('❌ API error:', error.message);
    res.status(500).json({ error: 'Failed to fetch characters.' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
