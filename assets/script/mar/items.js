import "datatables.net-responsive-dt/css/responsive.dataTables.min.css";
import "@styles/select2.min.css";
import "@styles/datatable.min.css";
import moment from "moment";
import ExcelJS from "exceljs";

import { createTable } from "@public/_dataTable.js";
import { showbgLoader } from "@public/preloader";
import { statusColors } from "../inquiry/detail.js";
import * as service from "../service/items.js";
import * as utils from "../utils.js";
var table;

$(async function () {
  try {
    await utils.initApp({ submenu: ".navmenu-price" });
    const data = await service.getItems();
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
  const opt = utils.tableOpt;
  opt.data = data;
  opt.columns = [
    { data: "ITEM_NO", title: "Item" },
    { data: "ITEM_NAME", title: "Part Name", className: "max-w-[175px]" },
    { data: "ITEM_DWG", title: "Drawing", className: "max-w-[175px]" },
    {
      data: "ITEM_VARIABLE",
      title: "Variable",
      className: "max-w-[175px] break-all",
    },
    // { data: "ITEM_TYPE", title: "Part Name" },
    { data: "ITEM_CLASS", title: "Class" },
    { data: "ITEM_UNIT", title: "Unit" },
    { data: "ITEM_SUPPLIER", title: "Supplier" },
    // { data: "CATEGORY", title: "Part Name" },
    { data: "ITEM_REMARK", title: "Remark" },
    { data: "ITEM_STATUS", title: "Status" },
  ];
  return opt;
}
