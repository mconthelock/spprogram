import "datatables.net-responsive-dt/css/responsive.dataTables.min.css";
import "@styles/select2.min.css";
import "@styles/datatable.min.css";

import dayjs from "dayjs";
import { createTable } from "@public/_dataTable.js";
import { statusColors } from "../inquiry/ui.js";
import { getInquiry } from "../service/inquiry.js";
import * as utils from "../utils.js";

// import { tableQuotation } from "../quotation/table.js";
// import * as service from "../service/inquiry.js";
var table;
$(document).ready(async () => {
  try {
    await utils.initApp({ submenu: ".navmenu-quotation" });
    let data;
    if ($("#pageid").val() == "3") {
      const validate = dayjs().format("YYYY-MM-DD");
      data = await getInquiry({
        INQ_STATUS: "> 50",
        quotation: { QUO_VALIDITY: `>= ${validate}` },
      });
    } else {
      data = await getInquiry({ INQ_STATUS: ">= 46 && < 80" });
    }
    const opt = await tableInquiryOption(data);
    table = await createTable(opt);
  } catch (error) {
    utils.errorMessage(error);
    return;
  } finally {
    await utils.showLoader({ show: false });
  }
});

async function tableInquiryOption(data) {
  const pageid = $("#pageid").val();
  const colors = await statusColors();
  const opt = { ...utils.tableOpt };
  opt.data = data;
  opt.columns = [
    { data: "UPDATE_AT", className: "hidden" },
    {
      data: "INQ_DATE",
      className: "text-center text-nowrap sticky-column",
      title: "Inq. Date",
      render: function (data, type, row, meta) {
        return dayjs(data).format("YYYY-MM-DD");
      },
    },
    {
      data: "INQ_NO",
      className: "text-nowrap sticky-column",
      title: "No.",
    },
    {
      data: "INQ_REV",
      className: "text-nowrap text-center sticky-column",
      title: "Rev.",
    },
    {
      data: "INQ_TRADER",
      className: "text-nowrap",
      title: "Trader",
    },
    { data: "INQ_AGENT", title: "Agent" },
    { data: "INQ_COUNTRY", title: "Country" },
    {
      data: "status",
      title: "Status",
      render: (data) => {
        if (data == null) return "";
        const statusColor = colors.find((item) => item.id >= data.STATUS_ID);
        return `<span class="badge text-xs ${statusColor.color}">${data.STATUS_DESC}</span>`;
      },
    },
    {
      data: "maruser",
      title: "MAR. In-Charge",
      render: (data) => {
        if (data == null) return "";
        const dsp = utils.displayname(data.SNAME);
        return `${dsp.fname} ${dsp.lname.substring(0, 1)}. (${data.SEMPNO})`;
      },
    },
    {
      data: "quotation",
      title: "Quo. Date",
      className: `text-center ${pageid == "3" ? "" : "hidden"}`,
      render: (data) => {
        if (data == null) return "";
        return dayjs(data.QUO_DATE).format("YYYY-MM-DD");
      },
    },
    {
      data: "quotation",
      title: "Expired Date",
      className: `text-center ${pageid == "3" ? "" : "hidden"}`,
      render: (data) => {
        if (data == null) return "";
        return dayjs(data.QUO_VALIDITY).format("YYYY-MM-DD");
      },
    },
    {
      data: "INQ_PKC_REQ",
      title: "Weight Req.",
      className: `text-center ${pageid == "3" ? "hidden" : ""}`,
      render: (data) => {
        if (data == "0") return "";
        return `<i class="fi fi-ts-check-circle text-primary text-xl"></i>`;
      },
    },
  ];
  return opt;
}
