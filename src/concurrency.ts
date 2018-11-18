






export const concurrency = async (file, data, type) => {

  const filledScript = fillData(file, data)

  const script = YAML.parse(filledScript)

  switch (type) {

    case "browser":
      return implementBrowser(script)

    case "context":
      return implementBrowser(script)

    case "page":
      return implementPage(script)

    default:
      return implementPage(script)
  }

}




  const implementBrowser




  const implementBrowser


  const implementPage = (script) =>
    class PageConcurrencyImplementation extends SingleBrowserImplementation {

      async init(): Promise<void> {
        this.browser = await prepare(script)
      }

      protected async createResources(): Promise<any> {
        return {
          page: (await (this.browser as Browser).pages())[0],
        };
      }

      protected async freeResources(resources: ResourceData): Promise<void> {
        await resources.page.close();
      }
    }
