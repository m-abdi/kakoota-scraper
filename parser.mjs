import fetch from 'node-fetch';
import { parse } from 'node-html-parser';

export async function cambridgeData(word) {
  const page = await fetch(
    `https://dictionary.cambridge.org/dictionary/english/${word}`
  );

  const document = parse(await page.text());
  word = document.querySelector('.headword').text;
  const blocks = document.querySelectorAll('.pr.entry-body__el');
  const data = [];
  for (const block of blocks) {
    const audios = block.querySelectorAll('source');
    const type = block.querySelector('.posgram.dpos-g.hdib.lmr-5').text;
    const d = { type, meanings: [] };
    const meanings = block.querySelectorAll('.def-block');
    for (const meaning of meanings) {
      const definition = meaning.querySelector('.def.ddef_d.db').text;
      const examples = meaning.querySelectorAll('.examp.dexamp');
      d.meanings.push({ definition, examples: examples.map((e) => e.rawText) });
    }
    const pronunciationArray = audios
      .filter((a) =>
        RegExp('.ogg').test(a.getAttribute('src')) ? false : true
      )
      .map((a) => 'https://dictionary.cambridge.org' + a.getAttribute('src'));
    const ph = block.querySelectorAll('.dpron-i');
    const phonetics = ph.map((p) => {
      const sourceTag = p.querySelector('source');
      const phonetic = p.text
          .replace(/\s\s+/g, ' ')
          .replace(/(\r\n|\n|\r)/gm, '')
          .replace("Your browser doesn't support HTML5 audio", '');
      const output = { phonetic, audio: null };
      if (sourceTag) {
        output.audio =
          'https://dictionary.cambridge.org' + sourceTag.getAttribute('src');
        output.accent = RegExp('uk_pron').test(output.audio)
          ? 'british'
          : RegExp('us_pron').test(output.audio) && 'american';
        }
      output.phonetic = output.phonetic
        .replace(/^us/, '')
        .replace(/^uk/, '')
        .replace(/\s\s+/g, ' ')
        .replace(" ", '');
      return output;
    });
    data.push({
      phonetics,
      ...d,
    });
  }
  return {data, word};
}
