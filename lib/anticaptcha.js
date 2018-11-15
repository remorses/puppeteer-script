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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var request_promise_native_1 = __importDefault(require("request-promise-native"));
require("dotenv").config();
// check balance first
var _a = process.env, ANTICAPTCHA_KEY = _a.ANTICAPTCHA_KEY, PROXY_ADDRESS = _a.PROXY_ADDRESS, PROXY_PASS = _a.PROXY_PASS, PROXY_USER = _a.PROXY_USER, PROXY_PORT = _a.PROXY_PORT, PROXY_TYPE = _a.PROXY_TYPE;
var HOSTNAME = "https://api.anti-captcha.com";
var PORT = 443;
var createNoCaptchaTask = function (clientKey, options) { return __awaiter(_this, void 0, void 0, function () {
    var postData, response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                postData = {
                    clientKey: clientKey,
                    task: __assign({}, options, { type: "NoCaptchaTask" }),
                    softId: 0
                };
                return [4 /*yield*/, request_promise_native_1.default({
                        url: HOSTNAME + "/createTask",
                        port: PORT,
                        method: 'POST',
                        headers: {
                            'accept-encoding': 'gzip,deflate',
                            'content-type': 'application/json; charset=utf-8',
                            'accept': 'application/json',
                            'content-length': Buffer.byteLength(JSON.stringify(postData))
                        },
                        json: postData
                    })];
            case 1:
                response = _a.sent();
                if (response["errId"] !== 0)
                    return [2 /*return*/, response["taskId"]];
                else
                    throw new Error("can't create a new task on anticaptcha, " + response["errId"]);
                return [2 /*return*/];
        }
    });
}); };
var getBalance = function (clientKey) { return __awaiter(_this, void 0, void 0, function () {
    var postData, response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                postData = {
                    clientKey: clientKey,
                };
                return [4 /*yield*/, request_promise_native_1.default({
                        url: HOSTNAME + "/getBalance",
                        port: PORT,
                        method: 'POST',
                        headers: {
                            'accept-encoding': 'gzip,deflate',
                            'content-type': 'application/json; charset=utf-8',
                            'accept': 'application/json',
                            'content-length': Buffer.byteLength(JSON.stringify(postData))
                        },
                        json: postData
                    })];
            case 1:
                response = _a.sent();
                return [2 /*return*/, response["balance"]];
        }
    });
}); };
var parseCookie = function (obj) {
    var name = obj.name, value = obj.value, domain = obj.domain, path = obj.path, expires = obj.expires, httpOnly = obj.httpOnly, session = obj.session, secure = obj.secure, sameSite = obj.sameSite;
    return name + "=" + value + "; "; // + "expires=" + expires + ";"
};
exports.solveNoCaptcha = function (page, clientKey, websiteKey, callbackUrl) { return __awaiter(_this, void 0, void 0, function () {
    var cookies, options, _a, balance, taskId;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, page.cookies()];
            case 1:
                cookies = (_b.sent())
                    .map(function (obj) { return parseCookie(obj); })
                    .join("");
                _a = {};
                return [4 /*yield*/, page.url()];
            case 2:
                _a.websiteURL = _b.sent(),
                    _a.websiteKey = websiteKey;
                return [4 /*yield*/, page.evaluate("navigator.userAgent()")];
            case 3:
                options = (_a.userAgent = _b.sent(),
                    _a.cookies = cookies,
                    _a.languagePool = "en",
                    _a);
                if (callbackUrl)
                    options["callbackUrl"] = callbackUrl;
                return [4 /*yield*/, getBalance(clientKey)];
            case 4:
                balance = _b.sent();
                return [4 /*yield*/, createNoCaptchaTask(clientKey, options)];
            case 5:
                taskId = _b.sent();
                if (balance > 0)
                    return [2 /*return*/, taskId];
                return [2 /*return*/];
        }
    });
}); };
(function () { return __awaiter(_this, void 0, void 0, function () {
    var clientKey;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                clientKey = process.env.ANTICAPTCHA_KEY;
                return [4 /*yield*/, getBalance(clientKey).then(console.log)];
            case 1:
                _a.sent();
                return [4 /*yield*/, createNoCaptchaTask(clientKey, {
                        websiteURL: "https://www.spotify.com/it/signup/?forward_url=https%3A%2F%2Fopen.spotify.com%2Fbrowse%2Ffeatured",
                        websiteKey: "6LdaGwcTAAAAAJfb0xQdr3FqU4ZzfAc_QZvIPby5",
                        userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.102 Safari/537.36",
                        cookies: "",
                        languagePool: "en",
                    }).then(console.log).catch(console.log)];
            case 2:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); })();
