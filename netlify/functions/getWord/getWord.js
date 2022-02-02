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
    .eq('day', date);
  if (error) {
    console.log(error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: error,
      }),
    };
  }
  if (data) {
    console.log(data);
    return {
      statusCode: 200,
      body: JSON.stringify({
        data: data,
      }),
    };
  }
};
