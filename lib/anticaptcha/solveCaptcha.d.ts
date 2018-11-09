import { Browser, Page } from "puppeteer";
export declare const solveCaptcha: (browser: Browser, page: Page, sitekey: string | undefined, { proxy, ...options }: {
    [x: string]: any;
    proxy?: boolean;
}) => Promise<void>;
