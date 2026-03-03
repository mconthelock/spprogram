import { defineConfig } from "vitepress";
import dotenv from "dotenv";
import * as sidebar from "./sidebar.js";
dotenv.config();

export default defineConfig({
	vite: { clearScreen: false },
	title: "SP Program",
	head: [
		[
			"link",
			{
				rel: "icon",
				href: `${process.env.VITE_APP_HOST || ``}/assets/images/icon_512.png`,
			},
		],
	],
	outDir: "dist",
	base: "/spprogram/docs/",
	markdown: { image: { lazyLoading: true } },
	themeConfig: {
		logo: `${process.env.VITE_APP_HOST || ""}/assets/images/icon_512.png`,
		search: {
			provider: "local",
		},
		nav: [
			{ text: "Home", link: "/" },
			{ text: "Guide", link: "/quick-start" },
		],
		sidebar: {
			"/": [
				{ text: "Quick Start", link: "/quick-start" },
				{
					text: "MAR User Guide",
					link: "/mar/inquiry-new",
				},
				{
					text: "Sale User Guide",
					link: "/sale/inquiry",
				},
				{
					text: "D/E User Guide",
					link: "/de/inquiry",
				},
				{
					text: "Finance User Guide",
					link: "/fin/confirm",
				},
				{
					text: "PKC User Guide",
					link: "/pkc/inquiry",
				},
			],
			"/mar/": sidebar.marItem,
			"/sale/": sidebar.saleItem,
			"/de/": sidebar.deItem,
			"/fin/": sidebar.finItem,
			"/pkc/": sidebar.pkcItem,
		},
	},
	// ควบคุม หน้า index.md จาก env
	transformPageData(pageData) {
		if (pageData.relativePath === "index.md") {
			pageData.frontmatter ||= {};
			pageData.frontmatter.hero = {
				...(pageData.frontmatter.hero || {}),
				name: process.env.VITE_APP_NAME || "SP Program",
				text: process.env.VITE_APP_TEXT || "manual",
				tagline:
					process.env.VITE_APP_TAGLINE ||
					"Powered by VitePress + custom theme",
				actions: [
					{
						theme: "brand",
						text: "Getting Started",
						link: process.env.VITE_APP_HOST || "/",
					},
					{
						theme: "alt",
						text: "User Guide",
						link: "/quick-start",
					},
				],
			};
		}
	},
});
