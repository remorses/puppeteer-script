# puppeteer-script
Execute actions through a readable YAML script
---
For example write a yaml script like this for executing an Instagram subscription
```yaml
do:
    - test:      'http://google.com'
    - wait:       0
    - type:       "bot Bots"
    - inject:     "./jquery.js"
    - new-page:   {{  url }}
    - click:      div#css

```

If you want to add functionality you can easily add features with plug-ins
```yaml
use:
    ./reducer2:    { settingA: 1, settingB: 2}

do:
    - test:      'http://google.com'
    - wait:       0
    - type:       "bot Bots"
    - inject:     "./jquery.js"
    - new-page:   {{  url }}
    - click:      div#css

```

And in the `./reducer2.js` file there can be a simple reducer like this.
The file must be export a function that takes the settings object and then the actual async reducer.

```javascript
module.exports.reducer = (settings) => async (state, action) => {
    const { page, data } = await state
    if (action.method === 'test') {
        console.log(`working!!!!, settings are ${settings}`)
        return { page, data }
    } else {
        return { page, data }
    }
}

```
