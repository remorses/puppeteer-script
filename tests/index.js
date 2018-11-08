
import { fromYAML } from "../src/fromYAML"
import { resolve } from "path"
console.log("current dir:", __dirname)
console.log("root dir:", resolve( "." ))

fromYAML("./example.yaml")
