require('dotenv').config()

import * as YAML from "yaml"
import * as fs from "mz/fs"
import { join, dirname } from "path"
import { launch, Browser, Page } from "puppeteer";
import chalk from "chalk"
import { makeDoSteps, DoSteps } from "./doSteps"
import { emulate } from "./emulate"
import { abort } from "./abort"
const logger = console.log //require("debug")("script")
const { red, bold, bgRed, white } = chalk
const { DEBUG = "" } = process.env
import { roughSizeOfObject } from "./helpers"

// logger("WORKING_DIR:", WORKING_DIR)
export const fromOBJECT = async (script: Object) => {
  makeEnv(script)
  const options = await makeOptions(script)
  const browser: Browser = await makeBrowser(script, options)
  const doSteps: DoSteps = makeDoSteps(browser, logger)
  let page = (await browser.pages())[0]

  let func: Function
  let key: string = ""
  let value: string = ""

  try {

    for (let step of script["do"]) {
      key = Object.keys(step)[0]
      value = step[key];
      logger(("\n" + "Executing " + bold("'" + key + "'" + " : " + JSON.stringify(value))))

      func =  doSteps[key]
      if (!func) console.error(red(bold(key) + " still not implemented"))
      page = await (await func(page)(value))

      // if (DEBUG.match(/script*/i)) {
      //   const pagesLogs = (await browser.pages())
      //     .map((x: Page) => x.url())
      //     .map((x, i) => i + ". " + x + "\n")
      //   logger("pages:\n", ...pagesLogs)
      // }


    }
  } catch (e) {
    console.error(red("Error in " + bold(key + ": " + value) + " step" + "\n" + e["message"].trim()))
    //process.exit(1)
  }

  logger(bold("done"))
  // await browser.close()
}


const makeEnv = (script: any) => {
  const set = (variable: string) => {
    let scriptVariable = variable.toLowerCase().replace("-", "_")
    process.env[variable] = script[scriptVariable] || process.env[variable] || null
  }

  set("ANTICAPTCHA_KEY")
  set("ANTICAPTCHA_CALLBACK")
}

const makeOptions = async (script: any) => {
  const defaults = []
  const { width, height } = script["viewport"] || { width: 1000, height: 1000 }
  return {
    args: [...defaults, ...(script["args"] || [])],
    headless: !!script["headless"],
    executablePath: script["executable"] || "default",
    defaultViewport: { width, height }
  }
}

const makeBrowser = async (script: any, options) => {
  return await launch({ ...options }).then(async browser => {
    await emulate(browser, script["emulate"] || null)
    await abort(browser, script["abort"] || [])
    return browser
  })
}
