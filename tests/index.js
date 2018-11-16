const {
  fromYAML
} = require("../lib");
const path = require("path");
const cpuStat = require("cpu-stat")
const memStat = require("mem-stat")

// console.log("current dir:", __dirname)
// console.log("root dir:", path.resolve( "." ))

fromYAML("./example.yaml")
  .then(x => {
      const used = process.memoryUsage();
      for (let key in used) {
        console.log(`${key} ${Math.round(used[key] / 1024 / 1024 * 100) / 100} MB`);
      }
    },
    x => {
      const used = process.memoryUsage();
      console.log(`memory usge: `)
      for (let key in used) {
        console.log(`\t ${key} ${Math.round(used[key] / 1024 / 1024 * 100) / 100} MB`);
      }
    }
  )



setInterval(() => {
  cpuStat.usagePercent(function (err, percent, seconds) {
    if (err) {
      return console.error(err);
    }
    //the percentage cpu usage over all cores
    console.log(`using ${Math.round((percent * 100) / 100)}% of cpu`);
    // console.log(`using ${Math.round(( memStat.usedPercent() * 100) / 100)}% of memory`);

  })

}, 2000)
