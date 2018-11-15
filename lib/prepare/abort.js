"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const abortPageRequests = async (page, types = []) => {
    if (!page)
        return;
    await page.setRequestInterception(true);
    page.on('request', (req) => {
        if (types.some(x => x === req.resourceType()))
            req.abort();
        else
            req.continue();
    });
};
exports.abort = async (browser, types = []) => {
    const pages = await browser.pages();
    pages.forEach((page) => abortPageRequests(page, types));
    browser.on('targetcreated', async (target) => abortPageRequests(await target.page(), types));
};
