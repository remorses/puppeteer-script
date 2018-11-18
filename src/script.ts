import { fromYAML } from "./fromYAML"
import { fromJSON } from "./fromJSON"
import { concurrency } from "./concurrency"



import * as YAML from "yaml"
import { join, dirname } from "path"
import * as fs from "mz/fs"
import { execute } from "./execute/execute"
import { prepare } from "./prepare/prepare";
import { Page } from "puppeteer";

const WORKING_DIR = dirname((<any>require).main.filename)



const fillData = (script: string, data: Object) => {
  const replacer = (match, p1, content, p2, offset, string) => {
    if (!data[content]) throw new Error("cannot find the script variable {{ " + content + "}} in data")
    return data[content]
  }
  return script.replace(/({{ )\s*(\w*)\s*( }})/g, replacer)
}



export const Script = ({ json, yaml, file }) => {

  let runner, script,
    concurrency_page, concurrency_context, concurrency_browser

  if (yaml && typeof yaml === "string") {
    runner = async ({ page, data, worker }) => {
      const filled = fillData(yaml, data)
      script = YAML.parse(filled)
      concurrency_page = concurrency(script, data, "page")
      return await execute(script, page, worker)
    }
    runner.CONCURRENCY_PAGE = concurrency_page
    runner.SCRIPT = script
    runner.ID = 0
  }

  return runner

}
