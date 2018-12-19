require('dotenv').config()

import * as fs from "mz/fs"
import { join, dirname } from "path"
import { Browser, Page } from "puppeteer";
import { reducer, Action } from "./reducer"
import { prepare } from "../prepare/prepare";
const logger = console.log //require("debug")("script")
import chalk from "chalk"
const { red, bold, bgRed, white } = chalk
const { DEBUG = "" } = process.env
// import { roughSizeOfObject } from "./helpers"

// const browser: Browser = await prepare(script)
// const page: Page = (await browser.pages())[0]

export const execute = async (script: Object, page, worker) => {

  const actions = script["do"]

    .map(obj => {
      const key = Object.keys(obj)[0]
      const value = obj[key]
      return { method: key, arg: value }
    })

    const { data } = actions.reduce(async (state, action) => {

      return await reducer(await state, action)

        .then(x => {
          logExecuted(action, worker)
          return x
        })

        .catch(e => {
          logError(e, action, worker)
          throw new e
        })

    }, Promise.resolve({ page, data: {} }))

    .then(x => {
      logger(bold("done"))
      return x
    })

    return data


}








const logExecuted = (action, worker) => logger("\n", `Worker ${worker.id} executed ${bold(action.method)} : ${bold(JSON.stringify(action.arg))}`)


const logError = (e, action, worker) => logger(red("Error from worker " +
  worker.id + " in " + bold(action.method + ": " + action.arg) + " step" + "\n" + e["message"].trim()))
