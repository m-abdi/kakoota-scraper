import 'dotenv/config';

import fetch from 'node-fetch';
import fs from 'fs';

const words = JSON.parse(fs.readFileSync('./words_dictionary.json', 'utf8'));
// let remained = [...Object.keys(words)];
console.log('started');
try {
  for (const word of Object.keys(words)) {
    const apiResp = await fetch(process.env.FRONT_URL + '/api/toBeScraped/', {
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
      body: JSON.stringify({ word, token: process.env.FRONT_END_API_TOKEN }),
    });

    // console.log(apiResp.status);
    // if (!apiResp.ok){
    //   console.log(await apiResp.text());
    // }
    // remained = remained.filter((r) => r !== word);
    // fs.writeFileSync('./all-words.json', JSON.stringify(remained), {
    //   encoding: 'utf8',
    // });
  }
} catch (e) {
  console.log(e.message);
}
