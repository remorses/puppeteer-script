import { Browser, Page } from "puppeteer";
export interface DoSteps {
    [key: string]: (page: Page) => (any: any) => Page | Promise<Page>;
}
export declare const makeDoSteps: (browser: Browser, logger: any) => DoSteps;
