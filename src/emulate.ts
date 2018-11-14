

import { Browser, Page, ElementHandle, JSHandle, Target } from "puppeteer"
const puppeteerDescriptors = require('puppeteer/DeviceDescriptors');
const { descriptors, options } = require("./devices")
const devices = { ...puppeteerDescriptors, ...descriptors }


// TODO add other desktop devices
const emulatePage = async (page: Page, device: string) => {
  await page.emulate(devices[device])

}

// TODO add other desktop devices
export const emulate = async (browser: Browser, device: string ) => {
  if (!descriptors[device]) return false
  const pages = await browser.pages()
  pages.forEach((page: Page) => emulatePage(page, device))
  await browser.on('targetcreated', async (target: Target) => await emulatePage(await target.page(), device))
  return true
}
