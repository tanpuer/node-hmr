const fetch = require('node-fetch');

let defaultRequire = require;
require = function (path) {
  console.log(path);
  if (path.startsWith("./main.")) {
    console.log("relative path: ", path);
    if (path.endsWith(".json")) {
      let jsonUrl = `http://localhost:9000${path.substring(1)}`;
      return global.__websocket_cache__[jsonUrl];
    } else if (path.endsWith(".js")) {
      let jsUrl = `http://localhost:9000${path.substring(1)}`;
      return global.__websocket_cache__[jsUrl];
    }
  } else {
    return defaultRequire(path);
  }
}

fetch("http://localhost:9000/main.js")
    .then((res) => res.text())
    .then((js) => {
      console.log("load js success");
      eval(js);
    }).catch((error) => {
  console.log(`reload error ${error}`)
});
