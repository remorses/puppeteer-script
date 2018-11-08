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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("mz/fs"));
const path_1 = require("path");
// import { solveCaptcha } from "./anticaptcha/solveCaptcha";
const puppeteerDevices = require('puppeteer/DeviceDescriptors');
const myDevices = require("./devices");
const devices = Object.assign({}, puppeteerDevices, myDevices);
exports.default = (browser, logger) => ({
    "executable": (x) => x,
    "headless": (x) => x,
    "abort": (resources = []) => abortBrowserRequests(browser, resources),
    "emulate": (device) => emulateBrowser(browser, device),
    "do": {
        // TODO create interface
        "click": (page) => (arg) => __awaiter(this, void 0, void 0, function* () {
            if (typeof arg === "object") {
                const { selector = "", containing = "" } = arg, options = __rest(arg, ["selector", "containing"]);
                logger(selector);
                const element = yield yield (findElement(page, selector, containing));
                logger(element);
                if (!element)
                    throw new Error("no element");
                yield element.click();
            }
            else {
                yield page.click(arg);
            }
            return page;
        }),
        "type": (page) => (arg) => __awaiter(this, void 0, void 0, function* () {
            if (typeof arg === "object") {
                const { selector, containing } = arg, options = __rest(arg, ["selector", "containing"]);
                const element = yield findElement(page, selector, containing);
                if (!element)
                    throw new Error("no element");
                yield element.click();
            }
            else {
                page.keyboard.type(arg);
            }
            return page;
        }),
        "press": (page) => (button) => {
            page.keyboard.press(button);
            return page;
        },
        "new page": (page) => (url = "") => {
            let _page = page;
            browser.newPage()
                .then(page => _page = page)
                .then(page => page.goto(url));
            return _page;
        },
        "go to": (page) => (url = "") => __awaiter(this, void 0, void 0, function* () {
            yield page.goto(url);
            return page;
        }),
        "wait": (page) => (time = 0) => __awaiter(this, void 0, void 0, function* () {
            time ? yield page.waitFor(time) : yield waitForLoad(page);
            return page;
        }),
        "echo": (page) => (text = "") => {
            logger(text);
            return page;
        },
        "close page": (page) => (index = -1) => __awaiter(this, void 0, void 0, function* () {
            const pages = yield browser.pages();
            if (index < 0) {
                const newPage = yield changedPage(browser);
                pages[pages.length + index].close();
                return yield newPage;
            }
            else {
                const newPage = yield changedPage(browser);
                yield pages[index].close();
                return yield newPage;
            }
        }),
        "target page": (page) => (index = -1) => __awaiter(this, void 0, void 0, function* () {
            const pages = yield browser.pages();
            if (index < 0) {
                pages[pages.length + index].bringToFront();
                return pages[pages.length + index];
            }
            else {
                yield pages[index].bringToFront();
                return pages[index];
            }
        }),
        "screenshot": (page) => (file) => {
            let path = path_1.resolve(file);
            page.screenshot({ path });
            return page;
        },
        "inject": (page) => (path) => {
            const file = fs.readFileSync(path_1.resolve(path), 'utf8');
            page.evaluate(file);
            return page;
        },
        "evaluate": (page) => (code = "") => {
            page.evaluate(code);
            return page;
        },
        "set user agent": (page) => (path) => {
            const file = fs.readFileSync(path_1.resolve(path), 'utf8');
            page.setUserAgent(file);
            return page;
        },
        "set cookies": (page) => (path) => {
            const file = require(path_1.resolve(path));
            page.setCookie(...file);
            return page;
        },
        "export html": (page) => (path) => __awaiter(this, void 0, void 0, function* () {
            const content = yield page.content();
            yield fs.writeFile(path_1.resolve(path), content);
            return page;
        }),
    }
});
const waitForLoad = (page) => new Promise((resolve) => {
    page.on('request', (req) => {
        setTimeout(() => resolve("timeOut"), 600);
    });
    setTimeout(() => resolve("timeOut"), 2500);
});
const abortPageRequests = (page, types = []) => __awaiter(this, void 0, void 0, function* () {
    yield page.setRequestInterception(true);
    page.on('request', req => {
        if (types.some(x => x === req.resourceType()))
            req.abort();
        else
            req.continue();
    });
});
const abortBrowserRequests = (browser, types = []) => __awaiter(this, void 0, void 0, function* () {
    const pages = yield browser.pages();
    pages.forEach((page) => abortPageRequests(page, types));
    browser.on('targetcreated', (target) => __awaiter(this, void 0, void 0, function* () { return abortPageRequests(yield target.page(), types); }));
});
// TODO add other desktop devices
const emulatePage = (page, device) => __awaiter(this, void 0, void 0, function* () {
    page.emulate(devices[device]);
});
// TODO add other desktop devices
const emulateBrowser = (browser, device) => __awaiter(this, void 0, void 0, function* () {
    const pages = yield browser.pages();
    pages.forEach((page) => emulatePage(page, device));
    browser.on('targetcreated', (target) => __awaiter(this, void 0, void 0, function* () { return emulatePage(yield target.page(), device); }));
});
// TODO regex
const findElement = (page, selector = "div", regex = "/.*/") => __awaiter(this, void 0, void 0, function* () {
    console.log(regex);
    yield page.waitForSelector(selector);
    const elements = yield page.$$(selector);
    console.log(elements.length);
    if (elements.length < 1)
        return null;
    for (let element of elements) {
        let inner = (yield getContent(element)) || "";
        console.log("inner: " + inner);
        // if (!inner) return null
        //  debug(inner.trim())
        if (new RegExp(regex).test(inner.trim())) {
            // debug(inner, ", findElement");
            return element;
        }
    }
    return null;
});
const getContent = (element) => __awaiter(this, void 0, void 0, function* () {
    const inner = yield element.getProperty("textContent");
    if (!inner)
        console.log(inner);
    return "";
    return (yield inner.jsonValue()).trim();
});
exports.getAttribute = (page, element, attribute) => __awaiter(this, void 0, void 0, function* () {
    const value = yield page.evaluate((element, attribute) => element.attribute, element, attribute);
    return value;
});
const changedPage = (browser) => __awaiter(this, void 0, void 0, function* () {
    return new Promise(x => browser.on('targetchanged', (target) => __awaiter(this, void 0, void 0, function* () {
        if (target.type() === 'page') {
            x(yield target.page());
        }
    })));
});
