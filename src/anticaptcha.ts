


import { Browser, Page, Cookie } from "puppeteer";
import request from "request-promise-native"




// check balance first
const {
  ANTICAPTCHA_KEY,
  PROXY_ADDRESS,
  PROXY_PASS,
  PROXY_USER,
  PROXY_PORT,
  PROXY_TYPE
} = process.env


const HOSTNAME = "https://api.anti-captcha.com"
const PORT = 443


interface NoCaptcha {
  websiteURL: string,
  websiteKey: string,
  // websiteSToken: string,
  userAgent: string,
  cookies: string,
  languagePool: string
  callbackUrl?: string
}

interface NoCaptchaProxy extends NoCaptcha {
  proxyType: string,
  proxyAddress: string,
  proxyPort: number,
  proxyLogin: string,
  proxyPassword: string,
}

const defaults: NoCaptcha = {
  websiteURL: "",
  websiteKey: "",
  // websiteSToken: "",
  userAgent: "",
  cookies: "",
  languagePool: "en",
  // callbackUrl: ""
}


const createNoCaptchaTask = async (clientKey: string, options: NoCaptcha | NoCaptchaProxy = defaults) => {


    const postData = {
      clientKey: clientKey,
      task: { ...options, type: "NoCaptchaTask" },
      softId: 0
    }

    const response = await request({
      url: HOSTNAME + "/createTask",
      port: PORT,
      method: 'POST',
      headers: {
        'accept-encoding': 'gzip,deflate',
        'content-type': 'application/json; charset=utf-8',
        'accept': 'application/json',
        'content-length': Buffer.byteLength(JSON.stringify(postData))
      },
      json: postData
    })

    return response["taskId"]

  }

const getBalance = async (clientKey) => {


  const postData = {
    clientKey,
  }

  const response = await request({
    url: HOSTNAME + "/getBalance",
    port: PORT,
    method: 'POST',
    headers: {
      'accept-encoding': 'gzip,deflate',
      'content-type': 'application/json; charset=utf-8',
      'accept': 'application/json',
      'content-length': Buffer.byteLength(JSON.stringify(postData))
    },
    json: postData
  })

  return response["balance"]

}

const cookie = (obj: Cookie) => {
  const { name, value, domain, path, expires, httpOnly, session, secure, sameSite } = obj
  return name + "=" + value + "; " // + "expires=" + expires + ";"
}

export const solveNoCaptcha = async ( page: Page, clientKey, websiteKey, callbackUrl) => {

  const cookies: string = (await page.cookies())
    .map((obj) => cookie(obj))
    .join("")

  let options: NoCaptcha | NoCaptchaProxy = {
    websiteURL: await page.url(),
    websiteKey,
    userAgent: await page.evaluate("navigator.userAgent()"),
    cookies: cookies,
    languagePool: "en",
  }

  if (callbackUrl) options["callbackUrl"] = callbackUrl

  const balance = await getBalance(clientKey)
  if (balance > 0) return (await createNoCaptchaTask(clientKey))(options)

}


// const  clientKey =  "1d7f3f41c71b5ffb7640eda149dd73f8"
// getBalance(clientKey).then(console.log)
