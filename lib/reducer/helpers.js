"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logger = console.log;
exports.waitForLoad = (page) => new Promise((res) => {
    page.once('request', (req) => {
        setTimeout(() => page.once("request", () => setTimeout(() => res(), 600)), 600);
    });
    setTimeout(() => res(), 2500);
});
exports.findElement = async (page, selector = "div", regex = "/.*/") => {
    await page.waitForSelector(selector);
    // logger(regex)
    // logger(eval(regex))
    const elements = await page.$$(selector);
    // logger(elements.length)
    if (elements.length < 1)
        return null;
    for (let element of elements) {
        let inner = (await exports.getContent(element)) || "";
        // logger("inner: " + inner)
        // if (!inner) return null
        //  debug(inner.trim())
        if (eval(regex).test(inner.trim())) {
            // debug(inner, ", findElement");
            return element;
        }
    }
    return null;
};
exports.getContent = async (element) => {
    const inner = await element.getProperty("textContent");
    if (!inner)
        return "";
    return (await inner.jsonValue()).trim();
};
exports.getAttribute = async (page, element, attribute) => {
    const value = await page.evaluate((element, attribute) => element.attribute, element, attribute);
    return value;
};
exports.waitForElement = async (element) => {
    let isMoving = true;
    let box;
    let x = 0, newx;
    let y = 0, newy;
    let width = 0, newwidth;
    let height = 0, newheight;
    while (isMoving) {
        // logger(await getContent(element))
        // logger("x:", x, "y:", y)
        // logger("newx:", newx, "newy:", newy)
        await element.focus();
        box = await element.boundingBox();
        newx = box["x"];
        newy = box["y"];
        newwidth = box["width"];
        newheight = box["height"];
        setTimeout(() => {
            isMoving = (x !== newx) ||
                (y !== newy) ||
                (width !== newwidth) ||
                (height !== newheight);
            x = newx;
            y = newy;
            width = newwidth;
            height = newheight;
        }, 300);
    }
    // logger("element is stationary now")
    return element;
};
function roughSizeOfObject(object) {
    var objectList = [];
    var stack = [object];
    var bytes = 0;
    while (stack.length) {
        var value = stack.pop();
        if (typeof value === 'boolean') {
            bytes += 4;
        }
        else if (typeof value === 'string') {
            bytes += value.length * 2;
        }
        else if (typeof value === 'number') {
            bytes += 8;
        }
        else if (typeof value === 'object'
            && objectList.indexOf(value) === -1) {
            objectList.push(value);
            for (var i in value) {
                stack.push(value[i]);
            }
        }
    }
    return bytes;
}
exports.roughSizeOfObject = roughSizeOfObject;
exports.ifThen = async (check, fun) => {
    if (!!check)
        return await fun(check);
    else
        return null;
};
// export const preparePage = async (page: Page) => {
//   const { EMULATE = null } = process.env
//   if (EMULATE) await emulatePage(page, EMULATE)
//   await (<any>page)._client.send('Emulation.clearDeviceMetricsOverride')
// }
