import DefaultTheme from "vitepress/theme-without-fonts";
import ImagePopup from "./components/ImagePopup.vue";
import HeroBackground from "./components/HeroBackground.vue";
import LogoModel from "./components/LogoModel.vue";
import "./custom.css";

export default {
	extends: DefaultTheme,
	enhanceApp({ app }) {
		app.component("ImagePopup", ImagePopup);
		app.component("HeroBackground", HeroBackground);
		app.component("LogoModel", LogoModel);
	},
};
