import "datatables.net-responsive-dt/css/responsive.dataTables.min.css";
import "@styles/select2.min.css";
import "@styles/datatable.min.css";

import { createTable } from "@public/_dataTable.js";
import { tableInquiry, confirmDeleteInquiry } from "../inquiry/table.js";
import { getInquiry } from "../service/inquiry.js";
import * as utils from "../utils.js";
var table;
$(async function () {
  try {
    await utils.initApp({ submenu: ".navmenu-newinq" });
    let data = await getInquiry({ INQ_STATUS: "< 80" });
    if ($("#pageid").val() == "2") {
      data = data.filter((d) => {
        const isAmec = d.details.some((dt) => {
          if (dt.INQD_SUPPLIER == null) return false;
          return dt.INQD_SUPPLIER.toUpperCase().includes("AMEC");
        });
        return isAmec && d.INQ_STATUS >= 28 && d.timeline.BM_CONFIRM == null;
      });
    }
    const opt = await tableInquiryOption(data);
    table = await createTable(opt);
  } catch (error) {
    console.log(error);
    await utils.errorMessage(error);
  } finally {
    await utils.showLoader({ show: false });
  }
});

async function tableInquiryOption(table) {
  const opt = tableInquiry;
}

// $(document).on(
//   "click",
//   "#confirm_accept.deleteinqs:not(disabled)",
//   async function (e) {
//     e.preventDefault();
//     await confirmDeleteInquiry(table);
//   }
// );

// $(document).on("click", "#export-list", async function (e) {
//   e.preventDefault();
// });
