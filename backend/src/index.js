// const express = require('express');
// const cors = require('cors');
// const axios = require('axios');
// require('dotenv').config();

// const app = express();
// const PORT = process.env.PORT || 5000;
// const SWAPI_BASE_URL = process.env.SWAPI_BASE_URL;

// app.use(cors());
// app.use(express.json());

// // Route to get all characters with pagination
// app.get('/api/characters/:id', async (req, res) => {
//   try {
//     console.log(`Fetching character with ID: ${req.params.id} at ${new Date().toISOString()}`);
//     const response = await axios.get(`${SWAPI_BASE_URL}/people/${req.params.id}`, { timeout: 10000 });
//     console.log('SWAPI Response (full):', JSON.stringify(response.data, null, 2));

//     if (!response.data.result?.properties) {
//       return res.status(404).json({ error: 'Character not found' });
//     }

//     const character = response.data.result.properties || {};

//     // Log raw properties
//     console.log('Raw character properties:', character);

//     // Homeworld handling
//     let homeworldName = character.homeworld || 'Unknown';
//     let homeworldDetails = {};
//     try {
//       if (typeof character.homeworld === 'string' && character.homeworld.startsWith('http')) {
//         const homeworldResponse = await axios.get(character.homeworld, { timeout: 10000 });
//         const hwData = homeworldResponse.data.result?.properties || {};
//         homeworldName = hwData.name || 'Unknown';
//         homeworldDetails = {
//           population: hwData.population || 'N/A',
//           climate: hwData.climate || 'N/A',
//           terrain: hwData.terrain || 'N/A'
//         };
//       } else {
//         console.log('Homeworld is a name; attempting fallback');
//         const planetsResponse = await axios.get(`${SWAPI_BASE_URL}/planets/`, { timeout: 10000 });
//         const allPlanets = planetsResponse.data.result || [];
//         const matchedPlanet = allPlanets.find(p => p.properties.name === character.homeworld);
//         if (matchedPlanet) {
//           homeworldDetails = {
//             population: matchedPlanet.properties.population || 'N/A',
//             climate: matchedPlanet.properties.climate || 'N/A',
//             terrain: matchedPlanet.properties.terrain || 'N/A'
//           };
//         }
//       }
//     } catch (homeworldErr) {
//       console.error('Homeworld fetch error:', homeworldErr.message);
//     }

//     // Species handling
//     let speciesName = 'Unknown';
//     let hasSpecies = false;
//     try {
//       const speciesValue = character.species;
//       console.log('Raw species value:', speciesValue);
//       if (Array.isArray(speciesValue) && speciesValue.length) {
//         const speciesResponse = await axios.get(speciesValue[0], { timeout: 10000 });
//         speciesName = speciesResponse.data.result?.properties.name || 'Unknown';
//         hasSpecies = true;
//       } else if (typeof speciesValue === 'string' && speciesValue.trim()) {
//         speciesName = speciesValue; // Use the provided string (e.g., "Human")
//         hasSpecies = true;
//       } else {
//         console.log('No direct species data; attempting fallback');
//         const speciesResponse = await axios.get(`${SWAPI_BASE_URL}/species/`, { timeout: 10000 });
//         console.log('Species API response:', JSON.stringify(speciesResponse.data, null, 2));
//         const allSpecies = speciesResponse.data.result || [];
//         const matchedSpecies = allSpecies.find(s => 
//           s.properties?.people?.some(personUrl => personUrl === character.url)
//         );
//         if (matchedSpecies) {
//           speciesName = matchedSpecies.properties.name;
//           hasSpecies = true;
//         }
//       }
//     } catch (speciesErr) {
//       console.error('Species fetch error:', speciesErr.message);
//     }

//     // Films handling
//     let films = [];
//     let hasFilms = false;
//     try {
//       const filmsArray = character.films || [];
//       console.log('Raw films URLs:', filmsArray);
//       if (Array.isArray(filmsArray) && filmsArray.length) {
//         films = await Promise.all(
//           filmsArray.map(async (filmUrl, index) => {
//             try {
//               console.log(`Fetching film ${index + 1}: ${filmUrl} at ${new Date().toISOString()}`);
//               const film = await axios.get(filmUrl, { timeout: 10000 });
//               await new Promise(resolve => setTimeout(resolve, 500));
//               return film.data.result.properties.title;
//             } catch (filmErr) {
//               console.error(`Film ${index + 1} fetch error: ${filmUrl} - ${filmErr.message}`);
//               return 'Failed to fetch title';
//             }
//           })
//         );
//         hasFilms = films.length > 0;
//       } else {
//         console.log('No film URLs found; attempting fallback');
//         const filmsResponse = await axios.get(`${SWAPI_BASE_URL}/films/`, { timeout: 10000 });
//         const allFilms = filmsResponse.data.result || [];
//         films = allFilms
//           .filter(film => film.properties.characters && film.properties.characters.includes(character.url))
//           .map(film => film.properties.title);
//         hasFilms = films.length > 0;
//       }
//     } catch (filmsErr) {
//       console.error('Films fetch error:', filmsErr.message);
//     }

//     res.json({
//       ...character,
//       homeworld: homeworldName,
//       homeworldDetails,
//       species: speciesName,
//       race: speciesName, // Alias for species
//       films: films, // Where they appear
//       hasFilms,
//       hasSpecies,
//     });
//   } catch (error) {
//     console.error('Overall error:', error.message);
//     res.status(500).json({ error: 'Failed to fetch character details' });
//   }
// });
// // Route to search characters by name
// app.get('/api/characters/search', async (req, res) => {
//   try {
//     const name = req.query.name;
//     if (!name) {
//       return res.status(400).json({ error: 'Name query parameter is required' });
//     }
//    const response = await axios.get(`${SWAPI_BASE_URL}/people?name=${name}`);
// console.log('SWAPI Search Response:', response.data); // Debug log
//     res.json(response.data);
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to search characters' });
//   }
// });

// // Route to get character details by ID
// app.get('/api/characters/:id', async (req, res) => {
//   try {
//     console.log(`Fetching character with ID: ${req.params.id} at ${new Date().toISOString()}`);
//     const response = await axios.get(`${SWAPI_BASE_URL}/people/${req.params.id}`);
//     console.log('SWAPI Response (full):', JSON.stringify(response.data, null, 2));

//     if (!response.data.result?.properties) {
//       return res.status(404).json({ error: 'Character not found' });
//     }

//     const character = response.data.result.properties || {};

//     // Log raw properties
//     console.log('Raw character properties:', character);

//     // Homeworld (handle URL or name)
//     let homeworldName = character.homeworld || 'Unknown';
//     let homeworldDetails = {};
//     try {
//       if (typeof character.homeworld === 'string' && character.homeworld.startsWith('http')) {
//         const homeworldResponse = await axios.get(character.homeworld);
//         const hwData = homeworldResponse.data.result?.properties || {};
//         homeworldName = hwData.name || 'Unknown';
//         homeworldDetails = {
//           population: hwData.population || 'N/A',
//           climate: hwData.climate || 'N/A'
//         };
//       } else {
//         console.log('Homeworld is a name; attempting fallback');
//         const planetsResponse = await axios.get(`${SWAPI_BASE_URL}/planets/`);
//         const allPlanets = planetsResponse.data.result || [];
//         const matchedPlanet = allPlanets.find(p => p.properties.name === character.homeworld);
//         if (matchedPlanet) {
//           homeworldDetails = {
//             population: matchedPlanet.properties.population || 'N/A',
//             climate: matchedPlanet.properties.climate || 'N/A'
//           };
//         }
//       }
//     } catch (homeworldErr) {
//       console.error('Homeworld fetch error:', homeworldErr.message);
//     }

//     // Species handling
//     let speciesName = 'Unknown';
//     let hasSpecies = false;
//     try {
//       const speciesValue = character.species;
//       console.log('Raw species value:', speciesValue);
//       if (Array.isArray(speciesValue) && speciesValue.length) {
//         const speciesResponse = await axios.get(speciesValue[0]);
//         speciesName = speciesResponse.data.result?.properties.name || 'Unknown';
//         hasSpecies = true;
//       } else if (typeof speciesValue === 'string' && speciesValue.trim()) {
//         speciesName = speciesValue; // Use "Human" if provided
//         hasSpecies = true;
//       } else if (Array.isArray(speciesValue) && !speciesValue.length) {
//         speciesName = 'Human'; // Default to Human for empty array
//         hasSpecies = true;
//       } else {
//         console.log('No species data found; attempting fallback');
//         const speciesResponse = await axios.get(`${SWAPI_BASE_URL}/species/`);
//         console.log('Species API response:', JSON.stringify(speciesResponse.data, null, 2));
//         const allSpecies = speciesResponse.data.result || [];
//         const matchedSpecies = allSpecies.find(s => s.properties?.people?.includes(character.url));
//         if (matchedSpecies) {
//           speciesName = matchedSpecies.properties.name;
//           hasSpecies = true;
//         } else {
//           speciesName = 'Human'; // Force Human as default for humans
//           hasSpecies = true;
//         }
//       }
//     } catch (speciesErr) {
//       console.error('Species fetch error:', speciesErr.message);
//     }

//     // Films handling
//     let films = [];
//     let hasFilms = false;
//     try {
//       const filmsArray = character.films || [];
//       console.log('Raw films URLs:', filmsArray);
//       if (Array.isArray(filmsArray) && filmsArray.length) {
//         films = await Promise.all(
//           filmsArray.map(async (filmUrl, index) => {
//             try {
//               console.log(`Fetching film ${index + 1}: ${filmUrl} at ${new Date().toISOString()}`);
//               const film = await axios.get(filmUrl, { timeout: 10000 });
//               await new Promise(resolve => setTimeout(resolve, 500));
//               return film.data.result.properties.title;
//             } catch (filmErr) {
//               console.error(`Film ${index + 1} fetch error: ${filmUrl} - ${filmErr.message}`);
//               return 'Failed to fetch title';
//             }
//           })
//         );
//         hasFilms = films.length > 0;
//       } else {
//         console.log('No film URLs found; attempting fallback');
//         const filmsResponse = await axios.get(`${SWAPI_BASE_URL}/films/`, { timeout: 10000 });
//         const allFilms = filmsResponse.data.result || [];
//         films = allFilms
//           .filter(film => film.properties.characters && film.properties.characters.includes(character.url))
//           .map(film => film.properties.title);
//         hasFilms = films.length > 0;
//       }
//     } catch (filmsErr) {
//       console.error('Films fetch error:', filmsErr.message);
//     }

//     res.json({
//       ...character,
//       homeworld: homeworldName,
//       homeworldDetails,
//       species: speciesName,
//       films,
//       hasFilms,
//       hasSpecies,
//     });
//   } catch (error) {
//     console.error('Overall error:', error.message);
//     res.status(500).json({ error: 'Failed to fetch character details' });
//   }
// });
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

// app.get('/api/characters', async (req, res) => {
//   try {
//     const page = parseInt(req.query.page) || 1;
//     const swapiUrl = `${SWAPI_BASE_URL}/people?page=${page}&limit=10`;

//     const response = await axios.get(swapiUrl);
//     const data = response.data;

//     // Extract page number from URL
//     const getPageFromUrl = (url) => {
//       if (!url) return null;
//       const urlObj = new URL(url);
//       const p = urlObj.searchParams.get('page');
//       return p ? parseInt(p) : null;
//     };

//     const total_records = data.total_records; // fixed
//     const total_pages = data.total_pages;     // from swapi.tech
//     const previous = getPageFromUrl(data.previous);
//     const next = getPageFromUrl(data.next);

//     res.json({
//       message: data.message || null,
//       total_records,
//       total_pages,
//       previous,
//       next,
//       current_page: page,
//       results: data.results
//     });
//   } catch (error) {
//     console.error('Error fetching paginated characters:', error.message);
//     res.status(500).json({ error: 'Failed to fetch characters' });
//   }
// });




// Route to search characters by name
// app.get('/api/characters/search', async (req, res) => {
//   try {
//     const name = req.query.name;
//     if (!name) {
//       return res.status(400).json({ error: 'Name query parameter is required' });
//     }
//     const response = await axios.get(`${SWAPI_BASE_URL}/people?name=${name}`);
//     res.json(response.data);
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to search characters' });
//   }
// });

// // Route to get character details by ID
// app.get('/api/characters/:id', async (req, res) => {
//   try {
//     console.log(`Fetching character with ID: ${req.params.id} at ${new Date().toISOString()}`);
//     const response = await axios.get(`${SWAPI_BASE_URL}/people/${req.params.id}`, { timeout: 10000 });
//     console.log('SWAPI Response (full):', JSON.stringify(response.data, null, 2));

//     if (!response.data.result?.properties) {
//       return res.status(404).json({ error: 'Character not found' });
//     }

//     const character = response.data.result.properties || {};

//     // Log raw properties
//     console.log('Raw character properties:', character);

//     // Homeworld (handle URL or name)
//     let homeworldName = character.homeworld || 'Unknown';
//     let homeworldDetails = {};
//     try {
//       if (typeof character.homeworld === 'string' && character.homeworld.startsWith('http')) {
//         const homeworldResponse = await axios.get(character.homeworld, { timeout: 10000 });
//         const hwData = homeworldResponse.data.result?.properties || {};
//         homeworldName = hwData.name || 'Unknown';
//         homeworldDetails = {
//           population: hwData.population || 'N/A',
//           climate: hwData.climate || 'N/A'
//         };
//       } else {
//         console.log('Homeworld is a name; attempting fallback');
//         const planetsResponse = await axios.get(`${SWAPI_BASE_URL}/planets/`, { timeout: 10000 });
//         const allPlanets = planetsResponse.data.result || [];
//         const matchedPlanet = allPlanets.find(p => p.properties.name === character.homeworld);
//         if (matchedPlanet) {
//           homeworldDetails = {
//             population: matchedPlanet.properties.population || 'N/A',
//             climate: matchedPlanet.properties.climate || 'N/A'
//           };
//         }
//       }
//     } catch (homeworldErr) {
//       console.error('Homeworld fetch error:', homeworldErr.message);
//     }

// // Species handling
// let speciesName = 'Unknown';
// let hasSpecies = false;

// try {
//   const speciesValue = character.species;
//   const normalizedCharUrl = character.url.replace(/\/$/, '').toLowerCase();
//   let nextPage = `${process.env.SWAPI_BASE_URL}/species`;
//   let matchedSpecies = null;

//   console.log('Raw species value:', speciesValue);
//   console.log('Starting full species search for character URL:', normalizedCharUrl);

//   // Step 1: Paginated species lookup
//   while (nextPage && !matchedSpecies) {
//     console.log('Fetching species page:', nextPage);
//     const speciesResponse = await axios.get(nextPage, { timeout: 10000 });
//     const speciesData = speciesResponse.data;
//     const allSpecies = speciesData.result || [];

//     for (const s of allSpecies) {
//       if (s.properties && Array.isArray(s.properties.people)) {
//         const normalizedPeople = s.properties.people.map(url => url.replace(/\/$/, '').toLowerCase());
//         const isMatch = normalizedPeople.includes(normalizedCharUrl);

//         if (isMatch) {
//           matchedSpecies = s;
//           console.log('✅ Match found in species:', s.properties.name, 'with people:', s.properties.people);
//           break;
//         }
//       }
//     }

//     nextPage = speciesData.next || null;
//   }

//   // Step 2: Assign matched species if found
//   if (matchedSpecies) {
//     speciesName = matchedSpecies.properties.name;
//     hasSpecies = true;
//     console.log('Assigned species name from match:', speciesName);
//   } else {
//     console.log('No species match found for URL:', normalizedCharUrl);

//     // Step 3: Check direct species URL if provided
//     if (Array.isArray(speciesValue) && speciesValue.length > 0 && speciesValue[0].startsWith('http')) {
//       try {
//         console.log('Attempting direct species URL:', speciesValue[0]);
//         const directSpeciesResponse = await axios.get(speciesValue[0], { timeout: 10000 });
//         const directSpeciesData = directSpeciesResponse.data.result?.properties;
//         console.log('Direct species data:', JSON.stringify(directSpeciesData, null, 2));

//         if (directSpeciesData?.name) {
//           speciesName = directSpeciesData.name;
//           hasSpecies = true;
//           console.log('✅ Direct species match found:', speciesName);
//         }
//       } catch (directErr) {
//         console.error('❌ Error fetching direct species URL:', directErr.message);
//       }
//     }

//     // Step 4: Fallback to "Human" if nothing matched
//     if (!hasSpecies && (!speciesValue || (Array.isArray(speciesValue) && speciesValue.length === 0))) {
//       speciesName = 'Human';
//       hasSpecies = true;
//       console.log('⚠️ Fallback applied — species set to Human');
//     }
//   }
// } catch (speciesErr) {
//   console.error('❌ Species fetch error:', speciesErr.message);
// }




//     // Films handling
//     let films = [];
//     let hasFilms = false;
//     try {
//       const filmsArray = character.films || [];
//       console.log('Raw films URLs:', filmsArray);
//       if (Array.isArray(filmsArray) && filmsArray.length) {
//         films = await Promise.all(
//           filmsArray.map(async (filmUrl, index) => {
//             try {
//               console.log(`Fetching film ${index + 1}: ${filmUrl} at ${new Date().toISOString()}`);
//               const film = await axios.get(filmUrl, { timeout: 10000 });
//               await new Promise(resolve => setTimeout(resolve, 500));
//               return film.data.result.properties.title;
//             } catch (filmErr) {
//               console.error(`Film ${index + 1} fetch error: ${filmUrl} - ${filmErr.message}`);
//               return 'Failed to fetch title';
//             }
//           })
//         );
//         hasFilms = films.length > 0;
//       } else {
//         console.log('No film URLs found; attempting fallback');
//         const filmsResponse = await axios.get(`${SWAPI_BASE_URL}/films/`, { timeout: 10000 });
//         const allFilms = filmsResponse.data.result || [];
//         films = allFilms
//           .filter(film => film.properties.characters && film.properties.characters.includes(character.url))
//           .map(film => film.properties.title);
//         hasFilms = films.length > 0;
//       }
//     } catch (filmsErr) {
//       console.error('Films fetch error:', filmsErr.message);
//     }

//     res.json({
//       ...character,
//       homeworld: homeworldName,
//       homeworldDetails,
//       species: speciesName,
//       films,
//       hasFilms,
//       hasSpecies,
//     });
//   } catch (error) {
//     console.error('Overall error:', error.message);
//     res.status(500).json({ error: 'Failed to fetch character details' });
//   }
// });





// const express = require('express');
// const cors = require('cors');
// const axios = require('axios');
// require('dotenv').config();

// const app = express();
// const PORT = process.env.PORT || 5000;
// const SWAPI_BASE_URL = process.env.SWAPI_BASE_URL;

// app.use(cors());
// app.use(express.json());

// // Route to get all characters with pagination



// app.get('/api/characters', async (req, res) => {
//   try {
//     const page = parseInt(req.query.page) || 1;
//     const search = req.query.search?.toLowerCase() || null;

//     const getPageFromUrl = (url) => {
//       if (!url) return null;
//       const urlObj = new URL(url);
//       const p = urlObj.searchParams.get('page');
//       return p ? parseInt(p) : null;
//     };

//     // If search query exists, fetch all pages and filter by name
//     if (search) {
//       let allCharacters = [];
//       let currentPage = 1;
//       let hasNext = true;

//       while (hasNext) {
//         const response = await axios.get(`${SWAPI_BASE_URL}/people?page=${currentPage}`);
//         allCharacters.push(...response.data?.results || []);
//         hasNext = !!response.data?.next;
//         currentPage++;
//       }

//       // Filter characters by name
//       const filtered = allCharacters.filter((char) =>
//         char.properties?.name?.toLowerCase().includes(search)
//       );

//       return res.json({
//         message: `Found ${filtered.length} result(s) for '${search}'`,
//         total_records: filtered.length,
//         total_pages: 1,
//         previous: null,
//         next: null,
//         current_page: 1,
//         results: filtered,
//       });
//     }

//     // If no search, use pagination as normal
//     const swapiUrl = `${SWAPI_BASE_URL}/people?page=${page}&limit=10`;
//     const response = await axios.get(swapiUrl);
//     const data = response.data;

//     res.json({
//       message: data.message || null,
//       total_records: data.total_records,
//       total_pages: data.total_pages,
//       previous: getPageFromUrl(data.previous),
//       next: getPageFromUrl(data.next),
//       current_page: page,
//       results: data.results,
//     });
//   } catch (error) {
//     console.error('Error fetching characters:', error.message);
//     res.status(500).json({ error: 'Failed to fetch characters' });
//   }
// });


// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

// app.get('/api/characters/:id', async (req, res) => {
//   const { id } = req.params;
//   try {
//     const characterRes = await axios.get(`${SWAPI_BASE_URL}/people/${id}`);
//     const character = characterRes.data?.result?.properties;
//     if (!character) return res.status(404).json({ error: 'Character not found' });

//     // Homeworld
//     let homeworld = 'Unknown';
//     if (character.homeworld?.startsWith('http')) {
//       const hwRes = await axios.get(character.homeworld);
//       homeworld = hwRes.data?.result?.properties?.name || 'Unknown';
//     }

//     // Films
//  let films = [];
//     let hasFilms = false;
//     try {
//       const filmsArray = character.films || [];
//       console.log('Raw films URLs:', filmsArray);
//       if (Array.isArray(filmsArray) && filmsArray.length) {
//         films = await Promise.all(
//           filmsArray.map(async (filmUrl, index) => {
//             try {
//               console.log(`Fetching film ${index + 1}: ${filmUrl} at ${new Date().toISOString()}`);
//               const film = await axios.get(filmUrl);
//               await new Promise(resolve => setTimeout(resolve, 500));
//               return film.data.result.properties.title;
//             } catch (filmErr) {
//               console.error(`Film ${index + 1} fetch error: ${filmUrl} - ${filmErr.message}`);
//               return 'Failed to fetch title';
//             }
//           })
//         );
//         hasFilms = films.length > 0;
//       } else {
//         console.log('No film URLs found; attempting fallback');
//         const filmsResponse = await axios.get(`${SWAPI_BASE_URL}/films/`);
//         const allFilms = filmsResponse.data.result || [];
//         films = allFilms
//           .filter(film => film.properties.characters && film.properties.characters.includes(character.url))
//           .map(film => film.properties.title);
//         hasFilms = films.length > 0;
//       }
//     } catch (filmsErr) {
//       console.error('Films fetch error:', filmsErr.message);
//     }


//     // Species - reverse lookup by matching people array
//     let speciesName = 'Unknown';
//     const allSpeciesRes = await axios.get(`${SWAPI_BASE_URL}/species`);
//     const allSpecies = allSpeciesRes.data?.results || [];

//     for (const species of allSpecies) {
//       const speciesDetails = await axios.get(species.url);
//       const people = speciesDetails.data?.result?.properties?.people || [];

//       if (people.some((url) => url.endsWith(`/people/${id}`))) {
//         speciesName = speciesDetails.data?.result?.properties?.name || 'Unknown';
//         break;
//       }
//     }

//     res.json({
//       name: character.name,
//       height: character.height,
//       mass: character.mass,
//       homeworld,
//       species: speciesName,
//       films
//     });
//   } catch (err) {
//     console.error('Character details fetch failed:', err.message);
//     res.status(500).json({ error: 'Failed to fetch character details' });
//   }
// });






const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const SWAPI_BASE_URL = process.env.SWAPI_BASE_URL;

app.use(cors());
app.use(express.json());

// Global cache for all characters
let allCharactersCache = [];
let cacheLoaded = false;

// Helper: Load all characters once and cache them
async function loadAllCharacters() {
  try {
    let characters = [];
    let url = `${SWAPI_BASE_URL}/people?page=1`;

    while (url) {
      const response = await axios.get(url);
      const data = response.data;
      if (!data || !data.results) break;

      characters = characters.concat(data.results);
      url = data.next; // next page url or null
    }

    // Add uid field to each for easier reference
    allCharactersCache = characters.map((char, index) => ({
      uid: index + 1,
      ...char,
    }));

    cacheLoaded = true;
    console.log(`✅ Loaded ${allCharactersCache.length} characters into cache`);
  } catch (err) {
    console.error('❌ Failed to load all characters:', err.message);
    cacheLoaded = false;
  }
}

// Load cache on startup
loadAllCharacters();

// Endpoint for list + search + pagination
app.get('/api/characters', async (req, res) => {
  try {
    const search = req.query.search?.toLowerCase() || '';
    const page = parseInt(req.query.page) || 1;
    const pageSize = 10;

    if (!cacheLoaded) {
      // If cache not loaded yet, try loading it now (or return error)
      await loadAllCharacters();
      if (!cacheLoaded) return res.status(500).json({ error: 'Cache loading failed, try again later' });
    }

    // Filter by search if given
    let filtered = allCharactersCache;
    if (search) {
      filtered = filtered.filter((char) =>
        char.name.toLowerCase().includes(search)
      );
    }

    // Paginate
    const start = (page - 1) * pageSize;
    const paginated = filtered.slice(start, start + pageSize);

    res.json({
      results: paginated,
      total: filtered.length,
      total_pages: Math.ceil(filtered.length / pageSize),
      current_page: page,
      next: start + pageSize < filtered.length ? page + 1 : null,
      previous: page > 1 ? page - 1 : null,
    });
  } catch (error) {
    console.error('Error in /api/characters:', error.message);
    res.status(500).json({ error: 'Failed to fetch characters' });
  }
});

app.get('/api/characters/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const characterRes = await axios.get(`${SWAPI_BASE_URL}/people/${id}`);
    const character = characterRes.data?.result?.properties;
    if (!character) return res.status(404).json({ error: 'Character not found' });

    // Homeworld
    let homeworld = 'Unknown';
    if (character.homeworld?.startsWith('http')) {
      const hwRes = await axios.get(character.homeworld);
      homeworld = hwRes.data?.result?.properties?.name || 'Unknown';
    }

  //     // Films handling
    let films = [];
    let hasFilms = false;
    try {
      const filmsArray = character.films || [];
      console.log('Raw films URLs:', filmsArray);
      if (Array.isArray(filmsArray) && filmsArray.length) {
        films = await Promise.all(
          filmsArray.map(async (filmUrl, index) => {
            try {
              console.log(`Fetching film ${index + 1}: ${filmUrl} at ${new Date().toISOString()}`);
              const film = await axios.get(filmUrl, { timeout: 10000 });
              await new Promise(resolve => setTimeout(resolve, 500));
              return film.data.result.properties.title;
            } catch (filmErr) {
              console.error(`Film ${index + 1} fetch error: ${filmUrl} - ${filmErr.message}`);
              return 'Failed to fetch title';
            }
          })
        );
        hasFilms = films.length > 0;
      } else {
        console.log('No film URLs found; attempting fallback');
        const filmsResponse = await axios.get(`${SWAPI_BASE_URL}/films/`, { timeout: 10000 });
        const allFilms = filmsResponse.data.result || [];
        films = allFilms
          .filter(film => film.properties.characters && film.properties.characters.includes(character.url))
          .map(film => film.properties.title);
        hasFilms = films.length > 0;
      }
    } catch (filmsErr) {
      console.error('Films fetch error:', filmsErr.message);
    }

    // Species
    let speciesName = 'Unknown';
    const allSpeciesRes = await axios.get(`${SWAPI_BASE_URL}/species`);
    const allSpecies = allSpeciesRes.data?.results || [];

    for (const species of allSpecies) {
      const speciesDetails = await axios.get(species.url);
      const people = speciesDetails.data?.result?.properties?.people || [];

      if (people.some((url) => url.endsWith(`/people/${id}`))) {
        speciesName = speciesDetails.data?.result?.properties?.name || 'Unknown';
        break;
      }
    }

    res.json({
      name: character.name,
      height: character.height,
      mass: character.mass,
      homeworld,
      species: speciesName,
      films,
    });
  } catch (err) {
    console.error('Character details fetch failed:', err.message);
    res.status(500).json({ error: 'Failed to fetch character details' });
  }
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
