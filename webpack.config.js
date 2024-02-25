const webpack = require('webpack');
const path = require('path');

module.exports = {
  entry: ['./src/main.ts'],
  watch: true,
  target: 'node',
  module: {
    rules: [
      {
        test: /.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  mode: 'development',
  resolve: {
    extensions: ['.ts', '.js'],
  },
  devServer: {
    liveReload: false,
    hot: true,
    webSocketServer: "ws",
    host: 'localhost',
    port: 9000,
    client: {
      webSocketURL: `ws://localhost:9000/ws`,
    },
    allowedHosts: 'all',
    static: {
      directory: path.join(__dirname, 'public'),
    },
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ],
  output: {
    path: path.join(__dirname, '/dist'),
    filename: 'main.js',
  },
};
