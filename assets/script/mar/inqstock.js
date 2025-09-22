/*
Funtion contents
001 - On load form
002 - Add table detail rows
003 - Show Elmes table
004 - Unable to reply checkbox
005 - Import data from file
006 - Save Draft
007 - Save and send to design
008 - Save and send to AS400
009 - Add attachment
010 - Download attached file
011 - Delete attached file
*/
import "datatables.net-responsive-dt/css/responsive.dataTables.min.css";
import "@styles/select2.min.css";
import "@styles/datatable.min.css";

import { createTable } from "@public/_dataTable.js";
import * as inqservice from "../service/inquiry.js";
import * as items from "../service/items.js";
import * as utils from "../utils.js";
import * as inqs from "../inquiry/detail.js";
import * as tb from "../inquiry/table.js";
import * as tbmar from "../inquiry/table_stock.js";

//001: On load form
var table;
var tablePriceList;
let selectedFilesMap = new Map();
let deletedFilesMap = new Map();
let deletedLineMap = new Map();
$(document).ready(async () => {
  try {
    await utils.initApp({ submenu: ".navmenu-newinq" });
    let logs, inquiry, details, file;
    let mode = "create";
    const currentUrl = window.location.href;
    if (currentUrl.includes("edit") && $("#inquiry-id").val() != "") {
      inquiry = await inqservice.getInquiryID($("#inquiry-id").val());
      if (inquiry.length == 0) throw new Error("Inquiry do not found");

      if (inquiry.INQ_STATUS >= 10)
        inquiry.INQ_REV = utils.revision_code(inquiry.INQ_REV);

      mode = "edit";
      details = inquiry.details.filter((dt) => dt.INQD_LATEST == "1");
      logs = await inqservice.getInquiryHistory(inquiry.INQ_NO);
      file = await inqservice.getInquiryFile({ INQ_NO: inquiry.INQ_NO });
    }

    const cards = await inqs.setupCard(inquiry);
    const tableContainer = await tbmar.setupTableDetail(details);
    table = await createTable(tableContainer);

    const btn = await setupButton(mode);
    $("#inquiry-no").addClass("stockpart");
    $("#remark").closest(".grid").addClass("hidden");
    $("#currency").closest(".grid").removeClass("hidden");
  } catch (error) {
    console.log(error);
    await utils.errorMessage(error);
  } finally {
    await utils.showLoader({ show: false });
  }
});

$(document).on("keyup", ".stockpart", async function (e) {
  $("#project-no").val($(this).val());
});

async function setupButton(mode) {
  const additems = await utils.creatBtn({
    id: "add-item",
    title: "Add item",
    icon: "fi fi-rr-shopping-cart text-xl",
    className: "btn-neutral hover:bg-neutral/70 hover:shadow-lg btn-disabled",
  });

  const savedata = await utils.creatBtn({
    id: "savedata",
    title: "Save Data",
    icon: "fi fi-tr-envelope-open-text text-xl",
    className:
      "btn-primary text-white hover:shadow-lg hover:bg-primary/70 btn-disabled",
  });

  const back = await utils.creatBtn({
    id: "goback",
    title: "Back",
    type: "link",
    href: `${process.env.APP_ENV}/mar/inquiry`,
    icon: "fi fi-rr-arrow-circle-left text-xl",
    className:
      "btn-outline btn-neutral text-neutral hover:text-white hover:bg-neutral/70",
  });

  $("#btn-container").append(additems, savedata, back);
}

//002: Add table detail rows
$(document).on("click", "#add-item", async function (e) {
  e.preventDefault();
  const id = utils.digits(table.rows().data().length + 1);
  await tb.addRow(id, table);

  const rowNode = table.rows("tr:last").nodes();
  $(rowNode).find(".itemno").focus();
});

$(document).on("keyup", ".itemno", async function (e) {
  e.preventDefault();
  const itemno = $(this).val();
  if (itemno.length < 3) return;

  const itemslist = await items.getItemsCustomer({
    CUSTOMER_ID: $("#customer").val(),
  });
  const pricelist = itemslist.filter((item) => item.itemdesc.ITEM_NO == itemno);
  if (pricelist.length == 0) {
    await utils.showMessage(`Item ${itemno} is not found on Price List!`);
    $(this).val("").focus();
    return;
  }

  const pricelistTb = await tbmar.setupTablePriceList(pricelist);
  tablePriceList = await createTable(pricelistTb, {
    id: "#table-price-list",
    columnSelect: { status: true },
  });
  $("#new-stock-item").prop("checked", true);
});

$(document).on("click", "#price-list-cancel", async function (e) {
  e.preventDefault();
  $("#table-price-list").html("");
  $("#new-stock-item").prop("checked", false);
});

$(document).on("click", "#price-list-confirm", async function (e) {
  e.preventDefault();
  const rows = tablePriceList.rows({ selected: true }).data().toArray();
  if (rows.length == 0) {
    await utils.showMessage(`Please select item to add!`);
    return;
  }

  //delete last row of table
  const lastRow = table.rows().data().length - 1;
  table.row(lastRow).remove().draw();
  let index = lastRow;
  rows.forEach(async (row) => {
    if (row.selected) {
      index = index + 1;
      const formula = row.customer.rate.FORMULA;
      const cost = row.itemdesc.prices[0].TCCOST;
      const price = formula * cost;
      const newrow = {
        INQD_ITEM: row.itemdesc.ITEM_NO,
        INQD_PARTNAME: row.itemdesc.ITEM_NAME,
        INQD_DRAWING: row.itemdesc.ITEM_DWG,
        INQD_VARIABLE: row.itemdesc.ITEM_VARIABLE,
        INQD_UM: row.itemdesc.ITEM_UNIT,
        INQD_SUPPLIER: row.itemdesc.ITEM_SUPPLIER,
        INQD_FC_COST: row.itemdesc.prices[0].FCCOST,
        INQD_FC_BASE: row.itemdesc.prices[0].FCBASE,
        INQD_TC_COST: row.itemdesc.prices[0].TCCOST,
        INQD_TC_BASE: row.customer.rate.FORMULA,
        INQD_UNIT_PRICE: price,
      };
      await tb.addRow(index, table, newrow);
      console.log(index);
    }
  });
  $("#table-price-list").html("");
  $("#new-stock-item").prop("checked", false);
});

$(document).on("click", ".delete-sub-line", async function (e) {
  e.preventDefault();
  const row = table.row($(this).closest("tr"));
  const data = row.data();
  if (data.INQD_ID != "") {
    deletedLineMap.set(data.INQD_ID, data);
  }
  row.remove().draw(false);
});

$(document).on("change", ".edit-input", async function () {
  await tb.changeCell(table, this);
});

//Submit Form
//006: Save Draft
$(document).on("click", "#draft", async function (e) {
  e.preventDefault();
  await createPath({ level: 1, status: 1 });
});

//007: Save and send to design
$(document).on("click", "#send-de", async function (e) {
  e.preventDefault();
  await createPath({ level: 1, status: 2 });
});

//008: Save and send to AS400
$(document).on("click", "#send-bm", async function (e) {
  e.preventDefault();
  await createPath({ level: 2, status: 30 });
});

async function createPath(opt) {
  const chkheader = await inqs.verifyHeader(".req-2");
  if (!chkheader) return;
  const header = await inqs.getFormHeader();
  const check_inq = await inqservice.getInquiry({ INQ_NO: header.INQ_NO });
  if (check_inq.length > 0) {
    await utils.showMessage(`Inquiry ${header.INQ_NO} is already exist!`);
    $("#inquiry-no").focus().select();
    return;
  }
  const details = table.rows().data().toArray();
  try {
    const checkdetail = await inqs.verifyDetail(table, details, opt.level);
    await utils.showLoader({
      show: true,
      title: "Saving data",
      clsbox: `!bg-transparent`,
    });
    header.INQ_STATUS = opt.status;
    header.INQ_TYPE = "SP";
    header.INQ_MAR_SENT = new Date();
    const fomdata = { header, details };
    const inquiry = await inqservice.createInquiry(fomdata);
    if (selectedFilesMap.size > 0) {
      const attachment_form = new FormData();
      attachment_form.append("INQ_NO", inquiry.INQ_NO);
      selectedFilesMap.forEach((file, fileName) => {
        attachment_form.append("files", file, fileName);
      });
      await inqservice.createInquiryFile(attachment_form);
    }

    if (opt.status == 1)
      window.location.replace(
        `${process.env.APP_ENV}/mar/inquiry/edit/${inquiry.INQ_ID}`
      );
    else
      window.location.replace(
        `${process.env.APP_ENV}/mar/inquiry/view/${inquiry.INQ_ID}`
      );
  } catch (error) {
    await utils.errorMessage(error);
    return;
  }
}

//012: Update and send to design
$(document).on("click", "#update-de", async function (e) {
  e.preventDefault();
  if ($("#status").val() >= 10) await updatePath({ level: 2, status: 3 });
  else await updatePath({ level: 1, status: 2 });
});

//013: Update and send to AS400
$(document).on("click", "#update-bm", async function (e) {
  e.preventDefault();
  await updatePath({ level: 2, status: 30 });
});

async function updatePath(opt) {
  const chkheader = await inqs.verifyHeader(".req-2");
  if (!chkheader) return;
  const header = await inqs.getFormHeader();
  const check_inq = await inqservice.getInquiry({ INQ_NO: header.INQ_NO });
  if (check_inq.length == 0) {
    await utils.showMessage(`Inquiry ${header.INQ_NO} is not found on System!`);
    $("#inquiry-no").focus().select();
    return;
  }

  const details = table.rows().data().toArray();
  try {
    const checkdetail = await inqs.verifyDetail(table, details, opt.level);
    await utils.showLoader({
      show: true,
      title: "Saving data",
      clsbox: `!bg-transparent`,
    });

    let deleteLine = [];
    if (deletedLineMap.size > 0) {
      deletedLineMap.forEach((value, key) => {
        deleteLine.push(key);
      });
    }

    let deleteFile = [];
    if (deletedFilesMap.size > 0) {
      deletedFilesMap.forEach((value, key) => {
        deleteFile.push(key);
      });
    }

    header.INQ_STATUS = opt.status;
    header.UPDATE_BY = $("#user-login").attr("empname");
    header.UPDATE_AT = new Date();

    const fomdata = {
      header,
      details,
      deleteLine,
      deleteFile,
    };
    const inquiry = await inqservice.updateInquiry(fomdata);
    if (selectedFilesMap.size > 0) {
      const attachment_form = new FormData();
      attachment_form.append("INQ_NO", inquiry.INQ_NO);
      selectedFilesMap.forEach((file, fileName) => {
        attachment_form.append("files", file, fileName);
      });
      await inqservice.createInquiryFile(attachment_form);
    }
    window.location.replace(
      `${process.env.APP_ENV}/mar/inquiry/view/${inquiry.INQ_ID}`
    );
  } catch (error) {
    await utils.errorMessage(error);
    return;
  }
}
