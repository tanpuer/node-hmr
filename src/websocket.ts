declare const module: any;
import {WebSocket} from "ws";

let log = require("webpack/hot/log");
let preHash = undefined;
let currHash = undefined;

global.__websocket_cache__ = new Map<String, Object>();

let checkForUpdate = function checkForUpdate(fromUpdate: boolean = false) {
    if (module.hot.status() === "idle") {
        module.hot
            .check(true)
            .then(function (updatedModules: any) {
                if (!updatedModules) {
                    if (fromUpdate) log("info", "[HMR] Update applied.");
                    return;
                }
                console.log("module.hot.check finish!!! ", updatedModules);
                require("webpack/hot/log-apply-result")(updatedModules, updatedModules);
            })
            .catch(function (err) {
                var status = module.hot.status();
                if (["abort", "fail"].indexOf(status) >= 0) {
                    log("warning", "[HMR] Cannot apply update.");
                    log("warning", "[HMR] " + log.formatError(err));
                    log("warning", "[HMR] You need to restart the application!");
                } else {
                    log("warning", "[HMR] Update failed: " + log.formatError(err));
                }
            });
    }
};

if (module.hot) {
    initWebsocket();
} else {
    console.error("[HMR] Hot Module Replacement is disabled");
}

function initWebsocket() {
    const hotWS = new WebSocket(`ws://localhost:9000/ws`);

    hotWS.on('error', console.error);

    hotWS.on('open', function open() {
        console.log('connected to hotWS');
    });

    hotWS.on('close', function close() {
        console.log('disconnected to hotWS');
    });

    hotWS.on('message', function message(data) {
        console.log("message from hotWS");
        console.log(data.toString());
        const json = JSON.parse(data.toString());
        if (json.type == "hash") {
            if (preHash == undefined) {
                preHash = json.data;
            }
            currHash = json.data;
            if (preHash != currHash) {
                downloadJsonAndJs();
            }
        }
    });
}

/**
 * download json and js
 * http://localhost:9000/main.141c611093181737e697.hot-update.json
 * http://localhost:9000/main.141c611093181737e697.hot-update.js
 * hook require method to return json and js
 * then invoke module.hot.check
 */
function downloadJsonAndJs() {
    //waiting for downloading
    let jsonUrl = `http://localhost:9000/main.${preHash}.hot-update.json`;
    let jsUrl = `http://localhost:9000/main.${preHash}.hot-update.js`;
    fetch(jsonUrl)
        .then((res) => res.json())
        .then((res) => {
            console.log("hmr fetch result", res);
            global.__websocket_cache__[jsonUrl] = res;
            fetch(jsUrl)
                .then((res) => res.text())
                .then((res) => {
                    let exports = {};
                    eval(res);
                    global.__websocket_cache__[jsUrl] = exports;
                    checkForUpdate(false);
                    preHash = currHash;
                }).catch((error) => {
                console.error("hmr update error:", error);
            })
        }).catch((error) => {
        console.error("hmr update error:", error);
    })
}
