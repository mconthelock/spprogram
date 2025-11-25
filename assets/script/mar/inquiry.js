import "datatables.net-responsive-dt/css/responsive.dataTables.min.css";
import "@styles/select2.min.css";
import "@styles/datatable.min.css";

import dayjs from "dayjs";
import { createTable } from "@public/_dataTable.js";
import { statusColors } from "../inquiry/ui.js";
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

async function tableInquiryOption(data) {
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
      data: "inqgroup",
      title: "EME",
      className: "text-center px-[5px] w-[45px] max-w-[45px]",
      sortable: false,
      render: (data) => {
        const des = data.filter(
          (item) => item.INQG_GROUP === 1 && item.INQG_LATEST === 1
        );
        if (des.length == 0) return "";

        const color =
          des[0].INQG_STATUS == null
            ? "text-gray-500"
            : des[0].INQG_STATUS >= 9
            ? "text-primary"
            : "text-secondary";
        return `<i class="fi fi-rr-check-circle text-xl justify-center ${color}"></i>`;
      },
    },
    {
      data: "inqgroup",
      title: "EEL",
      className: "text-center px-[5px] w-[45px] max-w-[45px]",
      sortable: false,
      render: (data) => {
        const des = data.filter(
          (item) => item.INQG_GROUP === 2 && item.INQG_LATEST === 1
        );
        if (des.length == 0) return "";

        const color =
          des[0].INQG_STATUS == null
            ? "text-gray-500"
            : des[0].INQG_STATUS >= 9
            ? "text-primary"
            : "text-secondary";
        return `<i class="fi fi-rr-check-circle text-xl justify-center ${color}"></i>`;
      },
    },
    {
      data: "inqgroup",
      title: "EAP",
      className: "text-center px-[5px] w-[45px] max-w-[45px]",
      sortable: false,
      render: (data) => {
        const des = data.filter(
          (item) => item.INQG_GROUP === 3 && item.INQG_LATEST === 1
        );
        if (des.length == 0) return "";

        const color =
          des[0].INQG_STATUS == null
            ? "text-gray-500"
            : des[0].INQG_STATUS >= 9
            ? "text-primary"
            : "text-secondary";
        return `<i class="fi fi-rr-check-circle text-xl justify-center ${color}"></i>`;
      },
    },
    {
      data: "inqgroup",
      title: "ESO",
      className: "text-center px-[5px] w-[45px] max-w-[45px]",
      sortable: false,
      render: (data) => {
        const des = data.filter(
          (item) => item.INQG_GROUP === 6 && item.INQG_LATEST === 1
        );
        if (des.length == 0) return "";

        const color =
          des[0].INQG_STATUS == null
            ? "text-gray-500"
            : des[0].INQG_STATUS >= 9
            ? "text-primary"
            : "text-secondary";
        return `<i class="fi fi-rr-check-circle text-xl justify-center ${color}"></i>`;
      },
    },
    {
      data: "INQ_ID",
      className: "w-fit !max-w-[110px] !justify-center",
      sortable: false,
      title: `<div class="flex justify-center"><i class="fi fi-rr-settings-sliders text-lg"></i></div>`,
      render: (data, type, row) => {
        const viewurl =
          row.INQ_TYPE == "SP"
            ? `${process.env.APP_ENV}/mar/inquiry/view/${data}`
            : `${process.env.APP_ENV}/mar/quotation/viewinq/${data}`;
        const view = `<a class="btn btn-xs btn-neutral btn-outline" href="${viewurl}">View</a>`;

        const edit = `<a class="btn btn-xs btn-neutral ${
          row.INQ_TYPE == "SP" ? "" : "btn-disabled"
        }" href="${process.env.APP_ENV}/mar/inquiry/edit/${data}">Edit</a>`;
        const deleteBtn = `<button class="btn btn-xs btn-ghost btn-circle text-red-500 hover:text-red-800 delete-inquiry" data-id="${data}" data-type="inquiry" onclick="confirm_box.showModal()"><i class="fi fi-br-trash text-2xl"></i></button>`;
        return `<div class="flex gap-1 justify-center items-center w-fit">${view}${edit}${deleteBtn}</div>`;
      },
    },
  ];

  opt.createdRow = function (row, data, dataIndex) {
    if ([4, 27].includes(data.INQ_STATUS)) {
      $(row).addClass("!bg-sky-200");
    }
  };

  opt.initComplete = async function () {
    const newinq = await utils.creatBtn({
      id: "add-new-inquiry",
      type: "link",
      href: `${process.env.APP_ENV}/mar/inquiry/create`,
      title: "New Inquiry",
      icon: "fi fi-tr-file-excel text-xl ",
      className: `btn-outline btn-primary text-primary hover:shadow-lg  hover:text-white`,
    });
    const export1 = await utils.creatBtn({
      id: "export1",
      title: "Export Inquiry",
      icon: "fi fi-tr-file-excel text-xl",
      className: `btn-accent text-white hover:shadow-lg`,
    });
    const export2 = await utils.creatBtn({
      id: "export1",
      title: "Export (With Detail)",
      icon: "fi fi-rr-layers text-xl",
      className: `btn-neutral text-white hover:shadow-lg`,
    });

    $(".table-option").append(`${newinq}`);
    $(".table-info").append(
      `<div class="flex gap-2">${export1}${export2}</div>`
    );
  };
  return opt;
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
