import "@styles/datatable.min.css";
import { createTable, destroyTable } from "@public/_dataTable.js";
import * as utils from "../utils.js";
import * as inqs from "../inquiry/detail.js";
import * as tb from "../inquiry/table.js";
import * as service from "../service/inquiry.js";
var table;
var tableAttach;
$(document).ready(async () => {
  $(".mainmenu").find("details").attr("open", false);
  $(".mainmenu.navmenu-newinq").find("details").attr("open", true);

  const inquiry = await service.getInquiryID($("#inquiry-id").val());
  const cards = await inqs.setupCard(inquiry);
  //   const cardsData = await inqs.applyValueCard(inquiry);
  const detail = await tb.setupTableDetailView(inquiry.details);
  table = await createTable(detail);

  const logs = await service.getInquiryHistory(inquiry.INQ_NO);
  const history = await tb.setupTableHistory(logs);
  await createTable(history, { id: "#history" });

  const attachment = await tb.setupTableAttachment();
  tableAttach = await createTable(attachment, { id: "#attachment" });

  const btn = await setupButton();
});

async function setupButton() {
  const sendDE = await utils.creatBtn({
    id: "send-de",
    title: "Send to Design",
    className: "btn-primary text-white",
  });

  const sendIS = await utils.creatBtn({
    id: "send-bm",
    title: "Send to Pre-BM",
    icon: "icofont-console text-2xl",
    className: "btn-neutral text-white",
  });

  const draft = await utils.creatBtn({
    id: "draft",
    title: "Send draft",
    icon: "icofont-attachment text-2xl",
    className: "btn-neutral text-white",
  });

  const back = await utils.creatBtn({
    id: "goback",
    title: "Back",
    type: "link",
    href: `${process.env.APP_ENV}/mar/inquiry`,
    icon: "icofont-arrow-left text-2xl",
    className: "btn-outline btn-neutral text-neutral hover:text-white",
  });
  $("#btn-container").append(sendDE, sendIS, draft, back);
}
