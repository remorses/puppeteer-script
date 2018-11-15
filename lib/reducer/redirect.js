"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const redirectPageRequests = async (page, types = [], url) => {
    await page.setRequestInterception(true);
    page.on('response', (res, []) => {
        if (types.some(x => x === (res.request()).resourceType()) &&
            res.url().match(url)) {
            console.log(res.json());
        }
    });
};
exports.redirect = async (browser, types = [], url = "/.*/") => {
    const regex = new RegExp(url);
    const pages = await browser.pages();
    pages.forEach((page) => redirectPageRequests(page, types, regex));
    browser.on('targetcreated', async (target) => redirectPageRequests(await target.page(), types, regex));
};
