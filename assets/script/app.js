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
  $(".toast-message").addClass("fade-out-element");
  setTimeout(function () {
    $(".toast-message").remove();
  }, 1000);
});
