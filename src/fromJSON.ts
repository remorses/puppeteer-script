
import { join, dirname } from "path"
import * as fs from "mz/fs"
import { fromOBJECT } from "./fromOBJECT"
const WORKING_DIR = dirname((<any>require).main.filename)



export const fromJSON = (filePath = "./file.json") => {

  return async ({ page, data, worker }) => {

    const file: string = await fs.readFile(join(WORKING_DIR, filePath), "utf8")
    const filledScript = fillData(file, data)
    const script = JSON.parse(filledScript)
    await fromOBJECT(filledScript, page, worker)

  }
}


const fillData = (script, data: Object) => {
  const replacer = (match, p1, content, p2, offset, string) => {
    if (!data[content]) throw new Error("cannot find the script variable {{ " + content + " }} in data")
    return data[content]
  }
  return script.replace(/({{) (.*) (}})/g, replacer)
}
