import { Browser } from "puppeteer";
import { pipe } from "ramda"

import { emulate } from "./emulate";
import { abort } from "./abort";



export const prepare = (script: Object): Browser =>
  pipe(
    makeEnv,
    makeOptions,
    makeBrowser
  )(script)


const makeEnv = (script: any) => {
  const set = (variable: string) => {
    let scriptVariable = variable.toLowerCase().replace("_", "-")
    process.env[variable] = script[scriptVariable] || process.env[variable] || null
  }

  set("EMULATE")
  set("ANTICAPTCHA_KEY")
  set("ANTICAPTCHA_CALLBACK")
  set("USER_AGENT")
}

const makeOptions = async (script: any) => {
  const defaults = []
  const { width, height } = script["viewport"] || { width: 1000, height: 1000 }
  let options: any = {
    launch: {
      args: [...defaults, ...(script["args"] || [])],
      headless: !!script["headless"],
      defaultViewport: { width, height }
    },
    emulate: script["emulate"],
    abort: script["abort"]
  }
  if (script["executable"]) options.executablePath = script["executable"]
  return options
}

const makeBrowser = async ( {launch, ...rest}) => {
  return await launch({ ...launch }).then(async (browser: Browser) => {
    if (rest.emulate) await emulate(browser, rest.emulate)
    if (rest.abort) await abort(browser, rest.abort)
    return browser
  })
}
