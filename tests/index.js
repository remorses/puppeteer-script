const {
  fromYAML,
  implementationFromScript
} = require("../lib");
const path = require("path");
const cpuStat = require("cpu-stat")
const memStat = require("mem-stat")
const {
  Cluster
} = require("puppeteer-cluster");

let cluster

const start = async () => {


  cluster = await Cluster.launch({
    concurrency: implementationFromScript("./example.yaml"),
    maxConcurrency: 2,
    monitor: true,
  });

  await cluster.task(fromYAML("./example.yaml"));

  cluster.on('taskerror', (err, data) => {
    console.log(`Error crawling ${data}: ${err.message}`);
  });

  await cluster.queue({
    url: 'http://www.google.com/'
  });


  await cluster.idle();
  await cluster.close();

}

setTimeout(() => cluster.queue({
  url: 'http://www.wikipedia.org/'
}), 5000)



start()
  .then(x => {
      const used = process.memoryUsage();
      console.log("memory usage:")
      for (let key in used) {
        console.log(`\t${key} ${Math.round(used[key] / 1024 / 1024 * 100) / 100} MB`);
      }
    },
    e => console.error(red(e.description))
  )



// setInterval(() => {
//   cpuStat.usagePercent(function (err, percent, seconds) {
//     if (err) {
//       return console.error(err);
//     }
//     //the percentage cpu usage over all cores
//     console.log(`using ${Math.round((percent * 100) / 100)}% of cpu`);
//     // console.log(`using ${Math.round(( memStat.usedPercent() * 100) / 100)}% of memory`);
//
//   })
//
// }, 2000)
