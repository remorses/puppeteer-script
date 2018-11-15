"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const emulate_1 = require("./emulate");
const abort_1 = require("./abort");
const puppeteer_1 = require("puppeteer");
const logger = console.log;
const chalk_1 = __importDefault(require("chalk"));
const { red, bold, bgRed, white } = chalk_1.default;
const logErr = (err) => logger(red(err.message + " in " + __filename));
exports.prepare = async (script) => pipe(makeEnv, makeOptions, makeBrowser)(script).catch(logErr);
const pipe = (...functions) => input => functions.reduce(async (promise, func) => func(await promise), Promise.resolve(input));
const makeEnv = async (script) => {
    const set = (variable) => {
        const scriptVariable = variable.toLowerCase().replace("_", "-");
        process.env[variable] = script[scriptVariable] || process.env[variable] || null;
    };
    set("EMULATE");
    set("ANTICAPTCHA_KEY");
    set("ANTICAPTCHA_CALLBACK");
    set("USER_AGENT");
    return script;
};
const makeOptions = async (script) => {
    const defaults = [];
    let options = {
        launchOPtions: {
            args: [...defaults, ...(script["args"] || [])],
            headless: !!script["headless"],
            defaultViewport: script["viewport"] || { width: 1000, height: 1000 },
            executablePath: script["executable"] || null
        },
        emulate: script["emulate"] || null,
        abort: script["abort"] || null
    };
    return options;
};
const makeBrowser = async (_a) => {
    var { launchOPtions } = _a, rest = __rest(_a, ["launchOPtions"]);
    return await puppeteer_1.launch(Object.assign({}, launchOPtions)).then(async (browser) => {
        if (rest.emulate)
            await emulate_1.emulate(browser, rest.emulate);
        if (rest.abort)
            await abort_1.abort(browser, rest.abort);
        return browser;
    });
};
