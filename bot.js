import 'dotenv/config';

import { cambridgeData } from './parser.js';
import fetch from 'node-fetch';
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

async function getData() {
  const browser = await luanchBrowser();

  while (true) {
    const page = await browser.newPage();
    const word = await getNextWord();
    try {
      const { data, word: dictionaryWord } = await cambridgeData(word);
      const picture_url = await giveMeFirstImage(
        dictionaryWord + ' ' + 'picture',
        browser,
        page
      );
      console.log(picture_url);
      const apiResp = await fetch(process.env.FRONT_URL + '/api/newTest/', {
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
        await deleteWord(word);
      } else {
        console.log('api error');
      }
    } catch {
      await deleteWord(word);
      console.log('error on word:  ' + word);
      await page.close();

      continue;
    }
    await page.close();
  }
}

async function getNextWord() {
  const w = await (
    await fetch(process.env.FRONT_URL + '/api/toBeScraped/', {
      headers: { 'Content-Type': 'application/json' },
    })
  ).json();
  return w.word;
}

async function deleteWord(word) {
  const resp = await fetch(
    process.env.FRONT_URL + `/api/toBeScraped/?word=${word}`,
    {
      headers: { 'Content-Type': 'application/json' },
      method: 'DELETE',
      body: JSON.stringify({
        token: process.env.FRONT_END_API_TOKEN,
      }),
    }
  );
}

getData();
