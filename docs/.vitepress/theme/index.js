// // https://vitepress.dev/guide/custom-theme
// import { h } from 'vue'
// import DefaultTheme from 'vitepress/theme'
// import './style.css'

// /** @type {import('vitepress').Theme} */
// export default {
//   extends: DefaultTheme,
//   Layout: () => {
//     return h(DefaultTheme.Layout, null, {
//       // https://vitepress.dev/guide/extending-default-theme#layout-slots
//     })
//   },
//   enhanceApp({ app, router, siteData }) {
//     // ...
//   }
// }

import DefaultTheme from "vitepress/theme";
import HeroBackground from "./components/HeroBackground.vue";
import LogoModel from "./components/LogoModel.vue";
import "./custom.css";

export default {
	extends: DefaultTheme,
	enhanceApp({ app }) {
		app.component("HeroBackground", HeroBackground);
		app.component("LogoModel", LogoModel);
	},
};
