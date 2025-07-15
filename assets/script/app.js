// import { initAuthen } from "@public/authen.js";
import { initSidebar } from "@public/component/sidebar.js";

$(function () {
  initSidebar({
    icon: `${process.env.APP_ENV}/assets/images/cube.png`,
    programName: "SP PROGRAM",
  });
  //   initAuthen();
});
