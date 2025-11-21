import "datatables.net-responsive-dt/css/responsive.dataTables.min.css";
import "@styles/select2.min.css";
import "@styles/datatable.min.css";
import { createTable } from "@public/_dataTable.js";
import { statusColors } from "../inquiry/detail.js";
import { tableInquiry, confirmDeleteInquiry } from "../inquiry/table.js";
import * as utils from "../utils.js";
import * as service from "../service/inquiry.js";
import dayjs from "dayjs";
$(async function () {
  try {
    await utils.initApp();
    let data;
    data = await service.getInquiry({ LE_INQ_STATUS: 45 });

    const opt = await tableOptions(data);
    const table = await createTable(opt);
  } catch (error) {
    console.log(error);
    await utils.errorMessage(error);
  } finally {
    await utils.showLoader({ show: false });
  }
});

async function tableOptions(data) {
  const colors = await statusColors();
  const opt = await tableInquiry(data);
  opt.columns = [
    { data: "timeline.MAR_SEND", className: "hidden" },
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
      data: "timeline.MAR_SEND",
      className: "",
      title: "MAR. Sent Date",
      render: (data) => {
        return dayjs(data).format("YYYY-MM-DD HH:mm:ss");
      },
    },
    {
      data: "timeline.MAR_SEND",
      className: "",
      title: "B/M Date",
      render: (data) => {
        return dayjs(data).format("YYYY-MM-DD HH:mm:ss");
      },
    },
    {
      data: "timeline.MAR_SEND",
      className: "",
      title: "Note",
      render: (data) => {
        return `<textarea class="!h-[52px] border border-slate-300 rounded-sm min-w-[200px]" rows="1"></textarea>`;
      },
    },
    {
      data: "INQ_ID",
      sortable: false,
      className: "text-center",
      title: `<div class="text-xl flex justify-center"><i class="fi fi-rr-settings-sliders"></i></div>`,
      render: (data) => {
        return `<a class="btn btn-sm btn-primary text-white" href="${process.env.APP_ENV}/fin/inquiry/detail/${data}">Process</a>`;
      },
    },
  ];
  return opt;
}
