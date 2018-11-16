
import { join, dirname } from "path"
import * as fs from "mz/fs"
import { fromOBJECT } from "./fromOBJECT"
const WORKING_DIR = dirname((<any>require).main.filename)



export const fromJSON = (filePath = "./file.json") => {

  return async ({ page, data, worker }) => {

    const file = await fs.readFile(join(WORKING_DIR, filePath), 'utf8')
    const script = JSON.parse(file)
    const filledScript = fillData(script, data)
    return await fromOBJECT(filledScript, page)

  }
}


const fillData = (script, data: Object) => {
  const replacer = (match, p1, content, p2, offset, string) => {
    if (!data[content]) throw
    return data[content]
  }
  return script.replace(/({{ ) (.*) ( }})/, replacer)
}
