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

// // Caches
// const homeworldCache = new Map();
// const speciesCache = new Map();
// const filmCache = new Map();
// let allSpecies = [];
// let allFilms = [];

// // Helpers
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
//     console.log('✅ Character cache loaded:', allCharacters.length);
//   } catch (err) {
//     console.error('❌ Error loading character cache:', err.message);
//   }
// }

// async function preloadFilmsAndSpecies() {
//   try {
//     const speciesRes = await axios.get(`${SWAPI_BASE_URL}/species`);
//     allSpecies = speciesRes.data.results || [];

//     const filmRes = await axios.get(`${SWAPI_BASE_URL}/films`);
//     allFilms = filmRes.data.result || [];
//   } catch (err) {
//     console.error('❌ Failed to preload species/films:', err.message);
//   }
// }

// async function fetchWithCache(url, cache, fallback = 'Unknown') {
//   if (cache.has(url)) return cache.get(url);

//   try {
//     const res = await axios.get(url);
//     const name = res.data.result.properties.name;
//     cache.set(url, name);
//     return name;
//   } catch (err) {
//     console.error(`Error fetching ${url}:`, err.message);
//     cache.set(url, fallback);
//     return fallback;
//   }
// }

// // Main route
// app.get('/api/characters', async (req, res) => {
//   try {
//     const search = req.query.search?.toLowerCase() || '';
//     const page = parseInt(req.query.page) || 1;
//     const pageSize = 10;

//     if (!cacheLoaded) {
//       await Promise.all([loadAllCharacters(), preloadFilmsAndSpecies()]);
//     }

//     // Filter
//     const filtered = search
//       ? allCharacters.filter((char) =>
//           char.name.toLowerCase().includes(search)
//         )
//       : allCharacters;

//     const totalPages = Math.ceil(filtered.length / pageSize);
//     const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

//     const detailedCharacters = await Promise.all(
//       paginated.map(async (char) => {
//         const id = extractIdFromUrl(char.url);
//         try {
//           const detailRes = await axios.get(`${SWAPI_BASE_URL}/people/${id}`);
//           const characterData = detailRes.data.result.properties;

//           const homeworld = characterData.homeworld
//             ? await fetchWithCache(characterData.homeworld, homeworldCache)
//             : 'Unknown';

//           // Species
//           let speciesName = 'Unknown';
//           try {
//             if (characterData.species?.length) {
//               speciesName = await fetchWithCache(characterData.species[0], speciesCache);
//             } else {
//               for (const sp of allSpecies) {
//                 const speciesDetail = await axios.get(sp.url);
//                 const people = speciesDetail.data.result.properties.people || [];
//                 if (people.some((url) => url.endsWith(`/people/${id}`))) {
//                   speciesName = speciesDetail.data.result.properties.name;
//                   speciesCache.set(sp.url, speciesName);
//                   break;
//                 }
//               }
//             }
//           } catch (err) {
//             console.error('Species fallback error:', err.message);
//           }

//           // Films
//           let films = [];
//           try {
//             if (characterData.films?.length) {
//               films = await Promise.all(
//                 characterData.films.map(async (filmUrl) =>
//                   await fetchWithCache(filmUrl, filmCache, 'Unknown')
//                 )
//               );
//             } else {
//               films = allFilms
//                 .filter((film) =>
//                   film.properties.characters?.includes(characterData.url)
//                 )
//                 .map((film) => film.properties.title);
//             }
//           } catch (err) {
//             console.error('Film fallback error:', err.message);
//           }

//           return {
//             uid: id,
//             name: characterData.name,
//             height: characterData.height,
//             mass: characterData.mass,
//             homeworld,
//             species: speciesName,
//             films: films.length ? films : ['Unknown'],
//           };
//         } catch (err) {
//           console.error(`❌ Character ${id} failed:`, err.message);
//           return null;
//         }
//       })
//     );

//     res.json({
//       characters: detailedCharacters.filter(Boolean),
//       total_pages: totalPages,
//       next: page < totalPages,
//       previous: page > 1,
//     });
//   } catch (error) {
//     console.error('❌ API error:', error.message);
//     res.status(500).json({ error: 'Failed to fetch characters.' });
//   }
// });

// app.listen(PORT, () => {
//   console.log(`🚀 Server is running on http://localhost:${PORT}`);
// });

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

// // Util
// function extractIdFromUrl(url) {
//   const match = url.match(/\/people\/(\d+)/);
//   return match ? match[1] : null;
// }

// // Load all characters once
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
//     console.log('✅ Character cache loaded with', allCharacters.length);
//   } catch (err) {
//     console.error('❌ Error loading characters:', err.message);
//   }
// }

// // Route
// app.get('/api/characters', async (req, res) => {
//   try {
//     const search = req.query.search?.toLowerCase() || '';
//     const page = parseInt(req.query.page) || 1;
//     const pageSize = 10;

//     if (!cacheLoaded) {
//       await loadAllCharacters();
//       if (!cacheLoaded) return res.status(500).json({ error: 'Failed to load characters.' });
//     }

//     // ✅ 1. Filter by search (global, not page by page)
//     let filtered = allCharacters;
//     if (search) {
//       filtered = allCharacters.filter((char) =>
//         char.name.toLowerCase().includes(search)
//       );
//     }

//     // ✅ 2. Paginate the filtered results
//     const totalPages = Math.ceil(filtered.length / pageSize);
//     const startIndex = (page - 1) * pageSize;
//     const paginated = filtered.slice(startIndex, startIndex + pageSize);

//     // ✅ 3. Fetch details for current paginated results
//     const detailedCharacters = await Promise.all(
//       paginated.map(async (char) => {
//         const id = extractIdFromUrl(char.url);
//         try {
//           const detailRes = await axios.get(`${SWAPI_BASE_URL}/people/${id}`);
//           const characterData = detailRes.data.result.properties;

//           const [homeworld, films, species] = await Promise.all([
//             characterData.homeworld
//               ? axios
//                   .get(characterData.homeworld)
//                   .then((res) => res.data.result.properties.name)
//                   .catch(() => 'Unknown')
//               : 'Unknown',

//             // 🎬 Films
//             (async () => {
//               const filmsArray = characterData.films || [];
//               if (Array.isArray(filmsArray) && filmsArray.length) {
//                 return await Promise.all(
//                   filmsArray.map(async (filmUrl, index) => {
//                     try {
//                       const film = await axios.get(filmUrl, { timeout: 10000 });
//                       return film.data.result.properties.title;
//                     } catch (err) {
//                       console.error(`Film fetch error: ${filmUrl} - ${err.message}`);
//                       return 'Unknown';
//                     }
//                   })
//                 );
//               } else {
//                 try {
//                   const fallbackFilms = await axios.get(`${SWAPI_BASE_URL}/films`);
//                   const allFilms = fallbackFilms.data?.result || [];
//                   return allFilms
//                     .filter(film => film.properties.characters?.includes(characterData.url))
//                     .map(film => film.properties.title) || ['Unknown'];
//                 } catch (err) {
//                   return ['Unknown'];
//                 }
//               }
//             })(),

//             // 👽 Species (unchanged)
//             (async () => {
//               try {
//                 const speciesArray = characterData.species || [];
//                 if (speciesArray.length > 0) {
//                   const speciesRes = await axios.get(speciesArray[0]);
//                   return speciesRes.data.result.properties.name;
//                 } else {
//                   const allSpeciesRes = await axios.get(`${SWAPI_BASE_URL}/species`);
//                   const allSpecies = allSpeciesRes.data?.results || [];

//                   for (const species of allSpecies) {
//                     try {
//                       const speciesDetails = await axios.get(species.url);
//                       const people = speciesDetails.data?.result?.properties?.people || [];

//                       if (people.some((url) => url.endsWith(`/people/${id}`))) {
//                         return speciesDetails.data?.result?.properties?.name || 'Unknown';
//                       }
//                     } catch (e) {
//                       continue;
//                     }
//                   }

//                   return 'Unknown';
//                 }
//               } catch (err) {
//                 console.error('Species fetch error:', err.message);
//                 return 'Unknown';
//               }
//             })()
//           ]);

//           return {
//             uid: id,
//             name: characterData.name,
//             height: characterData.height,
//             mass: characterData.mass,
//             homeworld,
//             species,
//             films: films.length ? films : ['Unknown'],
//           };
//         } catch (err) {
//           console.error(`Error fetching character ${id}:`, err.message);
//           return null;
//         }
//       })
//     );

//     // ✅ 4. Send response
//     res.json({
//       characters: detailedCharacters.filter(Boolean),
//       total_pages: totalPages,
//       next: page < totalPages,
//       previous: page > 1
//     });
//   } catch (error) {
//     console.error('❌ API Error:', error.message);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });



// app.listen(PORT, () => {
//   console.log(`🚀 Server running at http://localhost:${PORT}`);
// });




import express from 'express';
import axios from 'axios';
import cors from 'cors';
import pLimit from 'p-limit';


const app = express();
const PORT = 5000;

app.use(cors());

const SWAPI_BASE_URL = 'https://swapi.tech/api';

let allCharacters = [];
let cacheLoaded = false;

// Delay helper
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

// Retry helper
async function fetchWithRetry(url, retries = 5, delayMs = 2000) { // Increased retries and delay
  for (let i = 0; i < retries; i++) {
    try {
      const response = await axios.get(url);
      return response;
    } catch (err) {
      console.error(`Fetch attempt ${i + 1} for ${url} failed:`, err.message, err.response?.status);
      if (err.response?.status === 429 && i < retries - 1) {
        console.warn(`⚠️ Rate limited. Retrying ${url} in ${delayMs}ms...`);
        await delay(delayMs * (i + 1)); // Exponential backoff
      } else {
        throw err;
      }
    }
  }
}

// Load all character base data
async function loadAllCharacters() {
  try {
    let results = [];
    let next = `${SWAPI_BASE_URL}/people`;
    while (next) {
      const res = await fetchWithRetry(next);
      const data = res.data;
      console.log(`Fetched page with ${data.results?.length} characters, next: ${data.next}`);
      if (data?.results?.length) {
        data.results.forEach((char) => console.log(`Cached character: ${char.url}`));
        results.push(...data.results);
        next = data.next;
      } else {
        next = null;
      }
    }
    allCharacters = results;
    cacheLoaded = true;
    console.log(`✅ Loaded ${allCharacters.length} characters into cache. Full list:`, allCharacters.map(c => c.url));
  } catch (err) {
    console.error('❌ Failed to load characters:', err.message, err.response?.status);
    cacheLoaded = false;
  }
}

function extractIdFromUrl(url) {
  const match = url.match(/\/people\/(\d+)/);
  return match ? match[1] : null;
}

app.get('/api/characters', async (req, res) => {
  try {
    const search = req.query.search?.toLowerCase() || '';
    const page = parseInt(req.query.page) || 1;
    const pageSize = 10;
    const returnAll = req.query.all === 'true';

    if (!cacheLoaded) {
      await loadAllCharacters();
      if (!cacheLoaded) return res.status(500).json({ error: 'Failed to load characters.' });
    }

    // Filter by search
    let filtered = allCharacters;
    if (search) {
      filtered = allCharacters.filter((char) =>
        char.name.toLowerCase().includes(search)
      );
    }
console.log(`Filtered length: ${filtered.length}, Start: ${start}, End: ${start + pageSize}`);
console.log(`Base list before enrichment:`, baseList.map(c => c.url));
    const totalPages = Math.ceil(filtered.length / pageSize);
    const start = (page - 1) * pageSize;
    const baseList = returnAll ? filtered : filtered.slice(start, start + pageSize);

    const limit = pLimit(5); // Throttle to 5 concurrent fetches

    const detailed = await Promise.all(
      baseList.map((char) =>
        limit(async () => {
          const id = extractIdFromUrl(char.url);
          try {
            const res = await fetchWithRetry(`${SWAPI_BASE_URL}/people/${id}`);
            const data = res.data.result.properties;

            // Homeworld
            let homeworld = 'Unknown';
            if (data.homeworld) {
              try {
                const homeRes = await fetchWithRetry(data.homeworld);
                homeworld = homeRes.data.result.properties.name || 'Unknown';
              } catch (homeErr) {
                console.warn(`⚠️ Homeworld fetch failed for ${id}: ${homeErr.message}`);
              }
            }

            // Films
            let films = ['Unknown']; // Default to ['Unknown'] if no films
            if (data.films?.length) {
              films = await Promise.all(
                data.films.map((url) =>
                  fetchWithRetry(url)
                    .then((res) => res.data.result.properties.title || 'Unknown')
                    .catch((filmErr) => {
                      console.warn(`⚠️ Film fetch failed for ${url}: ${filmErr.message}`);
                      return 'Unknown';
                    })
                )
              );
            }

            // Species
            let species = 'Unknown';
            if (data.species?.length) {
              try {
                const sp = await fetchWithRetry(data.species[0]);
                species = sp.data.result.properties.name || 'Unknown';
              } catch (spErr) {
                console.warn(`⚠️ Species fetch failed for ${id}: ${spErr.message}`);
              }
            } else {
              try {
                const allSpecies = await fetchWithRetry(`${SWAPI_BASE_URL}/species`);
                for (const sp of allSpecies.data.results) {
                  try {
                    const spDetail = await fetchWithRetry(sp.url);
                    const people = spDetail.data?.result?.properties?.people || [];
                    if (people.some((url) => url.endsWith(`/people/${id}`))) {
                      species = spDetail.data.result.properties.name || 'Unknown';
                      break;
                    }
                  } catch (spDetailErr) {
                    console.warn(`⚠️ Species detail fetch failed for ${sp.url}: ${spDetailErr.message}`);
                  }
                }
              } catch (allSpErr) {
                console.warn(`⚠️ All species fetch failed for ${id}: ${allSpErr.message}`);
              }
            }

            return {
              uid: id,
              name: data.name || 'Unknown',
              height: data.height || 'Unknown',
              mass: data.mass || 'Unknown',
              homeworld,
              species,
              films,
            };
          } catch (err) {
            console.error(`❌ Error fetching details for character ${id}:`, err.message);
            return {
              uid: id,
              name: char.name || 'Unknown',
              height: 'Unknown',
              mass: 'Unknown',
              homeworld: 'Unknown',
              species: 'Unknown',
              films: ['Unknown'],
            }; // Return partial data on error
          }
        })
      )
    );

    res.json({
      characters: detailed, // Keep all entries, even with partial data
      total_pages: returnAll ? 1 : totalPages,
      next: returnAll ? false : page < totalPages ? `/api/characters?page=${page + 1}` : null,
      previous: returnAll ? false : page > 1 ? `/api/characters?page=${page - 1}` : null,
    });
  } catch (err) {
    console.error('❌ API Error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server listening on http://localhost:${PORT}`);
});
