require('dotenv').config()


import { Browser, Page } from "puppeteer";
import { reducer, Action } from "./reducer"
const logger = console.log //require("debug")("script")
import chalk from "chalk"
const { red, bold, bgRed, white } = chalk
const { DEBUG = "" } = process.env
// import { roughSizeOfObject } from "./helpers"

export const execute = (script: Object, page, ) => new Promise((res, rej) => {

  const actions = script["do"]
    .map(obj => {
      const key = Object.keys(obj)[0]
      const value = obj[key]
      return { method: key, arg: value }
    })

  actions.reduce(wrapper, Promise.resolve({ page, data: {} }))
    .then(x => {
      logger(bold("done"))
      return x
    })
    .then(state => state.data)
    .then(res)
    .catch(rej)
  })



const wrapper = async (state, action) => {

  return await reducer(await state, action)

    .then(x => {
      logExecuted(action )
      return x
    })

    .catch(e => {
      logError(e, action)
      throw new e
    })

}







const logExecuted = (action) => logger("\n", `executed ${bold(action.method)} : ${bold(JSON.stringify(action.arg))}`)


const logError = (e, action) => logger(red("Error in " + bold(action.method + ": " + action.arg) + " step" + "\n" + e["message"].trim()))
