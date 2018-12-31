import { fromYAML } from "./fromYAML"
import { fromJSON } from "./fromJSON"
import { concurrency } from "./concurrency"



import * as YAML from "yaml"
import { join, dirname, extname, resolve } from "path"
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



export const Script = ({ file = '', yaml = '', json = '', data = {} }) => {

  let script


  if (file && typeof file === "string") {
    if (extname(file) === '.yaml') yaml =  fs.readFileSync(resolve(WORKING_DIR, file), {encoding: 'utf8'})
    if (extname(file) === '.json') json =  fs.readFileSync(resolve(WORKING_DIR, file), {encoding: 'utf8'})
  }

  if (yaml && typeof yaml === "string") {
      const filled = fillData(yaml, data)
      script = YAML.parse(filled)
  }

  return script
}
