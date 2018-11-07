
import rpc from "./rpc"
import * as YAML from "yaml"
import * as fs from "mz/fs"
import { join } from "path"
import { launch, Browser } from "puppeteer";

const debug = require("debug")



export const fromYAML = async (path = "./script.yaml") => {
  const file = await fs.readFile(join(__dirname, path), 'utf8')
  const script = YAML.parse(file)
  console.log("script:", script.do)
  const executablePath: string = script["executable"] || ""
  const headless: boolean = !!script["headless"] 


  await launch({headless, executablePath }).then(async (browser: Browser) => {
    const pages = await browser.pages()
    let page = pages[0]


    const functionsObject: Object = rpc(browser, console.log).do
    console.log("functionObject", functionsObject)


    for (let step of script.do) {
      debug("index step")(step)
      const key = Object.keys(step)[0]
      const value = step[key]

      debug("index " + key + " " + value)("pages: " + await browser.pages())
      debug("index " + key + " " + value)("targets: " + await browser.targets())

      let func = (<any>functionsObject)[key]
      if(!func) console.error(key, "still not implemented")

      page = await func(page)(value)
        // .catch((e: Error) => console.error("error in", key, ":", value, "\n", e))
    }

    return


  })

  console.log("done")
}
