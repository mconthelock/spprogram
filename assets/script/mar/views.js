import "@styles/datatable.min.css";
import { createTable, destroyTable } from "@public/_dataTable.js";
import * as inqs from "../inquiry/detail.js";
import * as tb from "../inquiry/table.js";
import * as service from "../service/inquiry.js";
var table;
var tableAttach;
$(document).ready(async () => {
  $(".mainmenu").find("details").attr("open", false);
  $(".mainmenu.navmenu-newinq").find("details").attr("open", true);

  const inquiry = await service.getInquiryID($("#inquiry-id").val());
  const cards = await inqs.setupCard();
  const cardsData = await inqs.applyValueCard(inquiry);
  const detail = await tb.setupTableDetailView(inquiry.details);
  table = await createTable(detail);

  const logs = await service.getInquiryHistory(inquiry.INQ_NO);
  const history = await tb.setupTableHistory(logs);
  await createTable(history, { id: "#history" });

  const attachment = await tb.setupTableAttachment();
  tableAttach = await createTable(attachment, { id: "#attachment" });
});
