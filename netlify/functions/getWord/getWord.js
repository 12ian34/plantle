const { createClient } = require('@supabase/supabase-js');

exports.handler = async function (event, context) {
  const supabaseUrl = 'https://tquifgekmzxqjckdafem.supabase.co';
  const SUPABASE_PLANTLE_PUBLIC_ANON_API_KEY =
    process.env.SUPABASE_PLANTLE_PUBLIC_ANON_API_KEY;
  const supabase = createClient(
    supabaseUrl,
    SUPABASE_PLANTLE_PUBLIC_ANON_API_KEY
  );
  const date = event.queryStringParameters.date;

  const { data, error } = await supabase
    .from('plantle')
    .select('dailyWord')
    .order('random')
    .limit(1);

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
    console.log(data);
    return {
      statusCode: 200,
      body: JSON.stringify({
        data: data[0].dailyWord,
      }),
    };
  } else {
    return {
      statusCode: 404,
      body: JSON.stringify({
        error: 'No words found',
      }),
    };
  }
};