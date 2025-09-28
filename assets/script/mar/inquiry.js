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
        "timeline.ISNULL_BM_CONFIRM": null,
        GE_INQ_STATUS: 30,
        needDetail: true,
      });

      //filter status = 97, 98 (Closed, Cancel)
      data = data.filter(
        (d) =>
          d.status.STATUS_ID != 50 && //Other Supplier
          d.status.STATUS_ID != 97 && //Cancelled
          d.status.STATUS_ID != 98 //Unable Issue Quotation
      );

      //filter data that detail not contain 'AMEC'
      data = data.filter((d) => {
        const details = d.details.filter((dt) => dt.INQD_LATEST == 1);
        const haveAmec = details.find((dt) => {
          if (dt.INQD_SUPPLIER == null) return false;
          return dt.INQD_SUPPLIER.toUpperCase().includes("AMEC");
        });
        return haveAmec !== undefined;
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
