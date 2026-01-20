import * as utils from "./utils.js";
$(async function () {
	try {
		await utils.initApp({ submenu: ".navmenu-newinq" });
	} catch (error) {
		console.log(error);
	} finally {
		await showLoader({ show: false });
	}
});
