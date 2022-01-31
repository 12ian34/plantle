// const fetch = require('node-fetch');

// const STRAVA_CLIENT_SECRET = process.env.WORDSAPI_KEY;

// exports.handler = async function (event, word) {
//   const WORDSAPI = 'https://wordsapiv1.p.rapidapi.com/words/' + word;
//   const response = await fetch(WORDSAPI);
//   const data = await response.json();

//   return {
//     statusCode: 200,
//     body: JSON.stringify({
//       pokemon: data.pokemon_entries,
//     }),
//   };
// };

// fetch('' + wordString, {
//   method: 'GET',
//   headers: {
//     'x-rapidapi-host': 'wordsapiv1.p.rapidapi.com',
//     'x-rapidapi-key': process.env.WORDSAPI_KEY,
//   },
// }).then((response) => response.json());
