const path = require("path");
const Dotenv = require("dotenv-webpack");
const CompressionPlugin = require("compression-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
module.exports = {
  entry: {
    // apps: "./assets/script/apps.js", //general function
    // login: "./assets/script/login.js", //Login page
    // home: "./assets/script/home/index.js", //Home page
    // redirect: "./assets/script/home/redirect.js", //Redirect page
    // form: "./assets/script/form/index.js", //Form page

    // //is form

    // // user environment IS-TID
    // userEnv: "./assets/script/isform/IS-TID/index.js", //user environment page
    // userEnvView: "./assets/script/isform/IS-TID/view.js",

    // // confirm sheet IS-CFS
    // confirmSheet: "./assets/script/isform/IS-CFS/index.js", //confirm sheet page
    // confirmSheetView: "./assets/script/isform/IS-CFS/view.js", //confirm sheet page

    //   // varied off
    // variedOff: "./assets/script/isform/IS-OFF/view.js", //Varied Off AS400 display

    // // result confirmation
    // resultConf: "./assets/script/isform/IS-JDR/view.js", //Job result confirmation

    // // Special Authorization ID
    // specialAuth: "./assets/script/isform/IS-SPC/index.js", //Special Authorization ID page
    // specialAuthView: "./assets/script/isform/IS-SPC/view.js", //Special Authorization ID page

    // // IS Trouble Report
    // troubleReport: "./assets/script/isform/IS-TRB/index.js", //IS Trouble Report page
    // troubleReportView: "./assets/script/isform/IS-TRB/view.js", //IS Trouble Report page

    // variedOff: "./assets/script/isform/IS-OFF/view.js", //Varied Off AS400 display

    // Special Authorization ID
    // specialAuth: "./assets/script/isform/IS-SPC/index.js", //Special Authorization ID page
    // specialAuthView: "./assets/script/isform/IS-SPC/view.js", //Special Authorization ID page

    // // IS Trouble Report
    // troubleReport: "./assets/script/isform/IS-TRB/index.js", //IS Trouble Report page
    // troubleReportView: "./assets/script/isform/IS-TRB/view.js", //IS Trouble Report page

    // // Daily Log Checksheet
    // DailyLogView: "./assets/script/isform/IS-DLC/view.js",
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
  ],
  externals: {
    jquery: "jQuery",
    datatables: "DataTables",
  },
};
