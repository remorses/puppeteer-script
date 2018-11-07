import { Browser, Page } from "puppeteer";

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

export const solveCaptcha = async (browser: Browser, page: Page,  sitekey = "", {proxy = false, ...options}) => {
  //recaptcha key from target website
  anticaptcha.setWebsiteURL(await page.url());
  anticaptcha.setWebsiteKey(sitekey);

  //proxy access parameters
  if (proxy) {
    anticaptcha.setProxyType(PROXY_TYPE);
    anticaptcha.setProxyAddress(PROXY_ADDRESS);
    anticaptcha.setProxyPort(PROXY_PORT);
    anticaptcha.setProxyLogin(PROXY_USER);
    anticaptcha.setProxyPassword(PROXY_PASS);
  }

  //browser header parameters
  anticaptcha.setUserAgent(await page.evaluate("navigator.userAgent"));
  anticaptcha.setCookies(await page.cookies());

  const balance = await getBalance
  if (balance > 0) {
    const taskId = await createTask
    const solution = await getTaskSolution(taskId)
  }
}






const getBalance: Promise<number> = new Promise((res, rej) => {
  anticaptcha.getBalance(
    (err, balance) => (err)
      ? rej(err)
      : res(balance))
})

const createTask: Promise<string> = new Promise((res, rej) => {
  anticaptcha.createTask((err, taskId) => {
    if (err) {
      rej(err)
    } else {
      res(taskId)
    }
  })
})

const getTaskSolution: (a: string) =>  Promise<Object> = taskId =>  new Promise((res, rej) => {
  anticaptcha.getTaskSolution(taskId, (err, taskSolution: any) => {
    if (err) {
      rej(err)
    } else {
      res(taskSolution)
    }
  })
}
