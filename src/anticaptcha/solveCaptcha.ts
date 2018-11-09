


import { Browser, Page } from "puppeteer";
import request from "request-promise-native"
import tough from "tough-cookie"

// check balance first
const {
  ANTICAPTCHA_KEY,
  PROXY_ADDRESS,
  PROXY_PASS,
  PROXY_USER,
  PROXY_PORT,
  PROXY_TYPE
} = process.env

const anticaptcha: any = require('./anticaptcha')(ANTICAPTCHA_KEY);


interface NoCaptcha {
  websiteURL: string,
  websiteKey: string,
  websiteSToken: string,
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
  websiteSToken: "",
  userAgent: "",
  cookies: "",
  languagePool: "en",
  // callbackUrl: ""
}


const createNoCaptchaTask = (params) =>
  async (options: NoCaptcha | NoCaptchaProxy = defaults) => {

    const { clientKey, softId, hostname, port } = params

    const postData = {
      clientKey: clientKey,
      task: { ...options, type: "NoCaptchaTask" },
      softId: softId
    }

    const response = await request({
      url: hostname + "/createTask",
      port: port,
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

const getBalance = async (params) => {

  const { clientKey, softId, hostname, port } = params

  const postData = {
    clientKey,
  }

  const response = await request({
    url: hostname + "/getBalance",
    port: port,
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



const solveCaptcha = async (params, page) => {

  const options {
    websiteURL: await page.url(),
    websiteKey: string,
    websiteSToken: string,
    userAgent: string,
    cookies: string,
    languagePool: string
    callbackUrl?: string
  }

  const balance = await getBalance(params)
  if (balance > 0) return (await createNoCaptchaTask(params))(options)

}



const sessionCookie = new tough.Cookie({
  key: 'some_key',
  value: 'some_value',
  domain: 'api.mydomain.com',
  httpOnly: true,
  maxAge: 31536000
});

var cookiejar = request.jar();

cookiejar.setCookie(sessionCookie, 'https://api.mydomain.com');
