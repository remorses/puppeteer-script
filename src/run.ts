import { prepare } from "./prepare/prepare";
import { Page } from "puppeteer";




export const run = async (runner, { data, browser, cluster }) => {

  if (!browser) browser = await prepare(runner.SCRIPT)
  if (cluster) {
    await cluster.task(runner)
    return await cluster.queue(data)
  }
  const page: Page = (await browser.pages())[0]
  return await runner(page, data, runner.ID++)
}
