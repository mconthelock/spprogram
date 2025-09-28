import "datatables.net-responsive-dt/css/responsive.dataTables.min.css";
import "@styles/select2.min.css";
import "@styles/datatable.min.css";
import moment from "moment";
import { createTable } from "@public/_dataTable.js";
import * as service from "../service/master.js";
import * as utils from "../utils.js";
import { get } from "jquery";
var table;

$(async function () {
  try {
    await utils.initApp();
    const users = await service.getAppUsers();
    const opt = await createUserTable(users);
    table = await createTable(opt);
    const designer = await getDesigner();
    console.log(users);
  } catch (error) {
    console.log(error);
  } finally {
    await utils.showLoader({ show: false });
  }
});

async function createUserTable(users = []) {
  const opt = { ...utils.tableOpt };
  opt.data = users;
  opt.pageLength = 25;
  opt.order = [[0, "desc"]];
  opt.dom = `<"flex items-center mb-3"<"table-search flex flex-1 gap-5"f><"flex items-center table-option"l>><"bg-white border border-slate-300 rounded-2xl overflow-hidden"t><"flex mt-5 mb-3"<"table-info flex flex-col flex-1 gap-5"i><"table-page flex-none"p>>`;
  opt.columns = [
    {
      data: "USERS_ID",
      className: "text-nowrap",
      title: "User ID",
    },
  ];

  return opt;
}

async function getDesigner() {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: `${process.env.APP_API}/sp/designer/all`,
      type: "GET",
      dataType: "json",
      success: function (response) {
        resolve(response);
      },
      error: function (error) {
        reject(error);
      },
    });
  });
}
