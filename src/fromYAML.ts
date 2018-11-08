
import rpc from "./rpc"
import * as YAML from "yaml"
import * as fs from "mz/fs"
import { join, dirname } from "path"
import { launch, Browser, Page } from "puppeteer";
import   chalk  from "chalk"
const debug = require("debug")
const logger = debug("script")

const { red, bold, bgRed, white  } = chalk

const WORKING_DIR = dirname((<any>require).main.filename)
const { DEBUG = "" } = process.env

// logger("WORKING_DIR:", WORKING_DIR)
export const fromYAML = async (path: string) => {
  const file = await fs.readFile(join(WORKING_DIR, path), 'utf8')
  const script = YAML.parse(file)

  // logger("script:", script.do)
  const executablePath: string = script["executable"] || ""
  const headless: boolean = !!script["headless"]


  await launch({ headless, executablePath }).then(async (browser: Browser) => {
    const pages = await browser.pages()
    let page: Page = pages[0]


    const functionsObject: Object = rpc(browser, logger).do
    // logger("functionObject", functionsObject)

    let func: Function
    let key: string = ""
    let value: string = ""

    try {

      for (let step of script.do) {


        key = Object.keys(step)[0]
        value = step[key];



        if (DEBUG.match(/script*/)) {
          const pagesLogs = (await browser.pages())
            .map((x: Page) => x.url())
            .map((x, i) => i + ". " + x + "\n")
          logger("pages:\n" ,... pagesLogs)
        }



        func = await (<any>functionsObject)[key]
        if (!func) console.error(red( bold(key) +  " still not implemented"))

        page = await (await func(page)(value))
      }

    } catch (e) {
      console.error(red("error in " + bold(key.toString() + ": " + value.toString()) + " step" + "\n" + e["message"].trim()))
      process.exit(1)

    }

    return


  })

  logger(bold("done"))
}
