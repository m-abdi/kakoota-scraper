import { giveMeFirstImage } from './searchImage.mjs';
import { cambridgeData } from './parser.mjs';
import fetch from 'node-fetch';
import fs from "fs"
import "dotenv/config"
// const words = [{ w: 'programming', l: 'en' }];
const words = JSON.parse(fs.readFileSync('./all-words.json', 'utf8'));
let done = []
async function getData() {
  for (const word of words) {
    try {
      const picture_url = await giveMeFirstImage(word);
      const dictionaryData = await cambridgeData(word);
      const apiResp = await fetch(process.env.FRONT_URL + '/api/newTest', {
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
        body: JSON.stringify({
          picture_url,
          word: word,
          data: dictionaryData,
          language: "en",
          token: process.env.FRONT_END_API_TOKEN,
        }),
      });
      if (apiResp.ok) {
        console.log('success');
        done.push(word)
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
