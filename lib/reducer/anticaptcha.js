"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const request_promise_native_1 = __importDefault(require("request-promise-native"));
require("dotenv").config();
// check balance first
const { ANTICAPTCHA_KEY, PROXY_ADDRESS, PROXY_PASS, PROXY_USER, PROXY_PORT, PROXY_TYPE } = process.env;
const HOSTNAME = "https://api.anti-captcha.com";
const PORT = 443;
const createNoCaptchaTask = async (clientKey, options) => {
    const postData = {
        clientKey: clientKey,
        task: Object.assign({}, options, { type: "NoCaptchaTask" }),
        softId: 0
    };
    const response = await request_promise_native_1.default({
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
    });
    if (response["errId"] !== 0)
        return response["taskId"];
    else
        throw new Error("can't create a new task on anticaptcha, " + response["errId"]);
};
const getBalance = async (clientKey) => {
    const postData = {
        clientKey,
    };
    const response = await request_promise_native_1.default({
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
    });
    return response["balance"];
};
const parseCookie = (obj) => {
    const { name, value, domain, path, expires, httpOnly, session, secure, sameSite } = obj;
    return name + "=" + value + "; "; // + "expires=" + expires + ";"
};
exports.solveNoCaptcha = async (page, clientKey, websiteKey, callbackUrl) => {
    const cookies = (await page.cookies())
        .map((obj) => parseCookie(obj))
        .join("");
    let options = {
        websiteURL: await page.url(),
        websiteKey: websiteKey,
        userAgent: await page.evaluate("navigator.userAgent()"),
        cookies: cookies,
        languagePool: "en",
    };
    if (callbackUrl)
        options["callbackUrl"] = callbackUrl;
    const balance = await getBalance(clientKey);
    const taskId = await createNoCaptchaTask(clientKey, options);
    if (balance > 0)
        return taskId;
};
// (async () => {
//   const clientKey = process.env.ANTICAPTCHA_KEY
//   if (!clientKey) return
//   await getBalance(clientKey).then(console.log)
//   await createNoCaptchaTask(clientKey,{
//     websiteURL: "https://www.spotify.com/it/signup/?forward_url=https%3A%2F%2Fopen.spotify.com%2Fbrowse%2Ffeatured",
//     websiteKey: "6LdaGwcTAAAAAJfb0xQdr3FqU4ZzfAc_QZvIPby5",
//     userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.102 Safari/537.36",
//     cookies: "",
//     languagePool: "en",
//     // callbackUrl: ""
//   }).then(console.log).catch(console.log)
// })()
