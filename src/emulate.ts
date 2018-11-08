

import { Browser, Page, ElementHandle, JSHandle, Target } from "puppeteer"
const puppeteerDevices = require('puppeteer/DeviceDescriptors');
const myDevices = require("./devices")
const devices = { ...puppeteerDevices, ...myDevices }



// TODO add other desktop devices
const emulatePage = async (page: Page, device: string) => {
  page.emulate(devices[device])
}

// TODO add other desktop devices
export const emulate = async (browser: Browser, device: string) => {
  const pages = await browser.pages()
  pages.forEach((page: Page) => emulatePage(page, device))
  browser.on('targetcreated', async (target: Target) => emulatePage(await target.page(), device))
}
