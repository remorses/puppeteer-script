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
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var fs = __importStar(require("mz/fs"));
var path_1 = require("path");
// import { solveCaptcha } from "./anticaptcha/solveCaptcha";
var helpers_1 = require("./helpers");
var anticaptcha_1 = require("./anticaptcha");
var emulate_1 = require("./emulate");
var WORKING_DIR = path_1.dirname(require.main.filename);
var preparePage = function (page) { return __awaiter(_this, void 0, void 0, function () {
    var _a, EMULATE;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = process.env.EMULATE, EMULATE = _a === void 0 ? null : _a;
                if (!EMULATE) return [3 /*break*/, 2];
                return [4 /*yield*/, emulate_1.emulatePage(page, EMULATE)];
            case 1:
                _b.sent();
                _b.label = 2;
            case 2: return [4 /*yield*/, page._client.send('Emulation.clearDeviceMetricsOverride')];
            case 3:
                _b.sent();
                return [2 /*return*/];
        }
    });
}); };
exports.makeDoSteps = function (browser, logger) { return ({
    "go-to": function (page) { return function (url) {
        if (url === void 0) { url = ""; }
        return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, preparePage(page)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, page.goto(url)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, page];
                }
            });
        });
    }; },
    // TODO create interface
    "click": function (page) { return function (arg) { return __awaiter(_this, void 0, void 0, function () {
        var selector, containing, element;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (typeof arg === "object") {
                        selector = arg["selector"] || "";
                        containing = arg["containing"] || "/.*/";
                    }
                    else {
                        selector = arg;
                        containing = "/.*/";
                    }
                    return [4 /*yield*/, helpers_1.findElement(page, selector, containing)];
                case 1:
                    element = _a.sent();
                    if (!element)
                        throw new Error("no element found contining " + containing);
                    return [4 /*yield*/, helpers_1.waitForElement(element)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, element.click({ clickCount: 2 })];
                case 3:
                    _a.sent();
                    return [2 /*return*/, page];
            }
        });
    }); }; },
    "type": function (page) { return function (arg) { return __awaiter(_this, void 0, void 0, function () {
        var selector, containing, element;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(typeof arg === "object")) return [3 /*break*/, 3];
                    selector = arg.selector, containing = arg.containing;
                    return [4 /*yield*/, helpers_1.findElement(page, selector, containing)];
                case 1:
                    element = _a.sent();
                    if (!element)
                        throw new Error("no element");
                    return [4 /*yield*/, element.click()];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 5];
                case 3: return [4 /*yield*/, page.keyboard.type(arg)];
                case 4:
                    _a.sent();
                    _a.label = 5;
                case 5: return [2 /*return*/, page];
            }
        });
    }); }; },
    "press": function (page) { return function (button) {
        page.keyboard.press(button);
        return page;
    }; },
    "new-page": function (page) { return function (url) {
        if (url === void 0) { url = ""; }
        return __awaiter(_this, void 0, void 0, function () {
            var _page;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _page = page;
                        return [4 /*yield*/, browser.newPage()
                                .then(function (page) { return _page = page; })
                                // .then(async page => process.env["EMULATE"] ? await emulatePage(page, <any>process.env["EMULATE"]) : page)
                                .then(function (page) { return page.goto(url); })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, preparePage(_page)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, _page];
                }
            });
        });
    }; },
    "wait": function (page) { return function (time) {
        if (time === void 0) { time = 0; }
        return __awaiter(_this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!time) return [3 /*break*/, 2];
                        return [4 /*yield*/, page.waitFor(time)];
                    case 1:
                        _a = _b.sent();
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, helpers_1.waitForLoad(page)];
                    case 3:
                        _a = _b.sent();
                        _b.label = 4;
                    case 4:
                        _a;
                        return [2 /*return*/, page];
                }
            });
        });
    }; },
    "echo": function (page) { return function (text) {
        if (text === void 0) { text = ""; }
        logger(text);
        return page;
    }; },
    "close-page": function (page) { return function (index) {
        if (index === void 0) { index = -1; }
        return __awaiter(_this, void 0, void 0, function () {
            var pages, length, newPage, newPage;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser.pages()];
                    case 1:
                        pages = _a.sent();
                        length = __spread(pages).length;
                        if (!(index < 0)) return [3 /*break*/, 9];
                        pages[length + index].close();
                        _a.label = 2;
                    case 2:
                        if (!(pages.length >= length)) return [3 /*break*/, 5];
                        logger(pages.length + " >= " + length);
                        logger(pages.length + " >= " + length);
                        return [4 /*yield*/, browser.pages()];
                    case 3:
                        pages = _a.sent();
                        return [4 /*yield*/, page.waitFor(100)];
                    case 4:
                        _a.sent();
                        return [3 /*break*/, 2];
                    case 5: return [4 /*yield*/, pages[pages.length - 1]];
                    case 6:
                        newPage = _a.sent();
                        if (!newPage) return [3 /*break*/, 8];
                        return [4 /*yield*/, newPage.bringToFront()];
                    case 7:
                        _a.sent();
                        _a.label = 8;
                    case 8: return [2 /*return*/, newPage];
                    case 9:
                        pages[index].close();
                        _a.label = 10;
                    case 10:
                        if (!(pages.length >= length)) return [3 /*break*/, 13];
                        return [4 /*yield*/, browser.pages()];
                    case 11:
                        pages = _a.sent();
                        return [4 /*yield*/, page.waitFor(100)];
                    case 12:
                        _a.sent();
                        return [3 /*break*/, 10];
                    case 13: return [4 /*yield*/, pages[pages.length - 1]];
                    case 14:
                        newPage = _a.sent();
                        if (!newPage) return [3 /*break*/, 16];
                        return [4 /*yield*/, newPage.bringToFront()];
                    case 15:
                        _a.sent();
                        _a.label = 16;
                    case 16: return [2 /*return*/, newPage];
                }
            });
        });
    }; },
    "target-page": function (page) { return function (index) {
        if (index === void 0) { index = -1; }
        return __awaiter(_this, void 0, void 0, function () {
            var pages, page_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, page.waitFor(100)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, browser.pages()];
                    case 2:
                        pages = _a.sent();
                        if (!(index < 0)) return [3 /*break*/, 5];
                        page_1 = pages[pages.length + index];
                        return [4 /*yield*/, page_1.bringToFront()];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, preparePage(page_1)];
                    case 4:
                        _a.sent();
                        return [2 /*return*/, page_1];
                    case 5: return [4 /*yield*/, pages[index].bringToFront()];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, preparePage(pages[index])];
                    case 7:
                        _a.sent();
                        return [2 /*return*/, pages[index]];
                }
            });
        });
    }; },
    "screenshot": function (page) { return function (file) {
        var path = path_1.join(WORKING_DIR, file);
        page.screenshot({ path: path });
        return page;
    }; },
    "inject": function (page) { return function (path) {
        var file = fs.readFileSync(path_1.join(WORKING_DIR, path), 'utf8');
        page.evaluate(file);
        return page;
    }; },
    "evaluate": function (page) { return function (code) {
        if (code === void 0) { code = ""; }
        page.evaluate(code);
        return page;
    }; },
    "set-user-agent": function (page) { return function (userAgent) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, page.setUserAgent(userAgent)];
                case 1:
                    _a.sent();
                    return [2 /*return*/, page];
            }
        });
    }); }; },
    "set-cookies": function (page) { return function (path) { return __awaiter(_this, void 0, void 0, function () {
        var file;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    file = require(path_1.join(WORKING_DIR, path));
                    return [4 /*yield*/, page.setCookie.apply(page, __spread(file))];
                case 1:
                    _a.sent();
                    return [2 /*return*/, page];
            }
        });
    }); }; },
    "export-html": function (page) { return function (path) { return __awaiter(_this, void 0, void 0, function () {
        var content;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, page.content()];
                case 1:
                    content = _a.sent();
                    return [4 /*yield*/, fs.writeFile(path_1.join(WORKING_DIR, path), content)];
                case 2:
                    _a.sent();
                    return [2 /*return*/, page];
            }
        });
    }); }; },
    // "block": (page: Page) => async ({ requests, responses, }) => {
    //   const promises1 = requests.map(({ to: url, types: types }) => block(browser, types, url))
    //   const promises2 = responses.map(({ from: url, types: types }) => redirect(browser, types, url))
    //   await Promise.all([...promises1, ...promises2])
    //   return page
    // },
    // "redirect": (page: Page) => async ({ requests, responses, to }) => {
    //   const promises1 = requests.map(({ to: url, types: types }) => abort(browser, types, url))
    //   const promises2 = responses.map(({ from: url, types: types }) => redirect(browser, types, url))
    //   await Promise.all([...promises1, ...promises2])
    //   return page
    // },
    "solve-nocaptcha": function (page) { return function (selector) { return __awaiter(_this, void 0, void 0, function () {
        var elem, siteKey, solution;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, page.$(selector)];
                case 1:
                    elem = _a.sent();
                    if (!elem)
                        throw new Error("can't find the captcha element with selector '" + selector + "'");
                    return [4 /*yield*/, helpers_1.getAttribute(page, elem, "site-key")];
                case 2:
                    siteKey = _a.sent();
                    if (!process.env["ANTICAPTCHA_KEY"])
                        throw Error("please put ANTICAPTCHA_KEY in environment or anticaptcha-key in script file");
                    return [4 /*yield*/, anticaptcha_1.solveNoCaptcha(page, process.env["ANTICAPTCHA_KEY"], siteKey, process.env["ANTICAPTCHA_CALLBACK"])
                        // TODO replace text-area in form with the sitekey
                    ];
                case 3:
                    solution = _a.sent();
                    // TODO replace text-area in form with the sitekey
                    return [2 /*return*/, page];
            }
        });
    }); }; },
}); };
