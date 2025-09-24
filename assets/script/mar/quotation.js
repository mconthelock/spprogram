import "datatables.net-responsive-dt/css/responsive.dataTables.min.css";
import "@styles/select2.min.css";
import "@styles/datatable.min.css";
import moment from "moment";

import { createTable } from "@public/_dataTable.js";
import { tableQuotation } from "../quotation/table.js";
import * as service from "../service/inquiry.js";
import * as utils from "../utils.js";
var table;
$(document).ready(async () => {
  try {
    await utils.initApp({ submenu: ".navmenu-quotation" });
    const data = await service.getInquiry({
      GE_INQ_STATUS: 46,
      LE_INQ_STATUS: 97,
    });
    const opt = await tableQuotation(data);
    table = await createTable(opt);
  } catch (error) {
    utils.errorMessage(error);
    return;
  } finally {
    await utils.showLoader({ show: false });
  }
});
