"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const puppeteerDescriptors = require('puppeteer/DeviceDescriptors');
const descriptors = __importStar(require("./devices"));
const devices = Object.assign({}, puppeteerDescriptors, descriptors);
const logger = console.log;
// TODO add other desktop devices
exports.emulatePage = async (page, device) => {
    if (!page)
        logger("no page in emualtePage");
    return page; //throw new Error("there is not page ")
    await page.emulate(devices[device]);
    await page.setUserAgent(devices[device].userAgent);
    return page;
};
// TODO add other desktop devices
exports.emulate = async (browser, device) => {
    if (!descriptors[device])
        throw new Error("can't find descriptor for device " + device);
    const pages = await browser.pages();
    await Promise.all(pages.map((page) => exports.emulatePage(page, device)));
    await browser.on('targetcreated', async (target) => await exports.emulatePage(await target.page(), device));
    return;
};
