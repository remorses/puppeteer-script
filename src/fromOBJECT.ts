require('dotenv').config()

import * as fs from "mz/fs"
import { join, dirname } from "path"
import { Browser, Page } from "puppeteer";
import { reducer, Action } from "./reducer/reducer"
import { prepare } from "./prepare/prepare";
const logger = console.log //require("debug")("script")
import chalk from "chalk"
const { red, bold, bgRed, white } = chalk
const { DEBUG = "" } = process.env
// import { roughSizeOfObject } from "./helpers"

export const fromOBJECT = async (script: Object) => {

  const browser: Browser = await prepare(script)

  const page: Page = (await browser.pages())[0]

  await script["do"]

    .map(obj => {
      const key = Object.keys(obj)[0]
      const value = obj[key]
      return { method: key, arg: value }
    })

    .reduce(async (state, action) => {
      return await reducer(await state, action)

        .then(x => {
          logExecuted(action)
          return x
        })

        .catch(e => {
          logError(e, action)
          process.exit(1)
        })

    }, Promise.resolve(page))

    .then(x => {
      logger(bold("done"))
      return x
    })

}



const logExecuted = action => logger(("\n" + "Executed "
  + bold("'" + action.method + "'" + " : "
    + JSON.stringify(action.arg))))


const logError = (e, action) => logger(red("Error in " + bold(action.method
  + ": " + action.arg) + " step" + "\n" + e["message"].trim()))
