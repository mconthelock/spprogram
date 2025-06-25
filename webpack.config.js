const path = require("path");
const webpack = require("webpack");
const Dotenv = require("dotenv-webpack");
const CompressionPlugin = require("compression-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
module.exports = {
  entry: {
    authen: "./assets/script/authen.js",
    app: "./assets/script/app.js",
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "assets/dist/js"),
  },
  mode: process.env.STATE,
  optimization: {
    concatenateModules: true,
    minimize: true,
    minimizer: [new TerserPlugin()],
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.md$/,
        use: "raw-loader",
      },
    ],
  },
  plugins: [
    new Dotenv(),
    new CompressionPlugin({
      algorithm: "gzip", // หรือใช้ "brotliCompress" ก็ได้
      test: /\.(js|css|html|svg)$/,
      threshold: 10240,
      minRatio: 0.8,
    }),
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery",
    }),
  ],
  externals: {
    datatables: "DataTables",
  },
  resolve: {
    alias: {
      "@root": path.resolve(__dirname, "../form/assets/script"),
    },
  },
};
