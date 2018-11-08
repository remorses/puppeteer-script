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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
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
var rpc_1 = __importDefault(require("./rpc"));
var YAML = __importStar(require("yaml"));
var fs = __importStar(require("mz/fs"));
var path_1 = require("path");
var puppeteer_1 = require("puppeteer");
var chalk_1 = __importDefault(require("chalk"));
var debug = require("debug");
var red = chalk_1.default.red, bold = chalk_1.default.bold;
var WORKING_DIR = path_1.dirname(require.main.filename);
console.log("WORKING_DIR:", WORKING_DIR);
exports.fromYAML = function (path) { return __awaiter(_this, void 0, void 0, function () {
    var file, script, executablePath, headless;
    var _this = this;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, fs.readFile(path_1.join(WORKING_DIR, path), 'utf8')];
            case 1:
                file = _a.sent();
                script = YAML.parse(file);
                executablePath = script["executable"] || "";
                headless = !!script["headless"];
                return [4 /*yield*/, puppeteer_1.launch({ headless: headless, executablePath: executablePath }).then(function (browser) { return __awaiter(_this, void 0, void 0, function () {
                        var pages, page, functionsObject, func, key, value, _i, _a, step, pagesLogs, e_1;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0: return [4 /*yield*/, browser.pages()];
                                case 1:
                                    pages = _b.sent();
                                    page = pages[0];
                                    functionsObject = rpc_1.default(browser, console.log).do;
                                    key = "";
                                    value = "";
                                    _b.label = 2;
                                case 2:
                                    _b.trys.push([2, 10, , 11]);
                                    _i = 0, _a = script.do;
                                    _b.label = 3;
                                case 3:
                                    if (!(_i < _a.length)) return [3 /*break*/, 9];
                                    step = _a[_i];
                                    key = Object.keys(step)[0];
                                    value = step[key];
                                    return [4 /*yield*/, browser.pages()];
                                case 4:
                                    pagesLogs = (_b.sent())
                                        .map(function (x) { return x.url(); })
                                        .map(function (x, i) { return i + ". " + x + "\n"; });
                                    console.log.apply(console, ["pages:\n"].concat(pagesLogs));
                                    return [4 /*yield*/, functionsObject[key]];
                                case 5:
                                    func = _b.sent();
                                    if (!func)
                                        console.error(key, "still not implemented");
                                    return [4 /*yield*/, func(page)(value)];
                                case 6: return [4 /*yield*/, (_b.sent())];
                                case 7:
                                    page = _b.sent();
                                    _b.label = 8;
                                case 8:
                                    _i++;
                                    return [3 /*break*/, 3];
                                case 9: return [3 /*break*/, 11];
                                case 10:
                                    e_1 = _b.sent();
                                    console.error(red("error in " + bold(key.toString().toUpperCase()) + ": " + bold(value.toString().toUpperCase()) + "\n" + e_1["message"].trim()));
                                    return [3 /*break*/, 11];
                                case 11: return [2 /*return*/];
                            }
                        });
                    }); })];
            case 2:
                _a.sent();
                console.log(bold("done"));
                return [2 /*return*/];
        }
    });
}); };
