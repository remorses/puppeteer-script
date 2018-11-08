"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
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
Object.defineProperty(exports, "__esModule", { value: true });
const rpc_1 = __importDefault(require("./rpc"));
const YAML = __importStar(require("yaml"));
const fs = __importStar(require("mz/fs"));
const path_1 = require("path");
const puppeteer_1 = require("puppeteer");
const debug = require("debug");
const WORKING_DIR = path_1.dirname(require.main.filename);
// console.log(WORKING_DIR)
exports.fromYAML = (path) => __awaiter(this, void 0, void 0, function* () {
    const file = yield fs.readFile(path, 'utf8');
    const script = YAML.parse(file);
    // console.log("script:", script.do)
    const executablePath = script["executable"] || "";
    const headless = !!script["headless"];
    yield puppeteer_1.launch({ headless, executablePath }).then((browser) => __awaiter(this, void 0, void 0, function* () {
        const pages = yield browser.pages();
        let page = pages[0];
        const functionsObject = rpc_1.default(browser, console.log).do;
        // console.log("functionObject", functionsObject)
        let func;
        let key = "";
        let value = "";
        try {
            for (let step of script.do) {
                key = Object.keys(step)[0];
                value = step[key];
                console.log("pages: " + (yield browser.pages()));
                func = yield functionsObject[key];
                if (!func)
                    console.error(key, "still not implemented");
                page = yield (yield func(page)(value));
                // .catch((e: Error) => console.error("error in", key, ":", value, "\n", e))
            }
        }
        catch (e) {
            console.error("error in", key, ":", value, "\n", e["message"].trim());
        }
        return;
    }));
    console.log("done");
});
