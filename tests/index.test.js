const { execute, Script } = require('../lib')
const puppeteer = require('puppeteer')
const c = require('chalk')

const CHROMIUM = '/Applications/Chromium.app/Contents/MacOS/Chromium'

const variables = { url: 'facebook.com'}

const run = async (callback = x => None) => {
  const browser = await puppeteer.launch({ executablePath: CHROMIUM, headless: false })
  const page = (await browser.pages())[0]

  const script = Script({ file: './example.yaml', data: variables })

  const data = await execute(script, page)

  callback(data)
}

run((data) => console.log(data)).catch(x => console.log(c.red(x), 'in \n' + x.stack))
