var pin = sessionStorage.getItem("pin");
// $(document).on(
//   "mouseover",
//   "#drawer-wrapper.sidebar-collapsed .drawer-side",
//   function () {
//     $("#drawer-wrapper").removeClass("sidebar-collapsed");
//     //$('#content').removeClass('active');
//     //$("#drawer-wrapper").removeClass("d-none");
//   }
// );

// $(document).on("mouseleave", "#drawer-wrapper .drawer-side", function () {
//   $("#drawer-wrapper").addClass("sidebar-collapsed");
//   //$('#content').removeClass('active');
//   //$("#drawer-wrapper").removeClass("d-none");
// });

export function pinOn() {
  $("#sidebar").addClass("pin");
  $("#sidebar").removeClass("active");
  $("#content").removeClass("active");
  $("#navbar_top").removeClass("active");
  $("#sidebarCollapse").removeClass("d-none");
  $("#sidebarCollapsePin").addClass("d-none");
  sessionStorage.setItem("pin", true);
}

export function pinOff() {
  $("#sidebar").removeClass("pin");
  $("#sidebar").addClass("active");
  $("#content").addClass("active");
  $("#navbar_top").addClass("active");
  $("#sidebarCollapse").addClass("d-none");
  $("#sidebarCollapsePin").addClass("d-none");
  sessionStorage.setItem("pin", false);
}

// document.addEventListener("DOMContentLoaded", () => {
//   const toggleBtn = document.getElementById("sidebar-toggle-btn");
//   const wrapper = document.getElementById("drawer-wrapper");

//   toggleBtn.addEventListener("click", () => {
//     wrapper.classList.toggle("sidebar-collapsed");
//     console.log("xxxxx");
//   });
// });
