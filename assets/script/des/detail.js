import * as utils from "../utils.js";
$(async function () {
  try {
    await utils.initApp();
  } catch (error) {
    console.log(error);
  } finally {
    await utils.showLoader({ show: false });
  }
});
