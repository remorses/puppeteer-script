import { Browser } from "puppeteer";
import { launch } from "puppeteer"
const logger = console.log
import chalk from "chalk"
const { red, bold, bgRed, white } = chalk

const logErr = (err: Error) => logger(red(err.message + " in " + __filename))

export const prepare = async (script: Object): Promise<Browser> =>
  pipe(
     makeEnv,
     makeOptions,
     makeBrowser
  )(script)


const pipe = (...functions) => input =>
  functions.reduce(
    async (promise, func) => func(await promise),
    Promise.resolve(input))

const makeEnv = async (script: any) => {
  const set = (variable: string) => {
    const scriptVariable = variable.toLowerCase().replace("_", "-")
    process.env[variable] = script[scriptVariable] || process.env[variable] || null
  }

  set("EMULATE")
  set("ANTICAPTCHA_KEY")
  set("ANTICAPTCHA_CALLBACK")
  set("USER_AGENT")
  return script
}

const makeOptions = async (script: any) => {
  const defaults = []
  let options: any = {
    launchOPtions: {
      args: [...defaults, ...(script["args"] || [])],
      headless: !!script["headless"],
      defaultViewport: script["viewport"] || { width: 1000, height: 1000 },
      executablePath: script["executable"] || null
    },
    emulate: script["emulate"] || null,
    abort: script["abort"] || null
  }
  return options
}

const makeBrowser = async ({ launchOPtions, ...rest }): Promise<Browser> => {
  return await launch({ ...launchOPtions }).then(async (browser: Browser) => {
    return browser
  })
}


import { Cluster } from "puppeteer-cluster"
