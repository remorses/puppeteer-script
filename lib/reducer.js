"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var fs = __importStar(require("mz/fs"));
var path_1 = require("path");
// import { solveCaptcha } from "./anticaptcha/solveCaptcha";
var helpers_1 = require("./helpers");
var anticaptcha_1 = require("./anticaptcha");
// import { emulatePage } from "./emulate"
var logger = console.log;
var WORKING_DIR = path_1.dirname(require.main.filename);
var chalk_1 = __importDefault(require("chalk"));
var red = chalk_1.default.red, bold = chalk_1.default.bold, bgRed = chalk_1.default.bgRed, white = chalk_1.default.white;
exports.reducer = function (state, action) { return __awaiter(_this, void 0, void 0, function () {
    var page, _a, url, arg, selector, containing, element, arg, selector, containing, element, button, url_1, _page_1, time, _b, text, index, pages, length_1, newPage, newPage, index, pages, page_1, file, path, path, file, code, userAgent, path, file, path, content, selector, elem, siteKey, solution;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0: return [4 /*yield*/, state];
            case 1:
                page = _c.sent();
                _a = action.method;
                switch (_a) {
                    case "go-to": return [3 /*break*/, 2];
                    case "click": return [3 /*break*/, 5];
                    case "type": return [3 /*break*/, 9];
                    case "press": return [3 /*break*/, 15];
                    case "new-page": return [3 /*break*/, 16];
                    case "wait": return [3 /*break*/, 20];
                    case "echo": return [3 /*break*/, 25];
                    case "close-page": return [3 /*break*/, 26];
                    case "target-page": return [3 /*break*/, 46];
                    case "screenshot": return [3 /*break*/, 55];
                    case "inject": return [3 /*break*/, 56];
                    case "evaluate": return [3 /*break*/, 57];
                    case "set-user-agent": return [3 /*break*/, 58];
                    case "set-cookies": return [3 /*break*/, 60];
                    case "export-html": return [3 /*break*/, 62];
                    case "solve-nocaptcha": return [3 /*break*/, 65];
                }
                return [3 /*break*/, 69];
            case 2:
                url = action.arg;
                return [4 /*yield*/, helpers_1.preparePage(page)];
            case 3:
                _c.sent();
                return [4 /*yield*/, page.goto(url)];
            case 4:
                _c.sent();
                return [2 /*return*/, page];
            case 5:
                arg = action.arg;
                selector = void 0, containing = void 0;
                if (typeof arg === "object") {
                    selector = arg["selector"] || "";
                    containing = arg["containing"] || "/.*/";
                }
                else {
                    selector = arg;
                    containing = "/.*/";
                }
                return [4 /*yield*/, helpers_1.findElement(page, selector, containing)];
            case 6:
                element = _c.sent();
                if (!element)
                    throw new Error("no element found contining " + containing);
                return [4 /*yield*/, helpers_1.waitForElement(element)];
            case 7:
                _c.sent();
                return [4 /*yield*/, element.click({ clickCount: 2 })];
            case 8:
                _c.sent();
                return [2 /*return*/, page];
            case 9:
                arg = action.arg;
                if (!(typeof arg === "object")) return [3 /*break*/, 12];
                selector = arg.selector, containing = arg.containing;
                return [4 /*yield*/, helpers_1.findElement(page, selector, containing)];
            case 10:
                element = _c.sent();
                if (!element)
                    throw new Error("no element");
                return [4 /*yield*/, element.click()];
            case 11:
                _c.sent();
                return [3 /*break*/, 14];
            case 12: return [4 /*yield*/, page.keyboard.type(arg)];
            case 13:
                _c.sent();
                _c.label = 14;
            case 14: return [2 /*return*/, page];
            case 15:
                {
                    button = action.arg;
                    page.keyboard.press(button);
                    return [2 /*return*/, page];
                }
                _c.label = 16;
            case 16:
                url_1 = action.arg;
                _page_1 = page;
                return [4 /*yield*/, page.browser()];
            case 17: return [4 /*yield*/, (_c.sent()).newPage()
                    .then(function (page) { return _page_1 = page; })
                    // .then(async page => process.env["EMULATE"] ? await emulatePage(page, <any>process.env["EMULATE"]) : page)
                    .then(function (page) { return page.goto(url_1); })];
            case 18:
                _c.sent();
                return [4 /*yield*/, helpers_1.preparePage(_page_1)];
            case 19:
                _c.sent();
                return [2 /*return*/, _page_1];
            case 20:
                time = action.arg;
                if (!time) return [3 /*break*/, 22];
                return [4 /*yield*/, page.waitFor(time)];
            case 21:
                _b = _c.sent();
                return [3 /*break*/, 24];
            case 22: return [4 /*yield*/, helpers_1.waitForLoad(page)];
            case 23:
                _b = _c.sent();
                _c.label = 24;
            case 24:
                _b;
                return [2 /*return*/, page];
            case 25:
                {
                    text = action.arg;
                    logger(text);
                    return [2 /*return*/, page];
                }
                _c.label = 26;
            case 26:
                index = action.arg;
                return [4 /*yield*/, page.browser()];
            case 27: return [4 /*yield*/, (_c.sent()).pages()];
            case 28:
                pages = _c.sent();
                length_1 = __spread(pages).length;
                if (!(index < 0)) return [3 /*break*/, 37];
                pages[length_1 + index].close();
                _c.label = 29;
            case 29:
                if (!(pages.length >= length_1)) return [3 /*break*/, 33];
                logger(pages.length + " >= " + length_1);
                logger(pages.length + " >= " + length_1);
                return [4 /*yield*/, page.browser()];
            case 30: return [4 /*yield*/, (_c.sent()).pages()];
            case 31:
                pages = _c.sent();
                return [4 /*yield*/, page.waitFor(100)];
            case 32:
                _c.sent();
                return [3 /*break*/, 29];
            case 33: return [4 /*yield*/, pages[pages.length - 1]];
            case 34:
                newPage = _c.sent();
                if (!newPage) return [3 /*break*/, 36];
                return [4 /*yield*/, newPage.bringToFront()];
            case 35:
                _c.sent();
                _c.label = 36;
            case 36: return [2 /*return*/, newPage];
            case 37:
                pages[index].close();
                _c.label = 38;
            case 38:
                if (!(pages.length >= length_1)) return [3 /*break*/, 42];
                return [4 /*yield*/, page.browser()];
            case 39: return [4 /*yield*/, (_c.sent()).pages()];
            case 40:
                pages = _c.sent();
                return [4 /*yield*/, page.waitFor(100)];
            case 41:
                _c.sent();
                return [3 /*break*/, 38];
            case 42: return [4 /*yield*/, pages[pages.length - 1]];
            case 43:
                newPage = _c.sent();
                if (!newPage) return [3 /*break*/, 45];
                return [4 /*yield*/, newPage.bringToFront()];
            case 44:
                _c.sent();
                _c.label = 45;
            case 45: return [2 /*return*/, newPage];
            case 46:
                index = action.arg;
                return [4 /*yield*/, page.waitFor(100)];
            case 47:
                _c.sent();
                return [4 /*yield*/, page.browser()];
            case 48: return [4 /*yield*/, (_c.sent()).pages()];
            case 49:
                pages = _c.sent();
                if (!(index < 0)) return [3 /*break*/, 52];
                page_1 = pages[pages.length + index];
                return [4 /*yield*/, page_1.bringToFront()];
            case 50:
                _c.sent();
                return [4 /*yield*/, helpers_1.preparePage(page_1)];
            case 51:
                _c.sent();
                return [2 /*return*/, page_1];
            case 52: return [4 /*yield*/, pages[index].bringToFront()];
            case 53:
                _c.sent();
                return [4 /*yield*/, helpers_1.preparePage(pages[index])];
            case 54:
                _c.sent();
                return [2 /*return*/, pages[index]];
            case 55:
                {
                    file = action.arg;
                    path = path_1.join(WORKING_DIR, file);
                    page.screenshot({ path: path });
                    return [2 /*return*/, page];
                }
                _c.label = 56;
            case 56:
                {
                    path = action.arg;
                    file = fs.readFileSync(path_1.join(WORKING_DIR, path), 'utf8');
                    page.evaluate(file);
                    return [2 /*return*/, page];
                }
                _c.label = 57;
            case 57:
                {
                    code = action.arg;
                    page.evaluate(code);
                    return [2 /*return*/, page];
                }
                _c.label = 58;
            case 58:
                userAgent = action.arg;
                return [4 /*yield*/, page.setUserAgent(userAgent)];
            case 59:
                _c.sent();
                return [2 /*return*/, page];
            case 60:
                path = action.arg;
                file = require(path_1.join(WORKING_DIR, path));
                return [4 /*yield*/, page.setCookie.apply(page, __spread(file))];
            case 61:
                _c.sent();
                return [2 /*return*/, page];
            case 62:
                path = action.arg;
                return [4 /*yield*/, page.content()];
            case 63:
                content = _c.sent();
                return [4 /*yield*/, fs.writeFile(path_1.join(WORKING_DIR, path), content)];
            case 64:
                _c.sent();
                return [2 /*return*/, page];
            case 65:
                selector = action.arg;
                return [4 /*yield*/, page.$(selector)];
            case 66:
                elem = _c.sent();
                if (!elem)
                    throw new Error("can't find the captcha element with selector '" + selector + "'");
                return [4 /*yield*/, helpers_1.getAttribute(page, elem, "site-key")];
            case 67:
                siteKey = _c.sent();
                if (!process.env["ANTICAPTCHA_KEY"])
                    throw Error("please put ANTICAPTCHA_KEY in environment or anticaptcha-key in script file");
                return [4 /*yield*/, anticaptcha_1.solveNoCaptcha(page, process.env["ANTICAPTCHA_KEY"], siteKey, process.env["ANTICAPTCHA_CALLBACK"])
                    // TODO replace text-area in form with the sitekey
                ];
            case 68:
                solution = _c.sent();
                // TODO replace text-area in form with the sitekey
                return [2 /*return*/, page];
            case 69:
                {
                    logger(red(bold(action.method) + " still not implemented"));
                    return [2 /*return*/, page];
                }
                _c.label = 70;
            case 70: return [2 /*return*/];
        }
    });
}); };
