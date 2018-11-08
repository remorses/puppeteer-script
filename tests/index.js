
const { fromYAML } = require("../lib/fromYAML");
const path = require("path");

console.log("current dir:", __dirname);
console.log("root dir:", path.resolve( "." ));

fromYAML("./example.yaml");
