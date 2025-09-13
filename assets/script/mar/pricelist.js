import "datatables.net-responsive-dt/css/responsive.dataTables.min.css";
import "@styles/select2.min.css";
import "@styles/datatable.min.css";
import moment from "moment";
import ExcelJS from "exceljs";

import { createTable } from "@public/_dataTable.js";
import { showbgLoader } from "@public/preloader";
import { statusColors } from "../inquiry/detail.js";
import * as service from "../service/pricelist.js";
import * as cus from "../service/customers.js";
import * as utils from "../utils.js";
var table;

$(async function () {
  try {
    await utils.initApp({ submenu: ".navmenu-price" });
    const customers = await cus.getCustomer();
    const selected = $("#selected-customer").val();
    const customer = customers.find((cus) => cus.CUS_ID == selected);
    $("#page-title").html(`Price List for ${customer.CUS_DISPLAY}`);

    const pricelistdata = await service.getPriceList();
    const tbopt = await tableOpt(pricelistdata, customers, selected);
    table = await createTable(tbopt);
  } catch (error) {
    console.log(error);
    await utils.errorMessage(error);
  } finally {
    await utils.showLoader({ show: false });
  }
});

async function tableOpt(data, customers, selected) {
  const opt = utils.tableOpt;
  opt.data = data;
  opt.columns = [
    { data: "ITEM" },
    { data: "FCCOST" },
    { data: "FCBASE" },
    { data: "TCCOST" },
    { data: null, render: () => "1" },
    { data: null, render: () => "2" },
    { data: null, render: () => "3" },
  ];
  opt.initComplete = function (settings, json) {
    let option = ``;
    customers.map((el) => {
      option += `<option value="${el.CUS_ID}" ${
        el.CUS_ID == selected ? "selected" : ""
      }>${el.CUS_DISPLAY}</option>`;
    });
    $(".table-option").append(
      `<select class="select">
            ${option}
        </select>`
    );
    $(".table-paging").append(`<div class="flex gap-2">
        <button class="btn btn-accent rounded-3xl text-white items-center" id="export-detail" type="button">
            <span class="loading loading-spinner hidden"></span>
            <span class="flex items-center"><i class="fi fi-tr-file-excel text-lg me-2"></i>Export Data</span>
        </button>
    </div>`);
    $(".table-paging").addClass("flex-col gap-3");
  };
  return opt;
}
