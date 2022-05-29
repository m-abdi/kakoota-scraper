import { giveMeFirstImage } from './searchImage.mjs';
import { cambridgeData } from './parser.mjs';

const words = ['programming']
async function getData()  {
  for (const word of words) {
    try {
      const image = await giveMeFirstImage(word);
      const dictionaryData = await cambridgeData(word);
      console.log(JSON.stringify(dictionaryData));
      console.log(image);
    } catch (e) {
      console.log('Error on word:', word);
      console.log(e.message);
      continue;
    }
  }
}

getData()
