"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const reducer_1 = require("./reducer/reducer");
const prepare_1 = require("./prepare/prepare");
const logger = console.log; //require("debug")("script")
const chalk_1 = __importDefault(require("chalk"));
const { red, bold, bgRed, white } = chalk_1.default;
const { DEBUG = "" } = process.env;
// import { roughSizeOfObject } from "./helpers"
exports.fromOBJECT = async (script) => {
    const browser = await prepare_1.prepare(script);
    const page = (await browser.pages())[0];
    await script["do"]
        .map(obj => {
        const key = Object.keys(obj)[0];
        const value = obj[key];
        return { method: key, arg: value };
    })
        .reduce(async (state, action) => {
        return await reducer_1.reducer(await state, action)
            .then(x => {
            logExecuted(action);
            return x;
        })
            .catch(e => {
            logError(e, action);
            process.exit(1);
        });
    }, Promise.resolve(page))
        .then(x => {
        logger(bold("done"));
        return x;
    });
};
const logExecuted = action => logger(("\n" + "Executed "
    + bold("'" + action.method + "'" + " : "
        + JSON.stringify(action.arg))));
const logError = (e, action) => logger(red("Error in " + bold(action.method
    + ": " + action.arg) + " step" + "\n" + e["message"].trim()));
