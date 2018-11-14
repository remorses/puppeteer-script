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
var __values = (this && this.__values) || function (o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
var puppeteer_1 = require("puppeteer");
var chalk_1 = __importDefault(require("chalk"));
var doSteps_1 = require("./doSteps");
var emulate_1 = require("./emulate");
var abort_1 = require("./abort");
var logger = console.log; //require("debug")("script")
var red = chalk_1.default.red, bold = chalk_1.default.bold, bgRed = chalk_1.default.bgRed, white = chalk_1.default.white;
var _a = process.env.DEBUG, DEBUG = _a === void 0 ? "" : _a;
// logger("WORKING_DIR:", WORKING_DIR)
exports.fromOBJECT = function (script) { return __awaiter(_this, void 0, void 0, function () {
    var e_1, _a, options, browser, doSteps, page, func, key, value, _b, _c, step, e_1_1, e_2;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                makeEnv(script);
                return [4 /*yield*/, makeOptions(script)];
            case 1:
                options = _d.sent();
                return [4 /*yield*/, makeBrowser(script, options)];
            case 2:
                browser = _d.sent();
                doSteps = doSteps_1.makeDoSteps(browser, logger);
                return [4 /*yield*/, browser.pages()];
            case 3:
                page = (_d.sent())[0];
                key = "";
                value = "";
                _d.label = 4;
            case 4:
                _d.trys.push([4, 14, , 15]);
                _d.label = 5;
            case 5:
                _d.trys.push([5, 11, 12, 13]);
                _b = __values(script["do"]), _c = _b.next();
                _d.label = 6;
            case 6:
                if (!!_c.done) return [3 /*break*/, 10];
                step = _c.value;
                key = Object.keys(step)[0];
                value = step[key];
                logger(("\n" + "Executing " + bold("'" + key + "'" + " : " + JSON.stringify(value))));
                func = doSteps[key];
                if (!func)
                    console.error(red(bold(key) + " still not implemented"));
                return [4 /*yield*/, func(page)(value)];
            case 7: return [4 /*yield*/, (_d.sent())
                // if (DEBUG.match(/script*/i)) {
                //   const pagesLogs = (await browser.pages())
                //     .map((x: Page) => x.url())
                //     .map((x, i) => i + ". " + x + "\n")
                //   logger("pages:\n", ...pagesLogs)
                // }
            ];
            case 8:
                page = _d.sent();
                _d.label = 9;
            case 9:
                _c = _b.next();
                return [3 /*break*/, 6];
            case 10: return [3 /*break*/, 13];
            case 11:
                e_1_1 = _d.sent();
                e_1 = { error: e_1_1 };
                return [3 /*break*/, 13];
            case 12:
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
                return [7 /*endfinally*/];
            case 13: return [3 /*break*/, 15];
            case 14:
                e_2 = _d.sent();
                console.error(red("Error in " + bold(key + ": " + value) + " step" + "\n" + e_2["message"].trim()));
                return [3 /*break*/, 15];
            case 15:
                logger(bold("done"));
                return [2 /*return*/];
        }
    });
}); };
var makeEnv = function (script) {
    var set = function (variable) {
        var scriptVariable = variable.toLowerCase().replace("-", "_");
        process.env[variable] = script[scriptVariable] || process.env[variable] || null;
    };
    set("ANTICAPTCHA_KEY");
    set("ANTICAPTCHA_CALLBACK");
};
var makeOptions = function (script) { return __awaiter(_this, void 0, void 0, function () {
    var defaults, _a, width, height;
    return __generator(this, function (_b) {
        defaults = [];
        _a = script["viewport"] || { width: 1000, height: 1000 }, width = _a.width, height = _a.height;
        return [2 /*return*/, {
                args: __spread(defaults, (script["args"] || [])),
                headless: !!script["headless"],
                executablePath: script["executable"] || "default",
                defaultViewport: { width: width, height: height }
            }];
    });
}); };
var makeBrowser = function (script, options) { return __awaiter(_this, void 0, void 0, function () {
    var _this = this;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, puppeteer_1.launch(__assign({}, options)).then(function (browser) { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, emulate_1.emulate(browser, script["emulate"] || null)];
                            case 1:
                                _a.sent();
                                return [4 /*yield*/, abort_1.abort(browser, script["abort"] || [])];
                            case 2:
                                _a.sent();
                                return [2 /*return*/, browser];
                        }
                    });
                }); })];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
