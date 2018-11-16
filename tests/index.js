const {
  fromYAML
} = require("../lib");
const path = require("path");

// console.log("current dir:", __dirname);
// console.log("root dir:", path.resolve( "." ));

fromYAML("./example.yaml")
  .then(x => {
      const used = process.memoryUsage();
      for (let key in used) {
        console.log(`${key} ${Math.round(used[key] / 1024 / 1024 * 100) / 100} MB`);
      }
    },
    x => {
      const used = process.memoryUsage();
      for (let key in used) {
        console.log(`${key} ${Math.round(used[key] / 1024 / 1024 * 100) / 100} MB`);
      }
    }
  )
