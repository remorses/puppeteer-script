"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
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
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var fs = __importStar(require("mz/fs"));
var path_1 = require("path");
// import { solveCaptcha } from "./anticaptcha/solveCaptcha";
var puppeteerDevices = require('puppeteer/DeviceDescriptors');
var myDevices = require("./devices");
var devices = __assign({}, puppeteerDevices, myDevices);
var WORKING_DIR = path_1.dirname(require.main.filename);
exports.default = (function (browser, logger) { return ({
    "executable": function (x) { return x; },
    "headless": function (x) { return x; },
    "abort": function (resources) {
        if (resources === void 0) { resources = []; }
        return abortBrowserRequests(browser, resources);
    },
    "emulate": function (device) { return emulateBrowser(browser, device); },
    "do": {
        // TODO create interface
        "click": function (page) { return function (arg) { return __awaiter(_this, void 0, void 0, function () {
            var _a, selector, _b, containing, options, element;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (!(typeof arg === "object")) return [3 /*break*/, 4];
                        _a = arg.selector, selector = _a === void 0 ? "" : _a, _b = arg.containing, containing = _b === void 0 ? "" : _b, options = __rest(arg, ["selector", "containing"]);
                        return [4 /*yield*/, (findElement(page, selector, containing))
                            // logger(element)
                        ];
                    case 1: return [4 /*yield*/, _c.sent()
                        // logger(element)
                    ];
                    case 2:
                        element = _c.sent();
                        // logger(element)
                        if (!element)
                            throw new Error("no element");
                        return [4 /*yield*/, element.click()];
                    case 3:
                        _c.sent();
                        return [3 /*break*/, 6];
                    case 4: return [4 /*yield*/, page.click(arg)];
                    case 5:
                        _c.sent();
                        _c.label = 6;
                    case 6: return [2 /*return*/, page];
                }
            });
        }); }; },
        "type": function (page) { return function (arg) { return __awaiter(_this, void 0, void 0, function () {
            var selector, containing, options, element;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(typeof arg === "object")) return [3 /*break*/, 3];
                        selector = arg.selector, containing = arg.containing, options = __rest(arg, ["selector", "containing"]);
                        return [4 /*yield*/, findElement(page, selector, containing)];
                    case 1:
                        element = _a.sent();
                        if (!element)
                            throw new Error("no element");
                        return [4 /*yield*/, element.click()];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        page.keyboard.type(arg);
                        _a.label = 4;
                    case 4: return [2 /*return*/, page];
                }
            });
        }); }; },
        "press": function (page) { return function (button) {
            page.keyboard.press(button);
            return page;
        }; },
        "new page": function (page) { return function (url) {
            if (url === void 0) { url = ""; }
            return __awaiter(_this, void 0, void 0, function () {
                var _page;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _page = page;
                            return [4 /*yield*/, browser.newPage()
                                    .then(function (page) { return _page = page; })
                                    .then(function (page) { return page.goto(url); })];
                        case 1:
                            _a.sent();
                            return [2 /*return*/, _page];
                    }
                });
            });
        }; },
        "go to": function (page) { return function (url) {
            if (url === void 0) { url = ""; }
            return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, page.goto(url)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/, page];
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
                        case 2: return [4 /*yield*/, waitForLoad(page)];
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
            logger(text + "\n");
            return page;
        }; },
        "close page": function (page) { return function (index) {
            if (index === void 0) { index = -1; }
            return __awaiter(_this, void 0, void 0, function () {
                var pages, length, newPage, newPage;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, browser.pages()];
                        case 1:
                            pages = _a.sent();
                            length = pages.slice().length;
                            if (!(index < 0)) return [3 /*break*/, 7];
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
                            newPage.bringToFront();
                            return [2 /*return*/, newPage];
                        case 7:
                            pages[index].close();
                            _a.label = 8;
                        case 8:
                            if (!(pages.length >= length)) return [3 /*break*/, 11];
                            return [4 /*yield*/, browser.pages()];
                        case 9:
                            pages = _a.sent();
                            return [4 /*yield*/, page.waitFor(100)];
                        case 10:
                            _a.sent();
                            return [3 /*break*/, 8];
                        case 11: return [4 /*yield*/, pages[pages.length - 1]];
                        case 12:
                            newPage = _a.sent();
                            newPage.bringToFront();
                            return [2 /*return*/, newPage];
                    }
                });
            });
        }; },
        "target page": function (page) { return function (index) {
            if (index === void 0) { index = -1; }
            return __awaiter(_this, void 0, void 0, function () {
                var pages;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, page.waitFor(100)];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, browser.pages()];
                        case 2:
                            pages = _a.sent();
                            if (!(index < 0)) return [3 /*break*/, 3];
                            pages[pages.length + index].bringToFront();
                            return [2 /*return*/, pages[pages.length + index]];
                        case 3: return [4 /*yield*/, pages[index].bringToFront()];
                        case 4:
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
        "set user agent": function (page) { return function (path) {
            var file = fs.readFileSync(path_1.join(WORKING_DIR, path), 'utf8');
            page.setUserAgent(file);
            return page;
        }; },
        "set cookies": function (page) { return function (path) {
            var file = require(path_1.join(WORKING_DIR, path));
            page.setCookie.apply(page, file);
            return page;
        }; },
        "export html": function (page) { return function (path) { return __awaiter(_this, void 0, void 0, function () {
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
    }
}); });
var waitForLoad = function (page) { return new Promise(function (res) {
    page.once('request', function (req) {
        setTimeout(function () { return page.once("request", function () { return setTimeout(function () { return res(); }, 600); }); }, 600);
    });
    setTimeout(function () { return res(); }, 2500);
}); };
var abortPageRequests = function (page, types) {
    if (types === void 0) { types = []; }
    return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, page.setRequestInterception(true)];
                case 1:
                    _a.sent();
                    page.on('request', function (req) {
                        if (types.some(function (x) { return x === req.resourceType(); }))
                            req.abort();
                        else
                            req.continue();
                    });
                    return [2 /*return*/];
            }
        });
    });
};
var abortBrowserRequests = function (browser, types) {
    if (types === void 0) { types = []; }
    return __awaiter(_this, void 0, void 0, function () {
        var pages;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, browser.pages()];
                case 1:
                    pages = _a.sent();
                    pages.forEach(function (page) { return abortPageRequests(page, types); });
                    browser.on('targetcreated', function (target) { return __awaiter(_this, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                _a = abortPageRequests;
                                return [4 /*yield*/, target.page()];
                            case 1: return [2 /*return*/, _a.apply(void 0, [_b.sent(), types])];
                        }
                    }); }); });
                    return [2 /*return*/];
            }
        });
    });
};
// TODO add other desktop devices
var emulatePage = function (page, device) { return __awaiter(_this, void 0, void 0, function () {
    return __generator(this, function (_a) {
        page.emulate(devices[device]);
        return [2 /*return*/];
    });
}); };
// TODO add other desktop devices
var emulateBrowser = function (browser, device) { return __awaiter(_this, void 0, void 0, function () {
    var pages;
    var _this = this;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, browser.pages()];
            case 1:
                pages = _a.sent();
                pages.forEach(function (page) { return emulatePage(page, device); });
                browser.on('targetcreated', function (target) { return __awaiter(_this, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _a = emulatePage;
                            return [4 /*yield*/, target.page()];
                        case 1: return [2 /*return*/, _a.apply(void 0, [_b.sent(), device])];
                    }
                }); }); });
                return [2 /*return*/];
        }
    });
}); };
// TODO regex
var findElement = function (page, selector, regex) {
    if (selector === void 0) { selector = "div"; }
    if (regex === void 0) { regex = "/.*/"; }
    return __awaiter(_this, void 0, void 0, function () {
        var elements, _i, elements_1, element, inner;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: 
                // logger(regex)
                return [4 /*yield*/, page.waitForSelector(selector)];
                case 1:
                    // logger(regex)
                    _a.sent();
                    return [4 /*yield*/, page.$$(selector)
                        // logger(elements.length)
                    ];
                case 2:
                    elements = _a.sent();
                    // logger(elements.length)
                    if (elements.length < 1)
                        return [2 /*return*/, null];
                    _i = 0, elements_1 = elements;
                    _a.label = 3;
                case 3:
                    if (!(_i < elements_1.length)) return [3 /*break*/, 6];
                    element = elements_1[_i];
                    return [4 /*yield*/, getContent(element)];
                case 4:
                    inner = (_a.sent()) || "";
                    // logger("inner: " + inner)
                    // if (!inner) return null
                    //  debug(inner.trim())
                    if (new RegExp(regex).test(inner.trim())) {
                        // debug(inner, ", findElement");
                        return [2 /*return*/, element];
                    }
                    _a.label = 5;
                case 5:
                    _i++;
                    return [3 /*break*/, 3];
                case 6: return [2 /*return*/, null];
            }
        });
    });
};
var getContent = function (element) { return __awaiter(_this, void 0, void 0, function () {
    var inner;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, element.getProperty("textContent")];
            case 1:
                inner = _a.sent();
                if (!inner)
                    return [2 /*return*/, ""];
                return [4 /*yield*/, inner.jsonValue()];
            case 2: return [2 /*return*/, (_a.sent()).trim()];
        }
    });
}); };
exports.getAttribute = function (page, element, attribute) { return __awaiter(_this, void 0, void 0, function () {
    var value;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, page.evaluate(function (element, attribute) { return element.attribute; }, element, attribute)];
            case 1:
                value = _a.sent();
                return [2 /*return*/, value];
        }
    });
}); };
var changedPage = function (browser) { return __awaiter(_this, void 0, void 0, function () {
    var _this = this;
    return __generator(this, function (_a) {
        return [2 /*return*/, new Promise(function (x) {
                return browser.on('targetchanged', function (target) { return __awaiter(_this, void 0, void 0, function () {
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                if (!(target.type() === 'page')) return [3 /*break*/, 2];
                                _a = x;
                                return [4 /*yield*/, target.page()];
                            case 1:
                                _a.apply(void 0, [_b.sent()]);
                                _b.label = 2;
                            case 2: return [2 /*return*/];
                        }
                    });
                }); });
            })];
    });
}); };
