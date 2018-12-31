const { execute, Script } = require('../lib')
const puppeteer = require('puppeteer')
const c = require('chalk')

const CHROMIUM = '/Applications/Chromium.app/Contents/MacOS/Chromium'

const run = async (callback = data => None) => {
  const browser = await puppeteer.launch({ executablePath: CHROMIUM})
  const page = (await browser.pages())[0]

  const script = Script({ file: './example.yaml', data: { url: 'facebook.com'} })

  const data = await execute(script, page)

  callback(data)
}

run((data) => console.log(data)).catch(x => console.log(c.red(x), 'in \n' + x.stack))
