import * as fs from "mz/fs"
import { Browser, Page, ElementHandle } from "puppeteer"
import { join } from "path"
export default (browser: Browser, page: Page, logger: any) => ({

  "click": (arg: Object | string) => {
    if (typeof arg === "object") {
      const { selector, with, ...options } = arg;
      const element = await findElement(page, selector, content )
      return await element.click(...options)
    } else {
      return page.click(arg)
    }
  },

  "type": (arg: Object | string) => {
    if (typeof arg === "object") {
      const { selector, with, ...options } = arg;
      const element = await findElement(page, selector, content )
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

  "abort": (resources = []) => abortRequests(page, resources),

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
    if (types.some(x => x === req.resourceType()))
      req.abort();
    else
      req.continue();
  });
}




const findElement = async ( page: Page,  selector = "div", content:  string | RegExp,  ) => {
  await page.waitForSelector(selector)
  const elements: ElementHandle[] = await page.$$(selector)
  if (elements.length < 1) throw new Error(`can't proceed findElement for ${content}, no elements`)
  for (let element of elements) {
    let inner = await getContent(element)
    //  debug(inner.trim())
    if (inner.trim() === content) {
      // debug(inner, ", findElement");
      return element
    }
  }
}



const getContent = async (element: ElementHandle): Promise<string> => {
  const inner = await element.getProperty("textContent")
  if (!inner) throw new Error(`can't proceed getContent, no textContent`)
  return (await inner.jsonValue()).trim()
}
