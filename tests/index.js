<<<<<<< HEAD
const { fromYAML } = require("../lib/fromYAML");
=======

const { fromYAML } = require("../lib");
>>>>>>> f1bab961466bbebfb638adc24b6cd0e9b30ac79a
const path = require("path");

// console.log("current dir:", __dirname);
// console.log("root dir:", path.resolve( "." ));

fromYAML("./example.yaml");
