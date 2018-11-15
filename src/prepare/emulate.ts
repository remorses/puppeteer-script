

import { Browser, Page, ElementHandle, JSHandle, Target } from "puppeteer"
const puppeteerDescriptors = require('puppeteer/DeviceDescriptors');
import * as  descriptors  from "./devices"
const devices = { ...puppeteerDescriptors, ...descriptors }
const logger = console.log

// TODO add other desktop devices
export const emulatePage = async (page: Page, device: string) => {
  if (!page) logger("no page in emualtePage"); return page//throw new Error("there is not page ")
  await page.emulate(devices[device])
  await page.setUserAgent(devices[device].userAgent)
  return page
}

// TODO add other desktop devices
export const emulate = async (browser: Browser, device: string ) => {
  if (!descriptors[device]) throw new Error("can't find descriptor for device " + device)
  const pages = await browser.pages()
  await Promise.all(pages.map((page: Page) => emulatePage(page, device)))
  await browser.on('targetcreated', async (target: Target) => await emulatePage(await target.page(), device))
  return
}
