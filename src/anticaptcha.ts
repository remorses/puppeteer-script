import { Browser, Page, Cookie } from "puppeteer";
import request from "request-promise-native"
require("dotenv").config()

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
   websiteSToken?: string,
  userAgent: string,
  cookies: string,
  languagePool: string
  callbackUrl?: string
  isInvisible?: boolean
}

interface NoCaptchaProxy extends NoCaptcha {
  proxyType: string,
  proxyAddress: string,
  proxyPort: number,
  proxyLogin: string,
  proxyPassword: string,
}




const createNoCaptchaTask = async (clientKey: string, options: NoCaptcha | NoCaptchaProxy) => {


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


  if (response["errId"] !== 0)
    return response["taskId"]
  else
    throw new Error("can't create a new task on anticaptcha, " + response["errId"])



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

const parseCookie = (obj: Cookie) => {
  const { name, value, domain, path, expires, httpOnly, session, secure, sameSite } = obj
  return name + "=" + value + "; " // + "expires=" + expires + ";"
}

export const solveNoCaptcha = async (page: Page, clientKey, websiteKey, callbackUrl) => {

  const cookies: string = (await page.cookies())
    .map((obj) => parseCookie(obj))
    .join("")

  let options: NoCaptcha | NoCaptchaProxy = {
    websiteURL: await page.url(),
    websiteKey: websiteKey,
    userAgent: await page.evaluate("navigator.userAgent()"),
    cookies: cookies,
    languagePool: "en",
  }

  if (callbackUrl) options["callbackUrl"] = callbackUrl

  const balance = await getBalance(clientKey)
  const taskId = await createNoCaptchaTask(clientKey, options)
  if (balance > 0) return taskId

}

(async () => {
  const clientKey = process.env.ANTICAPTCHA_KEY
  await getBalance(clientKey).then(console.log)
  await createNoCaptchaTask(clientKey,{
    websiteURL: "https://www.spotify.com/it/signup/?forward_url=https%3A%2F%2Fopen.spotify.com%2Fbrowse%2Ffeatured",
    websiteKey: "6LdaGwcTAAAAAJfb0xQdr3FqU4ZzfAc_QZvIPby5",
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.102 Safari/537.36",
    cookies: "",
    languagePool: "en",
    // callbackUrl: ""
  }).then(console.log).catch(console.log)
})()
