import { cambridgeData } from './parser.mjs';
import { giveMeFirstImage } from './searchImage.mjs';

const words = ['programming']
async function getData()  {
  for (const word of words) {
    try {
      const image = await giveMeFirstImage(word);
      const dictionaryData = await cambridgeData(word);
      console.log(dictionaryData, null, 2);
      console.log(image);
    } catch (e) {
      console.log('Error on word:', word);
      console.log(e.message);
      continue;
    }
  }
}

getData()
