import * as fs from "mz/fs"
import { Page, ElementHandle, JSHandle, Target } from "puppeteer"
import { join, dirname } from "path"
// import { solveCaptcha } from "./anticaptcha/solveCaptcha";
import { waitForLoad, findElement, waitForElement, getAttribute, preparePage } from "./helpers"
import { abort } from "./abort";
import { redirect } from "./redirect";
import { solveNoCaptcha } from "./anticaptcha"
// import { emulatePage } from "./emulate"
const logger = console.log
const WORKING_DIR = dirname((<any>require).main.filename)


export interface Action {
  method: string,
  arg: any
}

export const reducer = async (state: Promise<Page>, action: Action): Promise<Page> => {

  const page = await state

  switch (action.method) {
    case "go-to": {
      const url: string = action.arg
      await preparePage(page)
      await page.goto(url)
      return page

    }
    // TODO create interface
    case "click": {
      const arg = action.arg
      let selector, containing
      if (typeof arg === "object") {
        selector = arg["selector"] || ""
        containing = arg["containing"] || "/.*/"
      } else {
        selector = arg
        containing = "/.*/"
      }

      // logger(selector)
      const element = await findElement(page, selector, containing)
      if (!element) throw new Error("no element found contining " + containing)
      await waitForElement(element)
      await element.click({ clickCount: 2 })

      return page
    }


    case "type": {
      const arg = action.arg
      if (typeof arg === "object") {
        const { selector, containing, } = arg;
        const element = await findElement(page, <string>selector, <string>containing)
        if (!element) throw new Error("no element")
        await element.click()
      } else {
        await page.keyboard.type(arg)
      }
      return page
    }

    case "press": {
      const button = action.arg
      page.keyboard.press(button)
      return page
    }

    case "new-page": {
      const url = action.arg
      let _page: Page = page
      await (await page.browser()).newPage()
        .then(page => _page = page)
        // .then(async page => process.env["EMULATE"] ? await emulatePage(page, <any>process.env["EMULATE"]) : page)
        .then(page => page.goto(url))
      await preparePage(_page)
      return _page
    }

    case "wait": {
      const time = action.arg
      time ? await page.waitFor(time) : await waitForLoad(page)
      return page
    }

    case "echo": {
      const text = action.arg
      logger(text)
      return page
    }

    case "close-page": {
      const index = action.arg
      let pages = await (await page.browser()).pages()
      const length = [...pages].length

      if (index < 0) {
        pages[length + index].close()
        while (pages.length >= length) {
          logger(pages.length + " >= " + length)
          logger(pages.length + " >= " + length)
          pages = await (await page.browser()).pages()
          await page.waitFor(100)
        }
        const newPage = await pages[pages.length - 1]
        if (newPage) await newPage.bringToFront()
        return newPage

      } else {
        pages[index].close()
        while (pages.length >= length) {
          pages = await (await page.browser()).pages()
          await page.waitFor(100)
        }
        const newPage = await pages[pages.length - 1]
        if (newPage) await newPage.bringToFront()
        return newPage
      }
    }

    case "target-page": {
      const index = action.arg

      await page.waitFor(100)
      const pages = await (await page.browser()).pages()
      if (index < 0) {
        const page = pages[pages.length + index]
        await page.bringToFront()
        await preparePage(page)
        return page

      } else {
        await pages[index].bringToFront();
        await preparePage(pages[index])
        return pages[index]
      }
    }

    case "screenshot": {
      const file = action.arg

      let path = join(WORKING_DIR, file)
      page.screenshot({ path })
      return page
    }

    case "inject": {
      const path = action.arg

      const file = fs.readFileSync(join(WORKING_DIR, path), 'utf8')
      page.evaluate(file)
      return page
    }

    case "evaluate": {
      const code = action.arg

      page.evaluate(code)
      return page
    }

    case "set-user-agent": {
      const userAgent = action.arg

      await page.setUserAgent(userAgent)
      return page
    }

    case "set-cookies": {
      const path = action.arg
      const file = require(join(WORKING_DIR, path))
      await page.setCookie(...file)
      return page
    }

    case "export-html": {
      const path = action.arg
      const content = await page.content()
      await fs.writeFile(join(WORKING_DIR, path), content)
      return page
    }

    case "solve-nocaptcha": {
      const selector = action.arg

      const elem = await page.$(selector)
      if (!elem) throw new Error("can't find the captcha element with selector '" + selector + "'")

      const siteKey = await getAttribute(page, elem, "site-key")

      if (!process.env["ANTICAPTCHA_KEY"]) throw Error("please put ANTICAPTCHA_KEY in environment or anticaptcha-key in script file")
      const solution = await solveNoCaptcha(page, process.env["ANTICAPTCHA_KEY"], siteKey, process.env["ANTICAPTCHA_CALLBACK"])
      // TODO replace text-area in form with the sitekey

      return page
    }

    // "block": (page: Page) => async ({ requests, responses, }) => {
    //   const promises1 = requests.map(({ to: url, types: types }) => block((await page.browser()), types, url))
    //   const promises2 = responses.map(({ from: url, types: types }) => redirect((await page.browser()), types, url))
    //   await Promise.all([...promises1, ...promises2])
    //   return page
    // },

    // "redirect": (page: Page) => async ({ requests, responses, to }) => {
    //   const promises1 = requests.map(({ to: url, types: types }) => abort((await page.browser()), types, url))
    //   const promises2 = responses.map(({ from: url, types: types }) => redirect((await page.browser()), types, url))
    //   await Promise.all([...promises1, ...promises2])
    //   return page
    // },

    default: {
      logger(red(bold(action.method) + " still not implemented"))
      return page
    }



  }
}
