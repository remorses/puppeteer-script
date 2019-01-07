require('dotenv').config()


import { Browser, Page } from "puppeteer";
import { reducer, Action } from "./reducer"
const logger = console.log //require("debug")("script")
import chalk from "chalk"
const { red, bold, bgRed, white } = chalk
const { DEBUG = "" } = process.env
// import { roughSizeOfObject } from "./helpers"

let local = { reducer }

export const execute = (script: Object, page, ) => new Promise((res, rej) => {

    // TODO add plugins when 'use' in script
    // TODO
    if (script['use']) {
        script['use']
            .map(obj => {
                const key = Object.keys(obj)[0]
                const value = obj[key]
                return { method: key, arg: value }
            })
            .map(({ method: pkg, arg: settings }) => {
                import(pkg)
                    .then(({default: custom_reducer}) => {
                        local.reducer = pipe(custom_reducer(settings), local.reducer)
                    })
            })
    }

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

    return await local.reducer(await state, action)

        .then(x => {
            logExecuted(action)
            return x
        })

        .catch(e => {
            logError(e, action)
            throw new e
        })

}




const pipe = (...functions) => input =>
  functions.reduce(
    async (promise, func) => func(await promise),
    Promise.resolve(input))



const logExecuted = (action) => logger("\n", `executed ${bold(action.method)} : ${bold(JSON.stringify(action.arg))}`)


const logError = (e, action) => logger(red("Error in " + bold(action.method + ": " + action.arg) + " step" + "\n" + e["message"].trim()))
