import * as fs from "fs"
import { Browser, Page } from "puppeteer"
import { join } from "path"
export default (browser: Browser, page: Page, logger: any) => ({

  "click": (selector: string, check = "") => {
    if (!check) {
      return page.click(selector)
    } else {
      return page.click(selector)
    }
  },

  "type": (selector: string, check = "", text = "") => {
    if (!check) {
      return page.type(selector, text)
    } else {
      return page.type(selector, text)
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

  "evaluate": (code=  "") => page.evaluate(code),

  "abort": (resources= []) => abortRequests(page, resources),

  "set user agent": (path: "./file.js") => {
    const file = fs.readFileSync(join(__dirname, path), 'utf8')
    return page.setUserAgent(file)
  },
  "set cookies": (path: "./file.js") => {
    const file = require(path)
    return page.setCookie(...file)
  },

})


const waitForLoad = (page: Page) => new Promise((resolve) => {
  page.on('request', (req) => {
    setTimeout(() => resolve("timeOut"), 600)
  })
  setTimeout(() => resolve("timeOut"), 2500)
})


const abortRequests = async (page: Page, types = []) => {
  await page.setRequestInterception(true);
  page.on('request', req => {
    if (types.some(x => x === req.resourceType())  )
      req.abort();
    else
      req.continue();
  });
}
