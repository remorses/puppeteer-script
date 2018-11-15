# puppeteer-script
Execute actions through a readable YAML script
---
For example write a yaml script like this for executing an Instagram subscription
```yaml
headless: true
executable: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
emulate: Chrome

do:
  - go-to:   https://instagram.com
  - click:   'input[name="emailOrPhone"]'
  - type:    "username" # keyboard.type
  - click:   input[name="fullName"]
  - type:    "full name"
  - screenshot: "./artifacts/screen.jpg"
```
