import { giveMeFirstImage } from './searchImage.mjs';
import { cambridgeData } from './parser.mjs';
import fetch from 'node-fetch';
const words = [{ w: 'programming', l: 'en' }];
async function getData() {
  for (const word of words) {
    try {
      const picture_url = await giveMeFirstImage(word.w);
      const dictionaryData = await cambridgeData(word.w);
      const apiResp = await fetch(process.env.FRONT_URL + '/api/newTest', {
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
        body: JSON.stringify({
          picture_url,
          word: word.w,
          data: dictionaryData,
          language: word.l,
          token: process.env.FRONT_END_API_TOKEN,
        }),
      });
      if (apiResp.ok) {
        console.log('success');
      } else {
        console.log('error');
      }
    } catch (e) {
      console.log('Error on word:', word);
      console.log(e.message);
      continue;
    }
  }
}

getData();
