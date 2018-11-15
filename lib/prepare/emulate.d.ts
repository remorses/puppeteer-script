import { Browser, Page } from "puppeteer";
export declare const emulatePage: (page: Page, device: string) => Promise<Page>;
export declare const emulate: (browser: Browser, device: string) => Promise<void>;
