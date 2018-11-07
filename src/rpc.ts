import * as fs from "mz/fs"
import { Browser, Page, ElementHandle, JSHandle, Target } from "puppeteer"
import { join } from "path"
import { solveCaptcha } from "./anticaptcha/solveCaptcha";
const devices = require('puppeteer/DeviceDescriptors');



export default (browser: Browser, page: Page, logger: any, ) => ({

  "executable": (x: any) => x, // TODO launch the browser with right exec,

  "abort": (resources = []) => abortBrowserRequests(browser, resources),

  "emulate": (device: string) => emulate(browser, page, device),


  "do": {

    // TODO create interface
    "click": async (arg: Object | string) => {
      if (typeof arg === "object") {
        const { selector, containing, ...options } = arg;
        const element = await findElement(page, selector, containing)
        if (!element) throw new Error("no element")
        return await element.click(...options)
      } else {
        return page.click(arg)
      }
    },

    "type": async (arg: Object | string) => {
      if (typeof arg === "object") {
        const { selector, containing, ...options } = arg;
        const element = await findElement(page, selector, containing)
        if (!element) throw new Error("no element")
        return await element.click(...options)
      } else {
        return page.keyboard.type(arg)
      }
    },

    "new page": (url = "") => browser.newPage().then(page => page.goto(url)),

    "go to": (url = "") => page.goto(url),

    "wait": (time = 0) => time ? page.waitFor(time) : waitForLoad(page),

    "echo": (text = "") => logger(text),

    "close page": async (index = -1) => {
      const pages = await browser.pages()
      if (index < 0) {
        return pages[pages.length + index].close()
      } else {
        return pages[index].close()
      }
    },

    "target page": async (index = -1) => {
      const pages = await browser.pages()
      if (index < 0) {
        return pages[pages.length + index].bringToFront()
      } else {
        return pages[index].bringToFront()
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
  pages.forEach( (page: Page) =>   abortPageRequests(page, types))
  browser.on('targetcreated',async (target: Target) => abortPageRequests(await target.page(), types) )
}

// TODO add other desktop devices
const  emulate = async(browser: Browser, page: Page, device: string) => {
  page.emulate(devices[device])
}

// TODO regex
const findElement = async (page: Page, selector = "div", content: string | RegExp = /.*/,  ): Promise<ElementHandle | null> => {
  await page.waitForSelector(selector)
  const elements: ElementHandle[] = await page.$$(selector)
  if (elements.length < 1) return null
  for (let element of elements) {
    let inner = await getContent(element)
    //  debug(inner.trim())
    if (inner.trim() === content) {
      // debug(inner, ", findElement");
      return element
    }
  }
  return null
}


const getContent = async (element: ElementHandle): Promise<string> => {
  const inner = await element.getProperty("textContent")
  if (!inner) throw new Error(`can't proceed getContent, no textContent`)
  return (await inner.jsonValue()).trim()
}


export const getAttribute = async (page: Page, element: ElementHandle, attribute: string): Promise<string> => {
  const value = await page.evaluate((element, attribute) => element.attribute, element, attribute);
  return value
}
