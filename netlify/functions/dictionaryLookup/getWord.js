import { createClient } from '@supabase/supabase-js';

exports.handler = async function (event, context) {
  const supabaseUrl = 'https://tquifgekmzxqjckdafem.supabase.co';
  const SUPABASE_PLANTLE_PUBLIC_ANON_API_KEY = process.env;
  const supabase = createClient(
    supabaseUrl,
    SUPABASE_PLANTLE_PUBLIC_ANON_API_KEY
  );
  const date = event.queryStringParameters.date;

  try {
    let { data: plantle, error } = await supabase
      .from('plantle')
      .select('dailyWord')
      .eq('day', '2022-02-02');
    return data;
  } catch (err) {
    console.log(err);
  }
};
