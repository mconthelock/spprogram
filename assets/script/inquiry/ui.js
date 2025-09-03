import * as utils from "../utils.js";
var table;
var tableElmes;
var tableAttach;
let selectedFilesMap = new Map();

$(document).on("mouseenter", ".detail-log", function () {
  const data = $(this).closest("td").find("ul");
  console.log();

  const content = $("#tip1");
  content.find(".tooltip-content").html("");
  content.find(".tooltip-content").append(`<ul>${data.html()}</ul>`);
  const rect = $(this)[0].getBoundingClientRect();
  content.css("top", rect.bottom + window.scrollY + "px");
  content.css("left", rect.left + window.scrollX + "px");
  content.removeClass("hidden");
});

$(document).on("mouseleave", ".detail-log", function () {
  $("#tip1").addClass("hidden");
});

$(document).on("click", "#add-attachment", async function (e) {
  e.preventDefault();
  console.log("Add attachment");
  $("#attachment-file").click();
});
