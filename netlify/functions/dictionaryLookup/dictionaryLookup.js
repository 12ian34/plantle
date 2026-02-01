const fetch = require('node-fetch');

const logEvent = (level, message, context = {}) => {
  const payload = {
    level,
    message,
    timestamp: new Date().toISOString(),
    ...context,
  };
  console[level](JSON.stringify(payload));
};

exports.handler = async function (event, context) {
  const wordString = event.queryStringParameters.wordString;
  const DICTIONARY_API_URL = `https://api.dictionaryapi.dev/api/v2/entries/en/${wordString}`;

  logEvent('info', 'dictionaryLookup:request', { wordString });
  if (!wordString) {
    logEvent('warn', 'dictionaryLookup:missingWord');
  }

  try {
    const response = await fetch(DICTIONARY_API_URL, {
      method: 'GET',
    });

    if (!response.ok) {
      logEvent('warn', 'dictionaryLookup:badResponse', {
        wordString,
        status: response.status,
      });
      return { statusCode: response.status, body: response.statusText };
    }

    const data = await response.json();

    logEvent('info', 'dictionaryLookup:success', { wordString });
    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (err) {
    logEvent('error', 'dictionaryLookup:error', {
      wordString,
      message: err.message,
    });
    return {
      statusCode: 500,
      body: JSON.stringify({ msg: err.message }),
    };
  }
};
