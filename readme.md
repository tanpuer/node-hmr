### nodejs-webpack-hmr

1. npm install
2. npm run server
3. npm run start
4. modify src/page1/test1.ts; command + s; will see log changed.


##### background

Webpack does support HMR(Hot Module Replacement) for browser and nodejs.
But for nodejs, HMR can only support poll instead of websocket officially.

##### ws

1. Create ws-client: ws://localhost:9000/ws.
2. Receive hash message after code change.
3. Fetch `localhost:9000/main.${hash}.hot-update.json` and `localhost:9000/main.${hash}.hot-update.js`.
4. Save json and js object to cache.
5. Invoke Webpack api: hot.module.check();
6. Webpack HMR will require(`./.${hash}.json`) and require(`./.${hash}.js`), hook require method and return from cache.
7. Then module.hot.dispose/accept... apis will be called to execute your logic!
