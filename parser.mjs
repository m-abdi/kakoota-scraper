import { parse } from 'node-html-parser';
import fetch from 'node-fetch';

export async function cambridgeData(word) {
  const page = await fetch(
    `https://dictionary.cambridge.org/dictionary/english/${word}`
  );

  const document = parse(await page.text());

  const blocks = document.querySelectorAll('.pr.entry-body__el');
  const data = [];
  for (const block of blocks) {
    const type = block.querySelector('.posgram.dpos-g.hdib.lmr-5').text;
    const d = { type, meanings: [] };
    const meanings = block.querySelectorAll('.def-block');
    for (const meaning of meanings) {
      const definition = meaning.querySelector('.def.ddef_d.db').text;
      const examples = meaning.querySelectorAll('.examp.dexamp');
      d.meanings.push({ definition, examples: examples.map((e) => e.rawText) });
    }
    data.push(d);
  }
  return data
}
