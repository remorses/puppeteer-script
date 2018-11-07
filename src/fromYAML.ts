
import rpc from "./rpc"
import * as YAML from "yaml"
import * as fs from "mz/fs"
import { join } from "path"
import { launch, Browser } from "puppeteer";

const debug = require("debug")



export const fromYAML = async (path = "./script.yaml") => {
  const file = await fs.readFile(join(__dirname, path), 'utf8')
  const script = YAML.parse(file)
  const executablePath: string = script["executable"] || ""
  const headless: boolean = script["headless"] || true


  await launch({headless, executablePath }).then(async (browser: Browser) => {
    const pages = await browser.pages()
    let page = pages[0]


    const functionsObject: Object = rpc(browser, console.log)
    console.log(functionsObject)


    for (let step in script.do) {
      let {value, key} = step
      debug("index " + value + " " + key)("pages: " + browser.pages())
      debug("index " + value + " " + key)("targets: " + browser.targets())

      page = await (<any>functionsObject)[value](page)(key)
        .catch((e: Error) => console.error("error in", key, ":", value, "\n", e))
    }

    return


  })

  console.log("done")
}
