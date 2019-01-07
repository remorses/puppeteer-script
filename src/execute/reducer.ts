import * as fs from "mz/fs"
import { Page, ElementHandle, JSHandle, Target } from "puppeteer"
import { join, dirname } from "path"
// import { solveCaptcha } from "./anticaptcha/solveCaptcha";
import { waitForLoad, findElement, waitForElement, getAttribute, getContent, abortPageRequests, emulatePage } from "./helpers"
// import { emulatePage } from "./emulate"
const logger = console.log
const WORKING_DIR = dirname((<any>require).main.filename)
import chalk from "chalk"
const { red, bold, bgRed, white } = chalk


export interface Action {
    method: string,
    arg: any
}

interface State {
    page: Page,
    data: any
}

export const reducer = async (state: Promise<State>, action: Action): Promise<State> => {

    const { page, data } = await state

    switch (action.method) {
        case "go-to": {
            const url: string = makeUrl(action.arg)

            await page.goto(url)
            return { page, data }

        }
        // TODO create interface
        case "click": {
            const arg = action.arg
            let selector, content
            if (typeof arg === "object") {
                selector = arg["selector"] || ""
                content = arg["content"] || "/.*/"
            } else {
                selector = arg
                content = "/.*/"
            }

            // logger(selector)
            const element = await findElement(page, selector, content)
            if (!element) throw new Error("no element found contining " + content)
            await waitForElement(element)
            await element.click({ clickCount: 2 })

            return { page, data }
        }


        case "type": {
            const arg = action.arg
            if (typeof arg === "object") {
                const { selector, content, } = arg;
                const element = await findElement(page, <string>selector, <string>content)
                if (!element) throw new Error("no element")
                await element.click()
            } else {
                await page.keyboard.type(arg)
            }
            return { page, data }
        }

        case "press": {
            const button = action.arg
            page.keyboard.press(button)
            return { page, data }
        }

        case "new-page": {
            const url = makeUrl(action.arg)
            let _page: Page = page
            await (await page.browser()).newPage()
                .then(page => _page = page)
                // .then(async page => process.env["EMULATE"] ? await emulatePage(page, <any>process.env["EMULATE"]) : page)
                .then(page => page.goto(url))
            return { page: _page, data }
        }

        case "wait": {
            const time = action.arg
            time ? await page.waitFor(time) : await waitForLoad(page)
            return { page, data }
        }

        case "echo": {
            const text = action.arg
            logger(text)
            return { page, data }
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
                return { page: newPage, data }

            } else {
                pages[index].close()
                while (pages.length >= length) {
                    pages = await (await page.browser()).pages()
                    await page.waitFor(100)
                }
                const newPage = await pages[pages.length - 1]
                if (newPage) await newPage.bringToFront()
                return { page: newPage, data }
            }
        }

        case "target-page": {
            const index = action.arg

            await page.waitFor(100)
            const pages = await (await page.browser()).pages()
            if (index < 0) {
                const page = pages[pages.length + index]
                await page.bringToFront()
                return { page, data }

            } else {
                await pages[index].bringToFront();
                return { page: pages[index], data }
            }
        }

        case "screenshot": {
            const file = action.arg

            let path = join(WORKING_DIR, file)
            page.screenshot({ path })
            return { page, data }
        }

        case "inject": {
            const path = action.arg

            const file = fs.readFileSync(join(WORKING_DIR, path), 'utf8')
            page.evaluate(file)
            return { page, data }
        }

        case "evaluate": {
            const code = action.arg

            page.evaluate(code)
            return { page, data }
        }

        case "set-user-agent": {
            const userAgent = action.arg

            await page.setUserAgent(userAgent)
            return { page, data }
        }

        case "set-cookies": {
            const path = action.arg
            const file = require(join(WORKING_DIR, path))
            await page.setCookie(...file)
            return { page, data }
        }

        case "export": {
            const path = action.arg
            const content = await page.content()
            await fs.writeFile(join(WORKING_DIR, path), content)
            return { page, data }
        }

        // case "solve-nocaptcha": {
        //   const selector = action.arg
        //
        //   const elem = await page.$(selector)
        //   if (!elem) throw new Error("can't find the captcha element with selector '" + selector + "'")
        //
        //   const siteKey = await getAttribute(page, elem, "site-key")
        //
        //   if (!process.env["ANTICAPTCHA_KEY"]) throw Error("please put ANTICAPTCHA_KEY in environment or anticaptcha-key in script file")
        //   const solution = await solveNoCaptcha(page, process.env["ANTICAPTCHA_KEY"], siteKey, process.env["ANTICAPTCHA_CALLBACK"])
        //   // TODO replace text-area in form with the sitekey
        //
        //   return { page, data }
        // }

        case "return": {
            const data = await Promise.all(action.arg.map(obj => returnData(page, obj)))
            return { page, data }
        }

        case "abort": {
            const types = action.arg
            const browser = await page.browser()
            const pages = await browser.pages()
            pages.forEach((page: Page) => abortPageRequests(page, types))
            browser.on('targetcreated', async (target: Target) => abortPageRequests(await target.page(), types))
            return { page, data }
        }

        case "emulate": {
            const device = action.arg
            const browser = await page.browser()
            const pages = await browser.pages()
            pages.forEach((page: Page) => emulatePage(page, device))
            browser.on('targetcreated', async (target: Target) => emulatePage(await target.page(), device))
            return { page, data }
        }


        // "block": (page: Page) => async ({ requests, responses, }) => {
        //   const promises1 = requests.map(({ to: url, types: types }) => block((await page.browser()), types, url))
        //   const promises2 = responses.map(({ from: url, types: types }) => redirect((await page.browser()), types, url))
        //   await Promise.all([...promises1, ...promises2])
        //   return { page, data }
        // },

        // "redirect": (page: Page) => async ({ requests, responses, to }) => {
        //   const promises1 = requests.map(({ to: url, types: types }) => abort((await page.browser()), types, url))
        //   const promises2 = responses.map(({ from: url, types: types }) => redirect((await page.browser()), types, url))
        //   await Promise.all([...promises1, ...promises2])
        //   return { page, data }
        // },

        default: {
            logger(red(bold(action.method) + " still not implemented"))
            return { page, data }
        }



    }
}



const returnData = async (page, { as, selector, content, children, ...attributes }) => {
    const element = await findElement(page, selector, content)

    const rest = Object.keys(attributes).reduce(async (obj, key) =>
        ({ ...(await obj), key: await getAttribute(page, element, attributes[key]) }),
        Promise.resolve({}))

    const object = {
        as,
        selector,
        content: await getContent(element),
        ...rest,
        children: children.map(x => returnData(page, x))
    }
}


const makeUrl = url => {
    if (!url.includes('http') || url.includes('https'))
        return 'https://' + url
    return url
}
