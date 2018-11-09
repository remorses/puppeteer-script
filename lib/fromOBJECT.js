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
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var puppeteer_1 = require("puppeteer");
var chalk_1 = __importDefault(require("chalk"));
var doSteps_1 = require("./doSteps");
var emulate_1 = require("./emulate");
var abort_1 = require("./abort");
var logger = require("debug")("script");
var red = chalk_1.default.red, bold = chalk_1.default.bold, bgRed = chalk_1.default.bgRed, white = chalk_1.default.white;
var _a = process.env.DEBUG, DEBUG = _a === void 0 ? "" : _a;
// logger("WORKING_DIR:", WORKING_DIR)
exports.fromOBJECT = function (script) { return __awaiter(_this, void 0, void 0, function () {
    var executablePath, headless, requestsToAbort, _a, emulate, options;
    var _this = this;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                executablePath = script["executable"] || "";
                headless = !!script["headless"];
                requestsToAbort = script["abort"] || [];
                _a = __read(emulate_1.makeEmulate(script["emulate"] || ""), 2), emulate = _a[0], options = _a[1];
                return [4 /*yield*/, puppeteer_1.launch(__assign({ headless: headless, executablePath: executablePath }, options)).then(function (browser) { return __awaiter(_this, void 0, void 0, function () {
                        var e_1, _a, pages, page, doSteps, func, key, value, _b, _c, step, pagesLogs, e_1_1, e_2;
                        return __generator(this, function (_d) {
                            switch (_d.label) {
                                case 0: return [4 /*yield*/, emulate(browser)];
                                case 1:
                                    _d.sent();
                                    return [4 /*yield*/, abort_1.abort(browser, requestsToAbort)];
                                case 2:
                                    _d.sent();
                                    return [4 /*yield*/, browser.pages()];
                                case 3:
                                    pages = _d.sent();
                                    page = pages[0];
                                    doSteps = doSteps_1.makeDoSteps(browser, logger);
                                    key = "";
                                    value = "";
                                    _d.label = 4;
                                case 4:
                                    _d.trys.push([4, 17, , 18]);
                                    _d.label = 5;
                                case 5:
                                    _d.trys.push([5, 14, 15, 16]);
                                    _b = __values(script["do"]), _c = _b.next();
                                    _d.label = 6;
                                case 6:
                                    if (!!_c.done) return [3 /*break*/, 13];
                                    step = _c.value;
                                    key = Object.keys(step)[0];
                                    value = step[key];
                                    console.log(("\n" + "Executing " + bold("'" + key + "'" + " : " + JSON.stringify(value))));
                                    if (!DEBUG.match(/script*/i)) return [3 /*break*/, 8];
                                    return [4 /*yield*/, browser.pages()];
                                case 7:
                                    pagesLogs = (_d.sent())
                                        .map(function (x) { return x.url(); })
                                        .map(function (x, i) { return i + ". " + x + "\n"; });
                                    logger.apply(void 0, __spread(["pages:\n"], pagesLogs));
                                    _d.label = 8;
                                case 8: return [4 /*yield*/, doSteps[key]];
                                case 9:
                                    func = _d.sent();
                                    if (!func)
                                        console.error(red(bold(key) + " still not implemented"));
                                    return [4 /*yield*/, func(page)(value)];
                                case 10: return [4 /*yield*/, (_d.sent())];
                                case 11:
                                    page = _d.sent();
                                    _d.label = 12;
                                case 12:
                                    _c = _b.next();
                                    return [3 /*break*/, 6];
                                case 13: return [3 /*break*/, 16];
                                case 14:
                                    e_1_1 = _d.sent();
                                    e_1 = { error: e_1_1 };
                                    return [3 /*break*/, 16];
                                case 15:
                                    try {
                                        if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                                    }
                                    finally { if (e_1) throw e_1.error; }
                                    return [7 /*endfinally*/];
                                case 16: return [3 /*break*/, 18];
                                case 17:
                                    e_2 = _d.sent();
                                    console.error(red("Error in " + bold(key + ": " + value) + " step" + "\n" + e_2["message"].trim()));
                                    process.exit(1);
                                    return [3 /*break*/, 18];
                                case 18: return [2 /*return*/];
                            }
                        });
                    }); })];
            case 1:
                _b.sent();
                logger(bold("done"));
                return [2 /*return*/];
        }
    });
}); };
