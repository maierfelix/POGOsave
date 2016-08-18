# POGOsave <a href="https://www.npmjs.com/package/pogosave"><img src="https://img.shields.io/npm/v/pogosave.svg?style=flat-square" alt="NPM Version" /></a>

Download and backup your actual progress in Pokemon GO.

## Install

```
$ npm install --save pogosave
```

## Usage
````js
const pogosave = require("pogosave");
const fs = require("fs");

pogosave({
  provider: "google",
  username: "USERNAME",
  password: "PASSWORD"
}, (data) => {
  fs.writeFileSync("account.json", JSON.stringify(data));
});
````