import { Browser, Page, ElementHandle, JSHandle, Target, Request } from "puppeteer"




const abortPageRequests = async (page: Page, types = [], url: RegExp ) => {
  if (!page) return
  await page.setRequestInterception(true);
  page.on('request', (req: Request) => {
    if (types.some(x => x === req.resourceType()) || req.url().match(url))
      req.abort();
    else
      req.continue();
  });
}

export const abort = async (browser: Browser, types = [], url = "/.*/") => {
  const regex = new RegExp(url)
  const pages = await browser.pages()
  pages.forEach((page: Page) => abortPageRequests(page, types, regex))
  browser.on('targetcreated', async (target: Target) => abortPageRequests(await target.page(), types, regex))
}
