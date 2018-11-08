
import * as YAML from "yaml"
import { join, dirname } from "path"
import * as fs from "mz/fs"
import { fromOBJECT } from "./fromOBJECT"

const WORKING_DIR = dirname((<any>require).main.filename)

export const fromJSON = async (path: string) => {

  const file = await fs.readFile(join(WORKING_DIR, path), 'utf8')
  const script = YAML.parse(file)
  await fromOBJECT(script)

}
