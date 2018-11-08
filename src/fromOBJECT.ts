
import * as YAML from "yaml"
import * as fs from "mz/fs"
import { join, dirname } from "path"
import { launch, Browser, Page } from "puppeteer";
import   chalk  from "chalk"
import { makeDoSteps, DoSteps } from "./rpc"
import { emulate } from "./emulate"
const logger = require("debug")("script")
const { red, bold, bgRed, white  } = chalk
const { DEBUG = "" } = process.env

// logger("WORKING_DIR:", WORKING_DIR)
export const fromOBJECT = async (script: Object) => {

  // logger("script:", script.do)
  const executablePath: string = script["executable"] || ""
  const headless: boolean = !!script["headless"]


  await launch({ headless, executablePath }).then(async (browser: Browser) => {
    const pages = await browser.pages()
    let page: Page = pages[0]


    const doSteps: DoSteps = makeDoSteps(browser, logger)
    // logger("doSteps", doSteps)

    let func: Function
    let key: string = ""
    let value: string = ""

    try {

      for (let step of script["do"]) {


        key = Object.keys(step)[0]
        value = step[key];
        console.log(( "\n" + "Executing " + bold("'" + key  + "'" + " : " + "'" + value + "'" ) ))



        if (DEBUG.match(/script*/i)) {
          const pagesLogs = (await browser.pages())
            .map((x: Page) => x.url())
            .map((x, i) => i + ". " + x + "\n")
          logger("pages:\n" ,... pagesLogs)
        }



        func = await (<any>doSteps)[key]
        if (!func) console.error(red( bold(key) +  " still not implemented"))

        page = await (await func(page)(value))
      }

    } catch (e) {
      console.error(red("Error in " + bold(key + ": " + value) + " step" + "\n" + e["message"].trim()))
      process.exit(1)

    }

    return


  })

  logger(bold("done"))
}
