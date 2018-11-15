import { Page, ElementHandle } from "puppeteer";
export declare const waitForLoad: (page: Page) => Promise<{}>;
export declare const findElement: (page: Page, selector?: string, regex?: string) => Promise<ElementHandle<Element> | null>;
export declare const getContent: (element: ElementHandle<Element>) => Promise<string>;
export declare const getAttribute: (page: Page, element: ElementHandle<Element>, attribute: string) => Promise<string>;
export declare const waitForElement: (element: ElementHandle<Element>) => Promise<ElementHandle<Element>>;
export declare function roughSizeOfObject(object: any): number;
export declare const ifThen: (check: any, fun: any) => Promise<any>;
export declare const preparePage: (page: Page) => Promise<void>;