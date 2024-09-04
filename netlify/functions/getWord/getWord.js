const { createClient } = require('@supabase/supabase-js');

exports.handler = async function (event, context) {
  const supabaseUrl = 'https://tquifgekmzxqjckdafem.supabase.co';
  const SUPABASE_PLANTLE_PUBLIC_ANON_API_KEY = process.env.SUPABASE_PLANTLE_PUBLIC_ANON_API_KEY;
  const supabase = createClient(supabaseUrl, SUPABASE_PLANTLE_PUBLIC_ANON_API_KEY);
  
  const date = event.queryStringParameters.date;

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
      console.log(error);
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

      return {
        statusCode: 200,
        body: JSON.stringify({
          data: [{ dailyWord }],
        }),
      };
    } else {
      return {
        statusCode: 404,
        body: JSON.stringify({
          error: 'No words found in the database.',
        }),
      };
    }
  } catch (err) {
    console.log('Error:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Internal Server Error',
        message: err.message,
      }),
    };
  }
};
