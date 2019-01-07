require('dotenv').config()


import { Browser, Page } from "puppeteer";
import { reducer, Action } from "./reducer"
const logger = console.log //require("debug")("script")
import chalk from "chalk"
const { red, bold, bgRed, white } = chalk
const { DEBUG = "" } = process.env
import { reduceReducers } from "./helpers"
import { dirname, resolve } from 'path';

let local: any = {  }

const WORKING_DIR = dirname((<any>require).main.filename)


export const execute = async (script: Object, page, ) => {


    if (script['use']) {
        let reducers = Object.entries(script['use'])
            .map(([key, value]) => {
                return { method: key, arg: value }
            })
            .map(({ method: pkg, arg: settings }) => {
                pkg = pkg.includes('.') ? resolve(WORKING_DIR, pkg) : pkg
                return import(pkg)
                    .then(({ reducer: custom_reducer }) => {
                        return custom_reducer(settings)
                        logger('added plugin')
                    })
            })

        local.reducer =  await reduceReducers(...await Promise.all(reducers), reducer)
    }




    const actions = script["do"]
        .map(obj => {
            const key = Object.keys(obj)[0]
            const value = obj[key]
            return { method: key, arg: value }
        })

    return actions.reduce(wrappedReducer, Promise.resolve({ page, data: {} }))
        .then(x => {
            logger(bold("done"))
            return x
        })
        .then(state => state.data)

}



const wrappedReducer = async (state, action) => {

    return await local.reducer(await state, action)

        .then(x => {
            logExecuted(action)
            return x
        })

        .catch(e => {
            logError(e, action)
            throw  e
        })

}




const pipe = (...functions) => (...inputs) =>
    functions.reduce(
        async (promise, func) => func(await promise),
        inputs
    )



const logExecuted = (action) => logger("\n", `executed ${bold(action.method)} : ${bold(JSON.stringify(action.arg))}`)


const logError = (e, action) => logger(red("Error in " + bold(action.method + ": " + action.arg) + " step" + "\n" + e["message"].trim()))
