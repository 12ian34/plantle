const fetch = require('node-fetch');

exports.handler = async function (event, context) {
  const wordString = event.queryStringParameters.wordString;
  const DICTIONARY_API_URL = `https://api.dictionaryapi.dev/api/v2/entries/en/${wordString}`;

  // log searched word in Netlify
  console.log(wordString);

  try {
    const response = await fetch(DICTIONARY_API_URL, {
      method: 'GET',
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
    console.log('Error fetching word data');
    console.log(err); // output to Netlify function log
    return {
      statusCode: 500,
      body: JSON.stringify({ msg: err.message }),
    };
  }
};
