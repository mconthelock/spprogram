import { defineConfig } from "vitepress";
import dotenv from "dotenv";
dotenv.config();

export default defineConfig({
	vite: { clearScreen: false },
	title: "SP Program",
	description: "A VitePress Site",
	head: [
		[
			"link",
			{
				rel: "icon",
				href: `${
					process.env.VITE_APP_HOST || ""
				}/assets/images/icon_512.png`,
			},
		],
	],
	outDir: "dist",
	base: "/spprogram/docs/",
	markdown: {
		image: { lazyLoading: true },
	},
	themeConfig: {
		logo: `${process.env.VITE_APP_HOST || ""}/assets/images/icon_512.png`, // โลโก้ที่มุมบนซ้าย navbar
		search: {
			provider: "local",
		},
		nav: [
			{ text: "Home", link: "/" },
			{ text: "Guide", link: "/quick-start" },
		],

		sidebar: [
			{
				text: "Inquiry",
				collapsed: false,
				items: [
					{ text: "Add new inquiry", link: "/matrix/effect" },
					{
						text: "Add stock part inquiry",
						link: "/matrix/master",
					},
					{
						text: "On process inquiry",
						link: "/matrix/master",
					},
					{
						text: "Pending pre-bm inquiry",
						link: "/matrix/master",
					},
					{
						text: "Inquiry report",
						link: "/matrix/manual",
					},
				],
			},
		],
	},
	// ควบคุม หน้า index.md จาก env
	transformPageData(pageData) {
		if (pageData.relativePath === "index.md") {
			pageData.frontmatter ||= {};
			pageData.frontmatter.hero = {
				...(pageData.frontmatter.hero || {}),
				name: process.env.VITE_APP_NAME || "DailyIds",
				text: process.env.VITE_APP_TEXT || "manual",
				image: {
					src: `${
						process.env.VITE_APP_HOST || ""
					}/assets/images/icon_512.png`,
					alt: "SP Program Image",
				},
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
