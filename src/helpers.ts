import { Browser, Page, ElementHandle, JSHandle, Target } from "puppeteer"
const puppeteerDevices = require('puppeteer/DeviceDescriptors');
const myDevices = require("./devices")
const devices = { ...puppeteerDevices, ...myDevices }


export const waitForLoad = (page: Page) => new Promise((res) => {
  page.once('request', (req) => {
    setTimeout(() => page.once("request",
      () => setTimeout(
        () => res(), 600)), 600)
  })
  setTimeout(() => res(), 2500)
})


 const abortPageRequests = async (page: Page, types = []) => {
  await page.setRequestInterception(true);
  page.on('request', req => {
    if (types.some(x => x === req.resourceType()))
      req.abort();
    else
      req.continue();
  });
}

export const abortBrowserRequests = async (browser: Browser, types = []) => {
  const pages = await browser.pages()
  pages.forEach((page: Page) => abortPageRequests(page, types))
  browser.on('targetcreated', async (target: Target) => abortPageRequests(await target.page(), types))
}

// TODO add other desktop devices
 const emulatePage = async (page: Page, device: string) => {
  page.emulate(devices[device])
}

// TODO add other desktop devices
export const emulateBrowser = async (browser: Browser, device: string) => {
  const pages = await browser.pages()
  pages.forEach((page: Page) => emulatePage(page, device))
  browser.on('targetcreated', async (target: Target) => emulatePage(await target.page(), device))
}


export const findElement = async (page: Page, selector = "div", regex: string = "/.*/", ): Promise<ElementHandle | null> => {
  // logger(regex)
  await page.waitForSelector(selector)
  const elements: ElementHandle[] = await page.$$(selector)
  // logger(elements.length)
  if (elements.length < 1) return null
  for (let element of elements) {
    let inner: string = (await getContent(element)) || ""
    // logger("inner: " + inner)
    // if (!inner) return null
    //  debug(inner.trim())
    if (new RegExp(regex).test(inner.trim())) {
      // debug(inner, ", findElement");
      return element
    }
  }
  return null
}


export const getContent = async (element: ElementHandle): Promise<string> => {
  const inner = await element.getProperty("textContent")
  if (!inner) return ""
  return (await inner.jsonValue()).trim()
}


export const getAttribute = async (page: Page, element: ElementHandle, attribute: string): Promise<string> => {
  const value = await page.evaluate((element, attribute) => element.attribute, element, attribute);
  return value
}
