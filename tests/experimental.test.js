import { launch } from "puppeteer-script"

const data = {
  url: "wikipedia.com",
  database: "db://localhost"
}

launch({ file: "./example.yaml", data })

launch({ json: "json", data })
  .then(({ name, content, selector }) => {
    storeInDatabase(name, content)
  })

// launch :: ({ json }) =>



////////////////////////////////////////////////////////////////////////////////
const { Worker, execute } = require("puppeteer-script")


let worker = Worker.launch({
  file: "example.yaml",
  data: data
})

worker.execute()
  .then(({ name, content, selector }) => {
    storeInDatabase(name, content)
  })
  .catch(console.log)


////////////////////////////////////////////////////////////////////////////////
const { Script, execute } = require("puppeteer-script/cluster")
const { Cluster } = require("puppeteer-cluster")

const handler = ({ name, content, selector }) => {
  storeInDatabase(name, content)
}

let cluster = Cluster.launch({
  scriptFile: "./example.yaml",
  scriptJson: json,
  handler: handler,
  maxConcurrency: 2,
  monitor: true,
})

cluster.queue(data)

////////////////////////////////////////////////////////////////////////////////
const { Script, execute } = require("puppeteer-script")


let script = new Script({
  file: "example.yaml",
  data: data
})

execute(script, { browser: null, connect: "ws://url" })
  .then(({ name, content, selector }) => {
    storeInDatabase(name, content)
  })
  .catch(console.log)


////////////////////////////////////////////////////////////////////////////////
const { Script, execute } = require("puppeteer-script")
const { Cluster } = require("puppeteer-cluster")

let script = new Script({
  file: "example.yaml",
  data: false
})

let cluster = await Cluster.launch({
  maxConcurrency: 2,
  monitor: true,
})

await cluster.task(script)

cluster.queue(data)

execute(script, { data: data1, browser: browser })
  .then(({ name, content, selector }) => {
    storeInDatabase(name, content)
  })
  .catch(console.log)

execute(script, { data: data2, browser: browser })
  .then(({ name, content, selector }) => {
    storeInDatabase(name, content)
  })
  .catch(console.log)




////////////////////////////////////////////////////////////////////////////////
const { Script, execute } = require("puppeteer-script")
const { Cluster } = require("puppeteer-cluster")

let script = new Script({
  file: "example.yaml",
  data: false
})

let cluster = Cluster.launch({
    maxConcurrency: 2,
    monitor: true
  })
  .then(cluster => cluster.task(script))

cluster.queue(data)
  .then(({ scraped }) => storeToDatabase(scraped))



////////////////////////////////////////////////////////////////////////////////
const { Script, execute } = require("puppeteer-script")
const { Cluster } = require("puppeteer-cluster")

let script = Script({ // returns async (page, data, worker) => ()
  file: "example.yaml",
  data: false,
})

let cluster = await Cluster.launch({
  maxConcurrency: 2,
  monitor: true,
  concurrency: script.CONCURRENCY_PAGE
})


run(script, { data, cluster })
  .then(handler)
  .catch(console.log)

run(script, { data, browser })
  .then(handler)
  .catch(console.log)


////////////////////////////////////////////////////////////////////////////////
const { prepare, execute } = require("puppeteer-script")

const browser = prepare({ file: "./s.yaml" })
execute({ file: "./s.yaml", data, browser })
  .then(({ names }) => {
    name.map(obj => {
      const { content, href, style, attribute } = obj
      new User({ name: content })
        .save()
    })
  })






const traverse = (result, { as, content, children, ...rest }) => {

  const attributes = Object.keys(rest)
    .reduce((result, key) => ({ ...result, [as + '_' + key]: rest[value] }), {})

  if (children) return result.concat(children.reduce(traverse, [{ ...final, [as]: content, ...attributes }]))
  return result.concat([{ ...final, [as]: content, ...attributes }])
}


const returned = {
  data: [{
      as: "film",
      content: "film1",
      href: "url.com",
      children: [{
        as: "vote",
        content: "vote now!",
        children: [{
            as: number,
            content: 30
          }, {
            as: number,
            content: 24
          },
          {
            as: number,
            content: 79
          }
        ]
      }]
    },
    {
      as: "film",
      content: "film2",
      href: "url.com",
      children: [{
        as: "vote",
        content: "vote now!",
        children: [{
            as: "number",
            content: 30
          }, {
            as: "number",
            content: 24
          },
          {
            as: "number",
            content: 79
          }
        ]
      }]
    }
  ]
}



const votes = votes.reduce(traverse)
