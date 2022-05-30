import fetch from 'node-fetch';
import { parse } from 'node-html-parser';

export async function cambridgeData(word) {
  const page = await fetch(
    `https://dictionary.cambridge.org/dictionary/english/${word}`
  );

  const document = parse(await page.text());

  const blocks = document.querySelectorAll('.pr.entry-body__el');
  const data = [];
  for (const block of blocks) {
    const audios = block.querySelectorAll(
      "source"
    );
    const type = block.querySelector('.posgram.dpos-g.hdib.lmr-5').text;
    const d = { type, meanings: [] };
    const meanings = block.querySelectorAll('.def-block');
    for (const meaning of meanings) {
      const definition = meaning.querySelector('.def.ddef_d.db').text;
      const examples = meaning.querySelectorAll('.examp.dexamp');
      d.meanings.push({ definition, examples: examples.map((e) => e.rawText) });
    }
    const pronunciationArray = audios.filter((a) =>
        RegExp(".ogg").test(a.getAttribute("src")) ? false : true
      ).map((a) =>  "https://dictionary.cambridge.org" +  a.getAttribute("src"))
    data.push({
      pronunciation: {
        "british": pronunciationArray.filter((p)=> RegExp("uk_pron").test(p))[0],
        "american": pronunciationArray.filter((p)=> RegExp("us_pron").test(p))[0],
      } ,
      ...d,
    });
  }
  return data
}
