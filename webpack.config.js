const path = require("path");
const webpack = require("webpack");
const Dotenv = require("dotenv-webpack");
const CompressionPlugin = require("compression-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
module.exports = {
  entry: {
    apps: "./assets/script/apps.js",
    home: "./assets/script/home.js",
    //MAR User
    inquiryui: "./assets/script/inquiry/ui.js",
    mar_inquiry: "./assets/script/mar/inquiry.js",
    mar_inqdetail: "./assets/script/mar/inqdetail.js",
    mar_inqviews: "./assets/script/mar/inqview.js",
    mar_inqstock: "./assets/script/mar/inqstock.js",
    mar_inq_report: "./assets/script/mar/inquiry_report.js",
    //Quotation
    mar_quotation: "./assets/script/mar/quotation.js",
    mar_quodetail: "./assets/script/mar/quodetail.js",
    mar_quoview: "./assets/script/mar/quoview.js",
    mar_quoreport: "./assets/script/mar/quoreport.js",
    priceratio: "./assets/script/mar/priceratio.js",
    currency: "./assets/script/mar/currency.js",
    inqcontrol: "./assets/script/mar/inqcontrol.js",
    mar_items: "./assets/script/mar/items.js",
    mar_items_detail: "./assets/script/mar/items_detail.js",
    mar_pricelist: "./assets/script/mar/pricelist.js",
    //Sale user
    se_inquiry: "./assets/script/sale/inquiry.js",
    se_inqdetail: "./assets/script/sale/inqdetail.js",
    se_inqviews: "./assets/script/sale/inqview.js",
    se_inq_report: "./assets/script/sale/report.js",
    //Designer
    des_inquiry: "./assets/script/des/inquiry.js",
    des_inqdetail: "./assets/script/des/detail.js",
    des_inqviews: "./assets/script/des/view.js",
    des_report: "./assets/script/des/report.js",
    des_users: "./assets/script/des/users.js",

    //Finance
    fin_items: "./assets/script/fin/items.js",
    fin_inquiry: "./assets/script/fin/inquiry.js",
    fin_inqdetail: "./assets/script/fin/inquiry_detail.js",
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "assets/dist/js"),
  },
  mode: process.env.STATE,
  optimization: {
    concatenateModules: true,
    minimize: true,
    minimizer: [
      new TerserPlugin({
        parallel: true, // ✅ เปิด multi-core minify
        terserOptions: {
          format: {
            comments: false, // ลบคอมเมนต์ทิ้ง
          },
        },
        extractComments: false, // ไม่แยก LICENSE ออกมาเป็นไฟล์ .txt
        exclude: /public/, // <<< อย่ามาย่อไฟล์ที่ copy มา
      }),
    ],
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
      exclude: /public/, // <<< อย่ามาบีบอัดไฟล์ที่ copy มา
    }),
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery",
      datatables: "DataTables",
    }),
    // copy public script ไปไว้ที่ assets/script/public
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, "../form/assets/script/public/v1.0.3"),
          to: path.resolve(__dirname, "assets/script/public"),
          noErrorOnMissing: true,
          globOptions: {
            // เอาเฉพาะ js ก็พอ
            ignore: ["**/*.map", "**/*.json"], // จะไม่ก็อปไฟล์ขยะ
          },
        },
      ],
    }),
  ],
  resolve: {
    alias: {
      "@root": path.resolve(__dirname, "../form/assets/script"),
      "@public": path.resolve(__dirname, "../form/assets/script/public/v1.0.3"),
      "@styles": path.resolve(__dirname, "../form/assets/dist/css"),
    },
  },
  cache:
    process.env.STATE === "production"
      ? false
      : {
          type: "filesystem",
          //   cacheDirectory: path.resolve(__dirname, '.cache/webpack'),
          buildDependencies: {
            config: [__filename],
          },
        },
};
