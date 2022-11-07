"use strict";

const path = require("path");
const FriendlyErrorsWebpackPlugin = require("friendly-errors-webpack-plugin");
const WebpackBar = require("webpackbar");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

/**@type {import('webpack').Configuration} */
const commonConfig = {
  name: "common",
  devtool: "source-map",
  stats: "errors-only",
  resolve: {
    extensions: [".ts", ".js", ".tsx", ".jsx"],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: [
                "@babel/preset-typescript",
                [
                  "@babel/preset-env",
                  {
                    targets: {
                      browsers: "last 2 versions",
                    },
                    modules: false,
                    loose: false,
                  },
                ],
              ],
            },
          },
        ],
      },
      {
        test: /\.tsx$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: [
                "@babel/preset-typescript",
                "@babel/preset-react",
                [
                  "@babel/preset-env",
                  {
                    targets: {
                      browsers: "last 2 versions",
                    },
                    modules: false,
                    loose: false,
                  },
                ],
              ],
            },
          },
        ],
      },
      {
        test: /\.css$/i,
        // exclude: [/node_modules/, /public/],
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(png|jpe?g|woff2?|eot|ttf|svg)$/i,
        exclude: /node_modules/,
        loader: "url-loader",
        options: { limit: false },
      },
    ],
  },
  plugins: [
    new FriendlyErrorsWebpackPlugin({ clearConsole: false }),
    new WebpackBar(),
    new CopyPlugin({
      patterns: [{ from: "public", to: "." }],
    }),
  ],
};

/**@type {import('webpack').Configuration} */
const content = {
  name: "content",
  target: "web",
  entry: "./src/content/index.ts",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "content.js",
  },
  ...commonConfig,
};

/**@type {import('webpack').Configuration} */
const background = {
  name: "background",
  target: "web",
  entry: "./src/background/index.ts",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "background.js",
  },
  ...commonConfig,
};

/**@type {import('webpack').Configuration} */
const popup = {
  name: "popup",
  target: "web",
  entry: "./src/popup/index.tsx",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "popup.js",
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "popup.html",
    }),
  ],
  ...commonConfig,
};

/**@type {import('webpack').Configuration} */
const options = {
  name: "options",
  target: "web",
  entry: "./src/options/index.tsx",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "options.js",
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "options.html",
    }),
  ],
  ...commonConfig,
};

module.exports = [content, background, popup, options];
