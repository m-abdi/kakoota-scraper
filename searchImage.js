import fs from 'fs';
import { parse } from 'node-html-parser';
import puppeteer from 'puppeteer';
export async function giveMeFirstImage(keyword, browser, page) {
  
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
  const startTime = Date.now()
  while (true) {
    if (Date.now() > startTime + 3 * 60 * 1000) {
      throw "too long waiting"
    }
    await page.waitForTimeout(1000);
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
    const srcTest = RegExp('^http').test(src.toString());
    if (srcTest) {
      return src.toString();
    } else {
      if (counter > 3) {
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
