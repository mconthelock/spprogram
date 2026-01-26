const path = require("path");
const rspack = require("@rspack/core");
const Dotenv = require("dotenv-webpack");
const { defaultConfig } = require("@amec/webasset/default.config");

require("dotenv").config({
	path: path.resolve(__dirname, "./.env"),
});

module.exports = {
	entry: {
		apps: "./assets/script/apps.js",
		home: "./assets/script/home.js",
		inquiryui: "./assets/script/inquiry/ui.js",
		mar_inquiry: "./assets/script/mar/inquiry.js",
		mar_inqdetail: "./assets/script/mar/inqdetail.js",
		mar_inqviews: "./assets/script/mar/inqview.js",
		mar_inqstock: "./assets/script/mar/inqstock.js",
		mar_inq_report: "./assets/script/mar/inquiry_report.js",
		mar_quotation: "./assets/script/mar/quotation.js",
		mar_quodetail: "./assets/script/mar/quodetail.js",
		mar_quoview: "./assets/script/mar/quoview.js",
		mar_quoreport: "./assets/script/mar/quoreport.js",
		mar_orders: "./assets/script/mar/orders.js",
		priceratio: "./assets/script/mar/priceratio.js",
		currency: "./assets/script/mar/currency.js",
		inqcontrol: "./assets/script/mar/inqcontrol.js",
		mar_items: "./assets/script/mar/items.js",
		mar_items_detail: "./assets/script/mar/items_detail.js",
		mar_pricelist: "./assets/script/mar/pricelist.js",
		mar_outtoout: "./assets/script/mar/outtoout.js",
		//For Sale User
		se_inquiry: "./assets/script/sale/inquiry.js",
		se_inqdetail: "./assets/script/sale/inqdetail.js",
		se_inqviews: "./assets/script/sale/inqview.js",
		se_inq_report: "./assets/script/sale/report.js",
		des_inquiry: "./assets/script/des/inquiry.js",
		des_inqdetail: "./assets/script/des/detail.js",
		des_inqviews: "./assets/script/des/view.js",
		des_report: "./assets/script/des/report.js",
		des_users: "./assets/script/des/users.js",
		fin_items: "./assets/script/fin/items.js",
		fin_inquiry: "./assets/script/fin/inquiry.js",
		fin_inqdetail: "./assets/script/fin/inquiry_detail.js",
		fin_pricelist: "./assets/script/fin/pricelist.js",
		fin_report: "./assets/script/fin/report.js",
	},
	output: {
		filename: "[name].js",
		path: path.resolve(__dirname, "assets/dist/js"),
		clean: true,
	},
	mode: process.env.STATE || "development",
	module: {
		rules: [
			{
				test: /\.css$/,
				use: ["style-loader", "css-loader"],
				type: "javascript/auto",
			},
			{
				test: /\.md$/,
				type: "asset/source",
			},
		],
	},
	optimization: {
		minimize: process.env.STATE === "production",
	},
	plugins: [
		new Dotenv(),
		new rspack.DefinePlugin({
			__WEBASSET_CONFIG__: JSON.stringify(defaultConfig({})),
		}),
		// ใช้ ProvidePlugin จาก @rspack/core
		new rspack.ProvidePlugin({
			$: "jquery",
			jQuery: "jquery",
			datatables: "DataTables",
		}),
		// Copy Files ใช้ CopyRspackPlugin ซึ่งเป็น native ของ Rspack
		new rspack.CopyRspackPlugin({
			patterns: [
				{
					from: path.resolve(
						__dirname,
						"node_modules/@amec/webasset/src/fonts",
					),
					to: path.resolve(__dirname, "assets/fonts"),
					noErrorOnMissing: true,
				},
				{
					from: path.resolve(
						__dirname,
						"node_modules/@amec/webasset/src/images",
					),
					to: path.resolve(__dirname, "assets/images"),
					noErrorOnMissing: true,
				},
			],
		}),
	],
	resolve: {
		alias: {
			jquery: require.resolve("jquery"),
		},
	},
};
