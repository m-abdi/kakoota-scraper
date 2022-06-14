import 'dotenv/config';

import { cambridgeData } from './parser.js';
import fetch from 'node-fetch';
import fs from 'fs';
import { giveMeFirstImage } from './searchImage.js';
import puppeteer from 'puppeteer';

async function luanchBrowser() {
  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/google-chrome',
    headless: true,
    args: ['--no-sandbox'],
    timeout: 40000,
  });

  return browser;
}

try {
  while (true) {
    const words = JSON.parse(fs.readFileSync('./remained.json', 'utf8'));
    try {
      getData(words);
      break;
    } catch (e) {
      console.log(e);
      continue;
    }
  }
} catch {
  while (true) {
    const words = JSON.parse(fs.readFileSync('./all-words.json', 'utf8'));
    try {
      getData(words);
      break;
    } catch (e) {
      console.log(e);
      continue;
    }
  }
}
async function getData(words) {
  let remained = [...words];
  const browser = await luanchBrowser();

  const page = await browser.newPage();
  for (const word of words) {
    try {
      const { data, word: dictionaryWord } = await cambridgeData(word);
      const picture_url = await giveMeFirstImage(
        dictionaryWord + ' ' + 'picture',
        browser,
        page
      );
      console.log(picture_url);
      const apiResp = await fetch(process.env.FRONT_URL + '/api/newTest', {
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
        body: JSON.stringify({
          picture_url,
          word: dictionaryWord,
          data,
          language: 'en',
          token: process.env.FRONT_END_API_TOKEN,
        }),
      });
      if (apiResp.ok) {
        console.log('success' + ' ' + word);
        remained = remained.filter((r) => r !== word);
        // fs.writeFileSync(
        //   './remained.json',
        //   JSON.stringify(remained), {encoding: "utf8"}
        // );
      } else {
        console.log('api error');
      }
    } catch {
      remained = remained.filter((r) => r !== word);
      // fs.writeFileSync(
      //   './remained.json',
      //   JSON.stringify(remained), {encoding: "utf8"}

      // );
      console.log('error on word:  ' + word);
      continue;
    }
  }
  await browser.close();
}
