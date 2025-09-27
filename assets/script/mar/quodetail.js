import "datatables.net-responsive-dt/css/responsive.dataTables.min.css";
import "@styles/select2.min.css";
import "@styles/datatable.min.css";
import moment from "moment";
import ExcelJS from "exceljs";
import { createTable } from "@public/_dataTable.js";
import { setDatePicker } from "@public/_flatpickr.js";
import * as utils from "../utils.js";
import * as inqs from "../inquiry/detail.js";
import * as tb from "../inquiry/table.js";
import * as tbquo from "../quotation/table_detail.js";
import * as tbweight from "../quotation/table_weight.js";
import * as service from "../service/inquiry.js";
import * as cus from "../service/customers.js";
var table;
var tableAttach;
var tableWeight;

$(document).ready(async () => {
  try {
    const view = $("#view-type").val() == "inquiry" ? "newinq" : "quotation";
    await utils.initApp({ submenu: `.navmenu-${view}` });
    const inquiry = await service.getInquiryID($("#inquiry-id").val());
    if (inquiry.length == 0) throw new Error("Inquiry do not found");

    $("#inquiry-title").html(inquiry.INQ_NO);
    inquiry.QUO_DATE = moment().format("YYYY-MM-DD");
    const now = moment();
    inquiry.QUO_VALIDITY = now.add(60, "days").format("YYYY-MM-DD");
    inquiry.QUO_NOTE = "";

    const customers = await cus.getCustomer();
    const customer = customers.find((c) => c.CUS_ID == inquiry.INQ_CUSTOMER);
    inquiry.QUO_CUSTOMER = customer == undefined ? "" : customer.CUS_NAME;
    const cards = await inqs.setupCard(inquiry);
    if (inquiry.INQ_PKC_REQ == 0) {
      $("#tabs-lift").remove();
      $("#table-freight").remove();
    } else {
      $("#without-tab").remove();
      await freightData(inquiry.weight);
    }

    //Inquiry Detail
    const details = inquiry.details.filter((dt) => dt.INQD_LATEST == 1);
    const tableContainer = await tbquo.setupTableDetail(
      details,
      inquiry.INQ_TYPE
    );

    //Weight Package
    const weightContainer = await tbweight.setupTableDetail(inquiry.weight);
    tableWeight = await createTable(weightContainer, { id: "#table-weight" });

    //Inquiry History
    table = await createTable(tableContainer);
    const logs = await service.getInquiryHistory(inquiry.INQ_NO);
    const history = await tb.setupTableHistory(logs);
    await createTable(history, { id: "#history" });

    const file = await service.getInquiryFile({ INQ_NO: inquiry.INQ_NO });
    const attachment = await tb.setupTableAttachment(file, true);
    tableAttach = await createTable(attachment, { id: "#attachment" });

    //create button
    const btn = await setupButton("");
    const date = await setDatePicker();
  } catch (error) {
    utils.errorMessage(error);
    return;
  } finally {
    await utils.showLoader({ show: false });
  }
});

async function setupButton(mode) {
  const issue = await utils.creatBtn({
    id: "issue",
    title: "Issue Quotation",
    className: "btn-primary text-white shadow-lg",
    icon: "fi fi-tr-paper-plane-top text-xl rotate-[-45deg]",
  });

  const reject = await utils.creatBtn({
    id: "reject",
    title: "Unable Process",
    className:
      "btn-neutral text-white shadow-lg hover:bg-transparent hover:text-neutral",
    icon: "fi fi-tr-circle-xmark text-xl",
  });

  const edit = await utils.creatBtn({
    id: "edit",
    title: "Revise",
    type: "link",
    href: `${process.env.APP_ENV}/mar/inquiry/edit/${$("#inquiry-id").val()}`,
    className:
      "btn-neutral text-white shadow-lg hover:bg-transparent hover:text-neutral",
    icon: "fi fi-tr-feedback-cycle-loop text-xl",
  });

  const back = await utils.creatBtn({
    id: "goback",
    title: "Back",
    type: "link",
    href: `#`,
    icon: "fi fi-rr-arrow-circle-left text-xl",
    className:
      "btn-outline btn-neutral text-neutral hover:text-white hover:bg-neutral",
  });

  $("#btn-container").append(issue, reject, edit, back);
}

$(document).on("change", ".inqty", async function () {
  const qty = $(this).val();
  const row = table.row($(this).closest("tr")).data();
  const data = { ...row, INQD_QTY: qty };
  table.row($(this).closest("tr")).data(data).draw();
  await totalDetail();
});

$(document).on("change", ".freight-value", function () {
  const value = $(this).val();
  if (isNaN(value) || value < 0) {
    $(this).val(0);
    utils.errorMessage("Please enter a valid number");
    return;
  }

  const voulumn = $(this).closest("tr").find("input").eq(1).val();
  const total = voulumn * value;
  $(this).closest("tr").find("input").eq(2).val(utils.digits(total, 0));
});

async function freightData(data) {
  const totalVolume = data.reduce((a, b) => a + (b.ROUND_WEIGHT || 0), 0);
  const totalWeight = data.reduce((a, b) => a + (b.GROSS_WEIGHT || 0), 0);

  //Sae Freight Table
  const sea = $("#table-freight").find(".sea-value").val();
  $("#table-freight").find(".sea-voulumn").val(utils.digits(totalVolume, 0));
  $("#table-freight")
    .find(".sea-total")
    .val(utils.digits(totalVolume * sea, 0) || 0);
  //Air Freight Table
  const air = $("#table-freight").find(".sea-value").val();
  $("#table-freight").find(".air-voulumn").val(utils.digits(totalWeight, 0));
  $("#table-freight")
    .find(".air-total")
    .val(utils.digits(totalWeight * air, 0) || 0);
  //Courier Freight Table
  const courier = $("#table-freight").find(".sea-value").val();
  $("#table-freight")
    .find(".courier-voulumn")
    .val(utils.digits(totalWeight, 0));
  $("#table-freight")
    .find(".courier-total")
    .val(utils.digits(totalWeight * courier, 0) || 0);
}

async function totalDetail() {
  //Summary
  let grandTotal = 0;
  table.rows().every(function () {
    const data = this.data();
    const unit = Math.ceil(data.INQD_UNIT_PRICE * data.INQD_QTY);
    grandTotal += unit;
  });
  $(table.table().footer())
    .find(".grand-total")
    .text(utils.digits(grandTotal, 0));
}
