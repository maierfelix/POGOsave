var save = require("../index");
var fs = require("fs");

save({
  provider: "google",
  username: "USERNAME",
  password: "PASSWORD"
}, (data) => {
  console.log(data);
  fs.writeFileSync("player.json", JSON.stringify(data));
});