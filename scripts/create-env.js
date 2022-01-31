const fs = require('fs');
fs.writeFileSync('./.env', `WORDSAPI_KEY=${process.env.WORDSAPI_KEY}\n`);
console.log(process.env.WORDSAPI_KEY);
