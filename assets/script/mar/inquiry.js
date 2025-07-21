import "datatables.net-responsive-dt/css/responsive.dataTables.min.css";
import "@styles/select2.min.css";
import { createTable } from "@public/_dataTable.js";
var table;
$(document).ready(async () => {
  $(".mainmenu").find("details").attr("open", false);
  $(".mainmenu.nav-inquiry").find("details").attr("open", true);
  const data = [];
  const opt = await tableOpt(data);
  table = await createTable(opt);
});

function tableOpt(data) {
  const opt = {};
  opt.data = data;
  opt.dom = `<"flex items-center mb-3"<"table-search flex flex-1 gap-5"f><"flex items-center table-option"l>><"bg-white border border-slate-300 rounded-2xl overflow-hidden overflow-x-scroll"t><"flex mt-5"<"table-info flex  flex-1 gap-5"i><"table-page flex-none"p>>`;
  opt.columns = [
    {
      data: "INQ_DATE",
      className: "text-center text-nowrap sticky-column",
      title: `<div class="text-center text-white">Inq. Date</div>`,
    },
    {
      data: "INQ_NO",
      className: "text-nowrap sticky-column",
      title: `<div class="text-center text-white">No.</div>`,
    },
    {
      data: "INQ_STATUS",
      title: `<div class="text-center text-white">Status</div>`,
    },
    {
      data: "INQ_STATUS",
      title: `<div class="text-center text-white">Incharge</div>`,
    },
    { data: null, title: `<div class="text-center text-white">EME</div>` },
    { data: null, title: `<div class="text-center text-white">EEL</div>` },
    { data: null, title: `<div class="text-center text-white">EAP</div>` },
    { data: null, title: `<div class="text-center text-white">ESO</div>` },
    {
      data: "INQD_ID",
      sortable: false,
      title: `<div class="text-center"><i class='icofont-settings text-lg text-white'></i></div>`,
    },
  ];
  opt.initComplete = function (settings, json) {
    $(".table-option").append(`<div class="flex gap-2">
        <a class="btn btn-primary btn-square" href="${process.env.APP_ENV}/mar/inquiry/create/"><i class="icofont-plus text-xl text-white"></i></a>
        </div>`);
    $(".table-info").append(`<div class="flex gap-2">
        <button class="btn btn-primary rounded-3xl text-white transition delay-100 duration-300 ease-in-out hover:scale-110 items-center"
            type="button">
            <span class="loading loading-spinner hidden"></span>
            <span class=""><i class="icofont-spreadsheet text-lg me-2"></i>Export Detail</span>
        </button>

         <button class="btn btn-neutral rounded-3xl text-white transition delay-100 duration-300 ease-in-out hover:scale-110 items-center"
            type="button">
            <span class="loading loading-spinner hidden"></span>
            <span class=""><i class="icofont-spreadsheet text-lg me-2"></i>Export list</span>
        </button>
    </div>`);
  };
  return opt;
}
