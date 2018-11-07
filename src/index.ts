
import rpc from "./rpc"
import * as YAML from "yaml"
import * as fs from "fs"
import { join } from "path"
import * as puppeteer from "puppeteer"
import { Browser } from "puppeteer";

const debug = require("debug")



const fromYAML = async (path = "") => {
  const file = fs.readFileSync(join(__dirname, path), 'utf8')
  const script = YAML.parse(file)
  const executable: string = script["executable"]
  const headless: boolean = script["headless"] || true


  await puppeteer.launch({headless, executablePath: executable ? executable : ""}).then(async (browser: Browser) => {
    const page = await browser.newPage()

    const functionsObject: Object = rpc(browser, page, false)


    for (let step of script.do) {
      let [value, key] = step.items()
      debug("index " + value + " " + key)("pages: " + browser.pages())
      debug("index " + value + " " + key)("targets: " + browser.targets())


      await (<any>functionsObject)[value](key)
        .catch((e: Error) => console.error("error in", key, ":", value, "\n", e))



    }


  })
}
