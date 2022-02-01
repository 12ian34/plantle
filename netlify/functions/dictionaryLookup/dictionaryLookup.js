/* eslint-disable */
const fetch = require('node-fetch');

exports.handler = async function (event, context) {
  const { WORDSAPI_KEY } = process.env;

  const WORDSAPI_URL = 'https://wordsapiv1.p.rapidapi.com/words';
  const wordString = event.queryStringParameters.wordString;
  const WORDSAPI_WITH_WORD_URL = WORDSAPI_URL + '/' + wordString;

  try {
    const response = await fetch(WORDSAPI_WITH_WORD_URL, {
      method: 'GET',
      headers: {
        // Accept: 'application/json',
        'x-rapidapi-host': 'wordsapiv1.p.rapidapi.com',
        'x-rapidapi-key': WORDSAPI_KEY,
      },
    });

    if (!response.ok) {
      return { statusCode: response.status, body: response.statusText };
    }

    const data = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (err) {
    console.log(err); // output to netlify function log
    return {
      statusCode: 500,
      body: JSON.stringify({ msg: err.message }),
    };
  }
};
