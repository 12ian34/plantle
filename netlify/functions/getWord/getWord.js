const { createClient } = require('@supabase/supabase-js');

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
  const supabaseUrl = 'https://tquifgekmzxqjckdafem.supabase.co';
  const SUPABASE_PLANTLE_PUBLIC_ANON_API_KEY = process.env.SUPABASE_PLANTLE_PUBLIC_ANON_API_KEY;
  const supabase = createClient(supabaseUrl, SUPABASE_PLANTLE_PUBLIC_ANON_API_KEY);

  const date = event.queryStringParameters.date;
  logEvent('info', 'getWord:request', { date });
  if (!date) {
    logEvent('warn', 'getWord:missingDate');
  }

  // Simple hash function to convert the date into an index
  const hashDateToIndex = (date, wordCount) => {
    let hash = 0;
    for (let i = 0; i < date.length; i++) {
      hash = date.charCodeAt(i) + ((hash << 5) - hash); // simple hash calculation
      hash = hash & hash; // convert to 32-bit integer
    }
    return Math.abs(hash) % wordCount; // return index within wordCount range
  };

  try {
    // Fetch all words from the database
    const { data, error } = await supabase.from('plantle').select('dailyWord');

    if (error) {
      logEvent('error', 'getWord:supabaseError', {
        message: error.message,
      });
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: error.message,
        }),
      };
    }

    if (data && data.length > 0) {
      const wordCount = data.length;
      const wordIndex = hashDateToIndex(date, wordCount); // determine word based on date
      const dailyWord = data[wordIndex].dailyWord; // pick the word

      logEvent('info', 'getWord:success', { date, wordIndex, wordCount });
      return {
        statusCode: 200,
        body: JSON.stringify({
          data: [{ dailyWord }],
        }),
      };
    } else {
      logEvent('warn', 'getWord:noWords', { date });
      return {
        statusCode: 404,
        body: JSON.stringify({
          error: 'No words found in the database.',
        }),
      };
    }
  } catch (err) {
    logEvent('error', 'getWord:exception', { message: err.message });
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Internal Server Error',
        message: err.message,
      }),
    };
  }
};
