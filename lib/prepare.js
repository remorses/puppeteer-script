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
var emulate_1 = require("./emulate");
var abort_1 = require("./abort");
var puppeteer_1 = require("puppeteer");
var logger = console.log;
var chalk_1 = __importDefault(require("chalk"));
var red = chalk_1.default.red, bold = chalk_1.default.bold, bgRed = chalk_1.default.bgRed, white = chalk_1.default.white;
var logErr = function (err) { return logger(red(err.message + " in " + __filename)); };
exports.prepare = function (script) { return __awaiter(_this, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, pipe(makeEnv, makeOptions, makeBrowser)(script).catch(logErr)];
    });
}); };
var pipe = function () {
    var functions = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        functions[_i] = arguments[_i];
    }
    return function (input) {
        return functions.reduce(function (promise, func) { return __awaiter(_this, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = func;
                    return [4 /*yield*/, promise];
                case 1: return [2 /*return*/, _a.apply(void 0, [_b.sent()])];
            }
        }); }); }, Promise.resolve(input));
    };
};
var makeEnv = function (script) { return __awaiter(_this, void 0, void 0, function () {
    var set;
    return __generator(this, function (_a) {
        set = function (variable) {
            var scriptVariable = variable.toLowerCase().replace("_", "-");
            process.env[variable] = script[scriptVariable] || process.env[variable] || null;
        };
        set("EMULATE");
        set("ANTICAPTCHA_KEY");
        set("ANTICAPTCHA_CALLBACK");
        set("USER_AGENT");
        return [2 /*return*/, script];
    });
}); };
var makeOptions = function (script) { return __awaiter(_this, void 0, void 0, function () {
    var defaults, options;
    return __generator(this, function (_a) {
        defaults = [];
        options = {
            launchOPtions: {
                args: __spread(defaults, (script["args"] || [])),
                headless: !!script["headless"],
                defaultViewport: script["viewport"] || { width: 1000, height: 1000 },
                executablePath: script["executable"] || null
            },
            emulate: script["emulate"] || null,
            abort: script["abort"] || null
        };
        return [2 /*return*/, options];
    });
}); };
var makeBrowser = function (_a) { return __awaiter(_this, void 0, void 0, function () {
    var _this = this;
    var launchOPtions = _a.launchOPtions, rest = __rest(_a, ["launchOPtions"]);
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, puppeteer_1.launch(__assign({}, launchOPtions)).then(function (browser) { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (!rest.emulate) return [3 /*break*/, 2];
                                return [4 /*yield*/, emulate_1.emulate(browser, rest.emulate)];
                            case 1:
                                _a.sent();
                                _a.label = 2;
                            case 2:
                                if (!rest.abort) return [3 /*break*/, 4];
                                return [4 /*yield*/, abort_1.abort(browser, rest.abort)];
                            case 3:
                                _a.sent();
                                _a.label = 4;
                            case 4: return [2 /*return*/, browser];
                        }
                    });
                }); })];
            case 1: return [2 /*return*/, _b.sent()];
        }
    });
}); };
