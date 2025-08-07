// import { initAuthen } from "@public/authen.js";
import mockupmenu from "../files/mockup_menu.json";
import { initSidebar, setSidebarMenu } from "@public/component/sidebar.js";
import { initNavbar } from "@public/component/navbar.js";

$(function () {
  initSidebar({
    icon: `${process.env.APP_ENV}/assets/images/cube.png`,
    programName: "SP PROGRAM",
  });

  initNavbar({
    icon: `${process.env.APP_ENV}/assets/images/cube.png`,
    programName: "SP PROGRAM",
    toggleId: "mastermenu",
  });
  setSidebarMenu(mockupmenu, null);
});

$(document).on("click", ".msg-close", function () {
  const msgbox = $(this).closest(".toast-message");
  msgbox.addClass("opacity-0");
  setTimeout(function () {
    msgbox.remove();
  }, 1000);
});
