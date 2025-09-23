import * as utils from "../utils.js";
$(document).ready(async () => {
  try {
    await utils.initApp({ submenu: ".navmenu-quotation" });
  } catch (error) {
    utils.errorMessage(error);
    return;
  } finally {
    await utils.showLoader({ show: false });
  }
});
