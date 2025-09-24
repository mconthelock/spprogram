import "datatables.net-responsive-dt/css/responsive.dataTables.min.css";
import "@styles/select2.min.css";
import "@styles/datatable.min.css";
import moment from "moment";

import { createTable } from "@public/_dataTable.js";
import { tableInquiry, confirmDeleteInquiry } from "../inquiry/table.js";
import * as service from "../service/inquiry.js";
import * as utils from "../utils.js";
var table;
$(async function () {
  try {
    await utils.initApp({ submenu: ".navmenu-newinq" });
    let data;
    if ($("#prebm").val() == "1") {
      data = await service.getInquiry({
        "timeline.ISNULL_BM_COFIRM": null,
      });
    } else {
      data = await service.getInquiry({ LE_INQ_STATUS: 45 });
    }

    const opt = await tableInquiry(data);
    table = await createTable(opt);
  } catch (error) {
    console.log(error);
    await utils.errorMessage(error);
  } finally {
    await utils.showLoader({ show: false });
  }
});

$(document).on(
  "click",
  "#confirm_accept.deleteinqs:not(disabled)",
  async function (e) {
    e.preventDefault();
    await confirmDeleteInquiry(table);
  }
);

$(document).on("click", "#export-list", async function (e) {
  e.preventDefault();
});
