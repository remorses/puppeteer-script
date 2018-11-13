import * as fs from "mz/fs"
import { Browser, Page, ElementHandle, JSHandle, Target } from "puppeteer"
import { join, dirname } from "path"
// import { solveCaptcha } from "./anticaptcha/solveCaptcha";
import { waitForLoad, findElement, waitForElement, getAttribute } from "./helpers"
import { abort } from "./abort";
import { redirect } from "./redirect";
import { solveNoCaptcha } from "./anticaptcha"


const WORKING_DIR = dirname((<any>require).main.filename)

export interface DoSteps {
  [key: string]: (page: Page) => (any) => Page | Promise<Page>
}

export const makeDoSteps = (browser: Browser, logger: any, options): DoSteps => ({

  // TODO create interface
  "click": (page: Page) => async (arg: scriptArgument | string) => {

    let selector, containing
    if (typeof arg === "object") {
      selector = arg["selector"] || ""
      containing = arg["containing"] || "/.*/"
    } else {
      selector = arg
      containing = "/.*/"
    }

    // logger(selector)
    const element =  await findElement(page, selector, containing)
    if (!element) throw new Error("no element found contining " + containing)
    await waitForElement(element)
    await element.click({clickCount: 2})

    return page
  },

  "type": (page: Page) => async (arg: scriptArgument | string) => {
    if (typeof arg === "object") {
      const { selector, containing, ...options } = arg;
      const element = await findElement(page, <string>selector, <string>containing)
      if (!element) throw new Error("no element")
      await element.click()
    } else {
      await page.keyboard.type(arg)
    }
    return page
  },

  "press": (page: Page) => (button: string) => {
    page.keyboard.press(button)
    return page
  },

  "new-page": (page: Page) => async (url = "") => {
    let _page: Page = page
    await browser.newPage()
      .then(page => _page = page)
      .then(page => page.goto(url))
    return _page
  },

  "go-to": (page: Page) => async (url = "") => {
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

  "close-page": (page: Page) => async (index = -1) => {
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
      if(newPage)  await newPage.bringToFront()
      return newPage

    } else {
      pages[index].close()
      while (pages.length >= length) {
        pages = await browser.pages()
        await page.waitFor(100)
      }
      const newPage = await pages[pages.length - 1]
      if(newPage)  await newPage.bringToFront()
      return newPage
    }
  },

  "target-page": (page: Page) => async (index = -1) => {
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


  "set-user-agent": (page: Page) => (path: "./file.js") => {
    const file = fs.readFileSync(join(WORKING_DIR, path), 'utf8')
    page.setUserAgent(file)
    return page
  },
  "set-cookies": (page: Page) => (path: "./file.js") => {
    const file = require(join(WORKING_DIR, path))
    page.setCookie(...file)
    return page
  },

  "export-html": (page: Page) => async (path: "./file.html") => {
    const content = await page.content()
    await fs.writeFile(join(WORKING_DIR, path), content)
    return page
  },

  "block": (page: Page) => async ({ requests, responses, }) => {
    const promises1 = requests.map(({ to: url, types: types }) => abort(browser, types, url))
    const promises2 = responses.map(({ from: url, types: types }) => redirect(browser, types, url))
    await Promise.all([...promises1, ...promises2])
    return page
  },

  "redirect": (page: Page) => async ({ requests, responses, to }) => {
    const promises1 = requests.map(({ to: url, types: types }) => abort(browser, types, url))
    const promises2 = responses.map(({ from: url, types: types }) => redirect(browser, types, url))
    await Promise.all([...promises1, ...promises2])
    return page
  },

  "solve-nocaptcha": (page: Page) => async (selector) => {
    const elem = await page.$(selector)
    if (! elem ) throw new Error("can't find the captcha element with selector " + selector)
    const siteKey = await getAttribute(page, elem, "site-key")
    const solution = await solveNoCaptcha(page, options["clientKey"], siteKey, options["callbackUrl"])
    // TODO replace text-area in form with the sitekey

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



interface scriptArgument {
  [key: string]: string | number | boolean | RegExp
}
