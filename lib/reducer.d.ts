import { Page } from "puppeteer";
export interface Action {
    method: string;
    arg: any;
}
export declare const reducer: (state: Promise<Page>, action: Action) => Promise<Page>;
