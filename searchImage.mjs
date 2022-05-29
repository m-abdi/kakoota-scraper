import puppeteer from 'puppeteer';
import { parse } from 'node-html-parser';
import fs from 'fs';
export async function giveMeFirstImage(keyword) {
  const browser = await puppeteer.launch({
    headless: true,
  });

  const page = (await browser.pages())[0];
  await page.setViewport({ width: 1368, height: 768 });
  // login page
  await page.goto(
    `https://www.google.com/search?q=${keyword}&hl=fa&tbm=isch&source=hp&biw=1368&bih=768&ei=nJcUYo6dJIqua6K7s9gL&iflsig=AHkkrS4AAAAAYhSlrIHjVQYqlfgr1pTzZA9-lPchjCCk&ved=0ahUKEwiO26Sz65L2AhUK1xoKHaLdDLsQ4dUDCAY&uact=5&oq=book&gs_lcp=CgNpbWcQAzIFCAAQgAQyBQgAEIAEMgUIABCABDIFCAAQgAQyBQgAEIAEMgUIABCABDIFCAAQgAQyBQgAEIAEMgUIABCABDIFCAAQgAQ6CQgAEIAEEAoQAVDUA1jzCmCnDmgAcAB4AIABzwKIAdEJkgEFMi0yLjKYAQCgAQGqAQtnd3Mtd2l6LWltZ7ABAA&sclient=img`
  );
  const first_result = await page.waitForSelector('div.islrc > div', {
    timeout: Number(15000),
  });
  const results = await page.$$('div.islrc > div');
  results[0].click();
  let counter = 0;
  let resultIndex = 0;
  // await page.waitForTimeout(7000);
  // const root = await page.evaluate(()=> {
  //   return document.querySelector('html').outerHTML;
  // })
  // fs.writeFile("index.html", root.toString(), ()=>{})
  while (true) {
    await page.waitForTimeout(3000);
    const src = await page.evaluate(() => {
      const imges = document.querySelectorAll('a[rel="noopener"] > img');
      for (let i of imges) {
        let s = i.getAttribute('src');
        if (RegExp('^http').test(s)) {
          return s;
        }
      }
      return '...';
    });
    // await page.click('div > div > a > img', { button: 'right' });
    // await page.waitForTimeout(1000);
    // await page.keyboard.press('ArrowUp');
    // await page.waitForTimeout(1000);
    // await page.keyboard.press('ArrowUp');
    // await page.waitForTimeout(1000);
    // await page.keyboard.press('ArrowUp');
    // await page.waitForTimeout(1000);
    // await page.keyboard.press('Enter');
    // const src = await page.evaluate(() => navigator.clipboard.readText());
    const srcTest = RegExp('^http').test(src.toString());
    if (srcTest) {
      await browser.close();
      return src.toString();
    } else {
      if (counter > 1) {
        results[resultIndex + 1].click();
        resultIndex++;
        counter = 0;
        continue;
      }
      counter++;
      continue;
    }
  }
}
