import * as utils from "../utils.js";
import { createTable } from "@public/_dataTable.js";
import {
  getControl,
  getShipments,
  getQuotationType,
  getDeliveryTerm,
} from "../service/master.js";

var table;
$(document).ready(async () => {
  try {
    await utils.initApp({ submenu: ".navmenu-admin" });
    const data = await getControl();
    const opt = await tableOpt(data);
    table = await createTable(opt);
  } catch (error) {
    console.log(error);
    await utils.errorMessage(error);
  } finally {
    await utils.showLoader({ show: false });
  }
});

async function tableOpt(data) {
  const quotype = await getQuotationType();
  const shipments = await getShipments();
  const terms = await getDeliveryTerm();
  const opt = { ...utils.tableOpt };
  opt.order = [
    [1, "asc"],
    [0, "desc"],
  ];
  opt.data = data;
  opt.dom = `<"flex items-center mb-3"<"table-search flex flex-1 gap-5"f><"flex items-center table-option">><"bg-white border border-slate-300 rounded-2xl overflow-hidden overflow-x-auto"t><"flex my-5"<"table-page flex-1"p><"table-info flex  flex-none gap-5"i>>`;
  opt.columns = [
    {
      data: "CNT_PREFIX",
      title: "Inquiry Prefix",
    },
    {
      data: "CNT_AGENT",
      title: "Agent",
    },
    { data: "CNT_TRADER", title: "Trader" },
    {
      data: "CNT_QUOTATION",
      title: "Quotation Type",
      render: (data) => {
        const quotation = quotype.find((item) => item.QUOTYPE_ID == data);
        return quotation.QUOTYPE_DESC;
      },
    },
    {
      data: "CNT_TERM",
      title: "Delivery Term",
      render: (data) => {
        const term = terms.find((item) => item.TERM_ID == data);
        return term.TERM_DESC;
      },
    },
    {
      data: "CNT_METHOD",
      title: "Delivery Method",
      render: (data) => {
        const shipment = shipments.find((item) => item.SHIPMENT_ID == data);
        return shipment.SHIPMENT_DESC;
      },
    },
    {
      data: "CNT_WEIGHT",
      title: "Weight",
      className: "text-center",
      render: (data) => {
        return data == 1
          ? `<i class="fi fi-rr-check-circle text-xl text-success"></i>`
          : "";
      },
    },
    {
      data: "CNT_PREFIX",
      className: "hidden",
      title: `<div class="flex justify-center"><i class='fi fi-br-settings-sliders text-lg'></i></div>`,
      render: function (data, type, row) {
        return `
        <div class="flex items-center justify-center gap-2">
            <button class="btn btn-sm btn-ghost btn-circle save-row ${
              row.isNew === undefined ? "hidden" : ""
            }"><i class="fi fi-sr-disk text-lg"></i></button>

            <button class="btn btn-sm btn-ghost btn-circle edit-row ${
              row.isNew !== undefined || row.CURR_LATEST == 0 ? "hidden" : ""
            }"><i class="fi fi-rr-customize text-lg"></i></button>
        </div>`;
      },
    },
  ];
  return opt;
}
