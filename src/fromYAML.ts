
import rpc from "./rpc"
import * as YAML from "yaml"
import * as fs from "mz/fs"
import { join, resolve, dirname } from "path"
import { launch, Browser, Page } from "puppeteer";

const debug = require("debug")

const WORKING_DIR = dirname((<any>require).main.filename)
// console.log(WORKING_DIR)
export const fromYAML = async (path: string) => {
  const file = await fs.readFile(path, 'utf8')
  const script = YAML.parse(file)
  // console.log("script:", script.do)
  const executablePath: string = script["executable"] || ""
  const headless: boolean = !!script["headless"]


  await launch({ headless, executablePath }).then(async (browser: Browser) => {
    const pages = await browser.pages()
    let page: Page = pages[0]


    const functionsObject: Object = rpc(browser, console.log).do
    // console.log("functionObject", functionsObject)

    let func: Function
    let key: string = ""
    let value: string = ""

    try {

      for (let step of script.do) {
        key = Object.keys(step)[0]
        value = step[key]

        console.log("pages: " + (await browser.pages()))

        func = await (<any>functionsObject)[key]
        if (!func) console.error(key, "still not implemented")

        page = await (await func(page)(value))
        // .catch((e: Error) => console.error("error in", key, ":", value, "\n", e))
      }
    } catch (e) {
      console.error("error in", key, ":", value, "\n", e["message"].trim())
    }

    return


  })

  console.log("done")
}
