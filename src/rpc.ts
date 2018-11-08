import * as fs from "mz/fs"
import { Browser, Page, ElementHandle, JSHandle, Target } from "puppeteer"
import { join, dirname } from "path"
// import { solveCaptcha } from "./anticaptcha/solveCaptcha";
const puppeteerDevices = require('puppeteer/DeviceDescriptors');
const myDevices = require("./devices")
const devices = { ...puppeteerDevices, ...myDevices }

const WORKING_DIR = dirname((<any>require).main.filename)


export default (browser: Browser, logger: any, ) => ({



  // TODO create interface
  "click": (page: Page) => async (arg: ObjArg | string) => {
    if (typeof arg === "object") {
      const { selector = "", containing = "", ...options } = arg;
      // logger(selector)
      const element = await await (findElement(page, <string>selector, <string>containing))
      // logger(element)
      if (!element) throw new Error("no element")
      await element.click()
    } else {
      await page.click(arg)
    }
    return page
  },

  "type": (page: Page) => async (arg: ObjArg | string) => {
    if (typeof arg === "object") {
      const { selector, containing, ...options } = arg;
      const element = await findElement(page, <string>selector, <string>containing)
      if (!element) throw new Error("no element")
      await element.click()
    } else {
      page.keyboard.type(arg)
    }
    return page
  },

  "press": (page: Page) => (button: string) => {
    page.keyboard.press(button)
    return page
  },

  "new page": (page: Page) => async (url = "") => {
    let _page: Page = page
    await browser.newPage()
      .then(page => _page = page)
      .then(page => page.goto(url))
    return _page
  },

  "go to": (page: Page) => async (url = "") => {
    await page.goto(url)
    return page
  },

  "wait": (page: Page) => async (time = 0) => {
    time ? await page.waitFor(time) : await waitForLoad(page)
    return page
  },

  "echo": (page: Page) => (text = "") => {
    logger(text + "\n")
    return page
  },

  "close page": (page: Page) => async (index = -1) => {
    let pages = await browser.pages()
    const length = [...pages].length

    if (index < 0) {
      pages[length + index].close()
      while (pages.length >= length) {
        logger(pages.length + " >= " + length)
        logger(pages.length + " >= " + length)
        pages = await browser.pages()
        await page.waitFor(100)
      }
      const newPage = await pages[pages.length - 1]
      newPage.bringToFront()
      return newPage

    } else {
      pages[index].close()
      while (pages.length >= length) {
        pages = await browser.pages()
        await page.waitFor(100)
      }
      const newPage = await pages[pages.length - 1]
      newPage.bringToFront()
      return newPage
    }
  },

  "target page": (page: Page) => async (index = -1) => {
    await page.waitFor(100)
    const pages = await browser.pages()
    if (index < 0) {
      pages[pages.length + index].bringToFront()
      return pages[pages.length + index]
    } else {
      await pages[index].bringToFront();
      return pages[index]
    }
  },

  "screenshot": (page: Page) => (file: "./screen.jpg") => {
    let path = join(WORKING_DIR, file)
    page.screenshot({ path })
    return page
  },

  "inject": (page: Page) => (path: "./file.js") => {
    const file = fs.readFileSync(join(WORKING_DIR, path), 'utf8')
    page.evaluate(file)
    return page
  },

  "evaluate": (page: Page) => (code = "") => {
    page.evaluate(code)
    return page
  },


  "set user agent": (page: Page) => (path: "./file.js") => {
    const file = fs.readFileSync(join(WORKING_DIR, path), 'utf8')
    page.setUserAgent(file)
    return page
  },
  "set cookies": (page: Page) => (path: "./file.js") => {
    const file = require(join(WORKING_DIR, path))
    page.setCookie(...file)
    return page
  },

  "export html": (page: Page) => async (path: "./file.html") => {
    const content = await page.content()
    await fs.writeFile(join(WORKING_DIR, path), content)
    return page
  },

  // "solve nocaptcha": (page: Page) => async (selector: string) => {
  //   const element = await findElement(page, selector)
  //   if (!element) throw new Error("can't find nocaptcha element")
  //   const captcha: ElementHandle = element
  //   const sitekey = await getAttribute(page, captcha, "data-sitekey")
  //   await solveCaptcha(browser, page, sitekey, { proxy: true })
  //   return page
  // }


})


const waitForLoad = (page: Page) => new Promise((res) => {
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
const findElement = async (page: Page, selector = "div", regex: string = "/.*/", ): Promise<ElementHandle | null> => {
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


const getContent = async (element: ElementHandle): Promise<string> => {
  const inner = await element.getProperty("textContent")
  if (!inner) return ""
  return (await inner.jsonValue()).trim()
}


export const getAttribute = async (page: Page, element: ElementHandle, attribute: string): Promise<string> => {
  const value = await page.evaluate((element, attribute) => element.attribute, element, attribute);
  return value
}


interface ObjArg {
  [key: string]: string | number | boolean | RegExp
}


const changedPage = async (browser: Browser) => {
  return new Promise(x =>
    browser.on('targetchanged', async target => {
      if (target.type() === 'page') {
        x(await target.page())

      }
    })
  );
};
