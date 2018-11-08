"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
// check balance first
const { ANTICAPTCHA_KEY, PROXY_ADDRESS, PROXY_PASS, PROXY_USER, PROXY_PORT, PROXY_TYPE } = process.env;
const anticaptcha = require('./anticaptcha')(ANTICAPTCHA_KEY);
exports.solveCaptcha = (browser, page, sitekey = "", _a) => __awaiter(this, void 0, void 0, function* () {
    var { proxy = false } = _a, options = __rest(_a, ["proxy"]);
    //recaptcha key from target website
    anticaptcha.setWebsiteURL(yield page.url());
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
    anticaptcha.setUserAgent(yield page.evaluate("navigator.userAgent"));
    anticaptcha.setCookies(yield page.cookies());
    const balance = yield getBalance;
    if (balance > 0) {
        const taskId = yield createTask;
        const solution = yield getTaskSolution(taskId);
    }
});
const getBalance = new Promise((res, rej) => {
    anticaptcha.getBalance((err, balance) => (err)
        ? rej(err)
        : res(balance));
});
const createTask = new Promise((res, rej) => {
    anticaptcha.createTask((err, taskId) => {
        if (err) {
            rej(err);
        }
        else {
            res(taskId);
        }
    });
});
const getTaskSolution = taskId => new Promise((res, rej) => {
    anticaptcha.getTaskSolution(taskId, (err, taskSolution) => {
        if (err) {
            rej(err);
        }
        else {
            res(taskSolution);
        }
    });
});
