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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
// check balance first
var _a = process.env, ANTICAPTCHA_KEY = _a.ANTICAPTCHA_KEY, PROXY_ADDRESS = _a.PROXY_ADDRESS, PROXY_PASS = _a.PROXY_PASS, PROXY_USER = _a.PROXY_USER, PROXY_PORT = _a.PROXY_PORT, PROXY_TYPE = _a.PROXY_TYPE;
var anticaptcha = require('./anticaptcha')(ANTICAPTCHA_KEY);
exports.solveCaptcha = function (browser, page, sitekey, _a) {
    if (sitekey === void 0) { sitekey = ""; }
    return __awaiter(_this, void 0, void 0, function () {
        var _b, _c, _d, _e, _f, _g, balance, taskId, solution;
        var _h = _a.proxy, proxy = _h === void 0 ? false : _h, options = __rest(_a, ["proxy"]);
        return __generator(this, function (_j) {
            switch (_j.label) {
                case 0:
                    //recaptcha key from target website
                    _c = (_b = anticaptcha).setWebsiteURL;
                    return [4 /*yield*/, page.url()];
                case 1:
                    //recaptcha key from target website
                    _c.apply(_b, [_j.sent()]);
                    anticaptcha.setWebsiteKey(sitekey);
                    //proxy access parameters
                    if (proxy) {
                        anticaptcha.setProxyType(PROXY_TYPE);
                        anticaptcha.setProxyAddress(PROXY_ADDRESS);
                        anticaptcha.setProxyPort(PROXY_PORT);
                        anticaptcha.setProxyLogin(PROXY_USER);
                        anticaptcha.setProxyPassword(PROXY_PASS);
                    }
                    //browser header parameters
                    _e = (_d = anticaptcha).setUserAgent;
                    return [4 /*yield*/, page.evaluate("navigator.userAgent")];
                case 2:
                    //browser header parameters
                    _e.apply(_d, [_j.sent()]);
                    _g = (_f = anticaptcha).setCookies;
                    return [4 /*yield*/, page.cookies()];
                case 3:
                    _g.apply(_f, [_j.sent()]);
                    return [4 /*yield*/, getBalance];
                case 4:
                    balance = _j.sent();
                    if (!(balance > 0)) return [3 /*break*/, 7];
                    return [4 /*yield*/, createTask];
                case 5:
                    taskId = _j.sent();
                    return [4 /*yield*/, getTaskSolution(taskId)];
                case 6:
                    solution = _j.sent();
                    _j.label = 7;
                case 7: return [2 /*return*/];
            }
        });
    });
};
var getBalance = new Promise(function (res, rej) {
    anticaptcha.getBalance(function (err, balance) { return (err)
        ? rej(err)
        : res(balance); });
});
var createTask = new Promise(function (res, rej) {
    anticaptcha.createTask(function (err, taskId) {
        if (err) {
            rej(err);
        }
        else {
            res(taskId);
        }
    });
});
var getTaskSolution = function (taskId) { return new Promise(function (res, rej) {
    anticaptcha.getTaskSolution(taskId, function (err, taskSolution) {
        if (err) {
            rej(err);
        }
        else {
            res(taskSolution);
        }
    });
}); };
