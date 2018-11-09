import { Browser, Page, ElementHandle, JSHandle, Target, Response } from "puppeteer"




const redirectPageRequests = async (page: Page, types = [], url: RegExp) => {
  await page.setRequestInterception(true);
  page.on('response', (res: Response, []) => {
    if (types.some(x => x === (res.request()).resourceType()) &&
       res.url().match(url)) { console.log(res.json()) }
  });
}

export const redirect = async (browser: Browser, types = [], url = "/.*/") => {
  const regex = new RegExp(url)
  const pages = await browser.pages()
  pages.forEach((page: Page) => redirectPageRequests(page, types, regex))
  browser.on('targetcreated', async (target: Target) => redirectPageRequests(await target.page(), types, regex))
}
