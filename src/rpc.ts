import * as fs from "mz/fs"
import { Browser, Page, ElementHandle, JSHandle, Target } from "puppeteer"
import { join } from "path"
import { solveCaptcha } from "./anticaptcha/solveCaptcha";
const puppeteerDevices = require('puppeteer/DeviceDescriptors');
const myDevices = require("./devices")
const devices = { ...puppeteerDevices, ...myDevices }


export default (browser: Browser, page: Page, logger: any, ) => ({

  "executable": (x: any) => x, // do nothing, already handled

  "headless": (x: any) => x,

  "abort": (resources = []) => abortBrowserRequests(browser, resources),

  "emulate": (device: string) => emulateBrowser(browser, device),


  "do": {

    // TODO create interface
    "click": (page: Page) => async (arg: ObjArg | string) => {
      if (typeof arg === "object") {
        const { selector = "", containing = "", ...options } = arg;
        const element = await findElement(page, <string>selector, <string>containing)
        if (!element) throw new Error("no element")
        return await element.click()
      } else {
        return page.click(arg)
      }
    },

    "type": async (arg: ObjArg | string) => {
      if (typeof arg === "object") {
        const { selector, containing, ...options } = arg;
        const element = await findElement(page, <string>selector, <string>containing)
        if (!element) throw new Error("no element")
        return await element.click()
      } else {
        return page.keyboard.type(arg)
      }
    },

    "press": (button: string) => page.keyboard.press(button),

    "new page": (url = "") => browser.newPage().then(page => page.goto(url)),

    "go to": (url = "") => page.goto(url),

    "wait": (time = 0) => time ? page.waitFor(time) : waitForLoad(page),

    "echo": (text = "") => logger(text),

    "close page": async (index = -1) => {
      const pages = await browser.pages()

      if (index < 0) {
        return pages[pages.length + index].close()
      } else {
        const newPage = await changedPage(browser)
        await pages[index].close()
        return await newPage
      }
    },

    "target page": async (index = -1) => {
      const pages = await browser.pages()
      if (index < 0) {
        return pages[pages.length + index].bringToFront()
      } else {
        await pages[index].bringToFront();
        return pages[index]
      }
    },

    "screenshot": (path: "./screen.jpg") => page.screenshot({ path }),

    "inject": (path: "./file.js") => {
      const file = fs.readFileSync(join(__dirname, path), 'utf8')
      return page.evaluate(file)
    },

    "evaluate": (code = "") => page.evaluate(code),


    "set user agent": (path: "./file.js") => {
      const file = fs.readFileSync(join(__dirname, path), 'utf8')
      return page.setUserAgent(file)
    },
    "set cookies": (path: "./file.js") => {
      const file = require(path)
      return page.setCookie(...file)
    },

    "export html": async (path: "./file.html") => {
      const content = await page.content()
      return await fs.writeFile(path, content)
    },

    "solve nocaptcha": async (selector: string) => {
      const element = await findElement(page, selector)
      if (!element) throw new Error("can't find nocaptcha element")
      const captcha: ElementHandle = element
      const sitekey = await getAttribute(page, captcha, "data-sitekey")
      return await solveCaptcha(browser, page, sitekey, { proxy: true })
    }
  }

})


const waitForLoad = (page: Page) => new Promise((resolve) => {
  page.on('request', (req) => {
    setTimeout(() => resolve("timeOut"), 600)
  })
  setTimeout(() => resolve("timeOut"), 2500)
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

const abortBrowserRequests = async (browser: Browser, types = []) => {
  const pages = await browser.pages()
  pages.forEach((page: Page) => abortPageRequests(page, types))
  browser.on('targetcreated', async (target: Target) => abortPageRequests(await target.page(), types))
}

// TODO add other desktop devices
const emulatePage = async (page: Page, device: string) => {
  page.emulate(devices[device])
}

// TODO add other desktop devices
const emulateBrowser = async (browser: Browser, device: string) => {
  const pages = await browser.pages()
  pages.forEach((page: Page) => emulatePage(page, device))
  browser.on('targetcreated', async (target: Target) => emulatePage(await target.page(), device))
}


// TODO regex
const findElement = async (page: Page, selector = "div", regex: string  = "/.*/", ): Promise<ElementHandle | null> => {
  await page.waitForSelector(selector)
  const elements: ElementHandle[] = await page.$$(selector)
  if (elements.length < 1) return null
  for (let element of elements) {
    let inner = await getContent(element)
    if (!inner) return null
    //  debug(inner.trim())
    if (new RegExp(regex).test(inner.trim())) {
      // debug(inner, ", findElement");
      return element
    }
  }
  return null
}


const getContent = async (element: ElementHandle): Promise<string | null> => {
  const inner = await element.getProperty("textContent")
  if (!inner) return null
  return (await inner.jsonValue()).trim()
}


export const getAttribute = async (page: Page, element: ElementHandle, attribute: string): Promise<string> => {
  const value = await page.evaluate((element, attribute) => element.attribute, element, attribute);
  return value
}


interface ObjArg {
  [key: string]: string | number | boolean | RegExp
}


const changedPage =  async (browser: Browser) => {
    return new Promise(x =>
        browser.on('targetchanged', async target => {
            if (target.type() === 'page') {
              x(await target.page())

            }
        })
    );
};
