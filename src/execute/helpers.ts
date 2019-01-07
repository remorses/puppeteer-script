import { Browser, Page, ElementHandle, JSHandle, Target, Request } from "puppeteer"
const logger = console.log

export const waitForLoad = (page: Page) => new Promise((res) => {
    page.once('request', (req) => {
        setTimeout(() => page.once("request",
            () => setTimeout(
                () => res(), 600)), 600)
    })
    setTimeout(() => res(), 2500)
})



export const findElement = async (page: Page, selector = "div", regex: string = "/.*/", ): Promise<ElementHandle> => {
    await page.waitForSelector(selector)
    // logger(regex)
    // logger(eval(regex))
    const elements: ElementHandle[] = await page.$$(selector)
    // logger(elements.length)
    if (elements.length < 1) throw "no elements"
    for (let element of elements) {
        let inner: string = (await getContent(element)) || ""
        // logger("inner: " + inner)
        // if (!inner) return null
        //  debug(inner.trim())
        if (eval(regex).test(inner.trim())) {
            // debug(inner, ", findElement");
            return element
        }
    }
    throw "can't find element"
}


export const getContent = async (element: ElementHandle): Promise<string> => {
    const inner = await element.getProperty("textContent")
    if (!inner) return ""
    return (await inner.jsonValue()).trim()
}


export const getAttribute = async (page: Page, element: ElementHandle, attribute: string): Promise<string> => {
    const value = await page.evaluate((element, attribute) => element.attribute, element, attribute);
    return value
}


export const waitForElement = async (element: ElementHandle) => {
    let isMoving = true
    let box
    let x = 0, newx
    let y = 0, newy
    let width = 0, newwidth
    let height = 0, newheight
    while (isMoving) {
        // logger(await getContent(element))
        // logger("x:", x, "y:", y)
        // logger("newx:", newx, "newy:", newy)
        await element.focus()
        box = await element.boundingBox()
        newx = box["x"]
        newy = box["y"]
        newwidth = box["width"]
        newheight = box["height"]
        setTimeout(() => {
            isMoving = (x !== newx) ||
                (y !== newy) ||
                (width !== newwidth) ||
                (height !== newheight)
            x = newx
            y = newy
            width = newwidth
            height = newheight
        }, 300)

    }
    // logger("element is stationary now")
    return element
}



export function roughSizeOfObject(object) {

    var objectList = [];
    var stack = [object];
    var bytes = 0;

    while (stack.length) {
        var value: any = stack.pop();

        if (typeof value === 'boolean') {
            bytes += 4;
        }
        else if (typeof value === 'string') {
            bytes += value.length * 2;
        }
        else if (typeof value === 'number') {
            bytes += 8;
        }
        else if
        (
            typeof value === 'object'
            && (<any>objectList).indexOf(value) === -1
        ) {
            (<any>objectList).push(value);

            for (var i in value) {
                stack.push(value[i]);
            }
        }
    }

    return bytes;
}


export const ifThen = async (check: any, fun: any) => {
    if (!!check)
        return await fun(check)
    else
        return null
}


const puppeteerDescriptors = require('puppeteer/DeviceDescriptors');
import * as  descriptors from "./devices"
const devices = { ...puppeteerDescriptors, ...descriptors }

// TODO add other desktop devices
export const emulatePage = async (page: Page, device: string) => {
    if (!descriptors[device]) throw new Error("can't find descriptor for device " + device)
    if (!page) logger("no page in emualtePage"); return page//throw new Error("there is not page ")
    await page.emulate(devices[device])
    await page.setUserAgent(devices[device].userAgent)
    return page
}




export const abortPageRequests = async (page: Page, types = []) => {
    if (!page) return
    await page.setRequestInterception(true);
    page.on('request', (req: Request) => {
        if (types.some(x => x === req.resourceType()))
            req.abort();
        else
            req.continue();
    });
}



export const reduceReducers = (...args) => {
    const initialState =
        typeof args[args.length - 1] !== 'function' && args.pop();
    const reducers = args;

    if (typeof initialState === 'undefined') {
        throw new TypeError(
            'The initial state may not be undefined. If you do not want to set a value for this reducer, you can use null instead of undefined.'
        );
    }

    return async (prevState, value, ...args) => {
        prevState = await prevState
        const prevStateIsUndefined = typeof prevState === 'undefined';
        const valueIsUndefined = typeof value === 'undefined';

        if (prevStateIsUndefined && valueIsUndefined && initialState) {
            return initialState;
        }

        return await reducers.reduce(async (newState, reducer, index) => {
            newState = await newState
            if (typeof reducer === 'undefined') {
                throw new TypeError(
                    `An undefined reducer was passed in at index ${index}`
                );
            }

            return await reducer(await newState, value, ...args);
        }, prevStateIsUndefined && !valueIsUndefined && initialState ? initialState : prevState);
    };
};
