import { Browser, Page, ElementHandle, JSHandle, Target, Request } from "puppeteer"


const abortPageRequests = async (page: Page, types = [] ) => {
  if (!page) return
  await page.setRequestInterception(true);
  page.on('request', (req: Request) => {
    if (types.some(x => x === req.resourceType()) )
      req.abort();
    else
      req.continue();
  });
}

export const abort = async (browser: Browser, types = []) => {
  const pages = await browser.pages()
  pages.forEach((page: Page) => abortPageRequests(page, types))
  browser.on('targetcreated', async (target: Target) => abortPageRequests(await target.page(), types))
}
