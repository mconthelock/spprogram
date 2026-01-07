import "datatables.net-responsive-dt/css/responsive.dataTables.min.css";
import "@amec/webasset/css/select2.min.css";
import "@amec/webasset/css/dataTable.min.css";
import dayjs from "dayjs";
import { createTable } from "@amec/webasset/dataTable";
import { statusColors } from "../inquiry/detail.js";
import * as service from "../service/inquiry.js";
import * as utils from "../utils.js";
import { getDesignerGroup } from "./data.js";
var table;
$(async function () {
	try {
		await utils.initApp();
		let data = await service.getInquiry({
			GE_INQ_STATUS: 20,
			LE_INQ_STATUS: 29,
		});
		// filter data by designer group
		data = await filterData(data);
		const opt = await tableInquiry(data);
		table = await createTable(opt);
	} catch (error) {
		console.log(error);
	} finally {
		await utils.showLoader({ show: false });
	}
});

async function filterData(data) {
	const min = $("#minstatus").val();
	const max = $("#maxstatus").val();
	const des = await getDesignerGroup();
	data = data.filter((d) => {
		let chk = false;
		const groups = d.inqgroup.map((g) => {
			if (
				g.INQG_GROUP == des.DES_GROUP &&
				g.INQG_LATEST == 1 &&
				g.INQG_STATUS >= min &&
				g.INQG_STATUS <= max
			)
				chk = true;
			return chk;
		});
		return chk;
	});

	return data;
}

async function tableInquiry(data, options = {}) {
	const colors = await statusColors();
	const des = await getDesignerGroup();
	console.log(des.DES_GROUP);

	const opt = { ...utils.tableOpt };
	opt.data = data;
	opt.pageLength = 25;
	opt.order = [
		[0, "desc"],
		[1, "desc"],
	];
	opt.dom = `<"flex items-center mb-3"<"table-search flex flex-1 gap-5"f><"flex items-center table-option"l>><"bg-white border border-slate-300 rounded-2xl overflow-hidden"t><"flex mt-5 mb-3"<"table-info flex flex-col flex-1 gap-5"i><"table-page flex-none"p>>`;
	opt.columns = [
		{ data: "timeline.MAR_SEND", className: "hidden" },
		{
			data: "INQ_DATE",
			className: "text-center text-nowrap sticky-column",
			title: "Inq. Date",
			render: function (data, type, row, meta) {
				return moment(data).format("YYYY-MM-DD");
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
		{ data: "INQ_SERIES", title: "Series", className: "text-center" },
		{ data: "INQ_COUNTRY", title: "Country" },
		{
			data: "status",
			title: "Status",
			render: (data) => {
				if (data == null) return "";
				const statusColor = colors.find(
					(item) => item.id >= data.STATUS_ID
				);
				return `<span class="badge text-xs ${statusColor.color}">${data.STATUS_DESC}</span>`;
			},
		},
		{
			data: "maruser",
			title: "MAR. In-Charge",
			render: (data) => {
				if (data == null) return "";
				const dsp = utils.displayname(data.SNAME);
				return `${dsp.fname} ${dsp.lname.substring(0, 1)}. (${
					data.SEMPNO
				})`;
			},
		},
		{
			data: "inqgroup",
			title: "EME",
			visible: des.DES_GROUP != 6 ? true : false,
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
						: des[0].INQG_STATUS >= 26
						? "text-primary"
						: "text-secondary";
				return `<i class="fi fi-rr-check-circle text-xl justify-center ${color}"></i>`;
			},
		},
		{
			data: "inqgroup",
			title: "EEL",
			visible: des.DES_GROUP != 6 ? true : false,
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
						: des[0].INQG_STATUS >= 26
						? "text-primary"
						: "text-secondary";
				return `<i class="fi fi-rr-check-circle text-xl justify-center ${color}"></i>`;
			},
		},
		{
			data: "inqgroup",
			title: "EAP",
			visible: des.DES_GROUP != 6 ? true : false,
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
						: des[0].INQG_STATUS >= 26
						? "text-primary"
						: "text-secondary";
				return `<i class="fi fi-rr-check-circle text-xl justify-center ${color}"></i>`;
			},
		},
		{
			data: "inqgroup",
			title: "ESO",
			visible: des.DES_GROUP == 6 ? true : false,
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
						: des[0].INQG_STATUS >= 26
						? "text-primary"
						: "text-secondary";
				return `<i class="fi fi-rr-check-circle text-xl justify-center ${color}"></i>`;
			},
		},
		{
			data: "INQ_ID",
			className: "text-center w-fit max-w-[118px]",
			sortable: false,
			title: `<div class="flex justify-center"><i class="fi fi-rr-settings-sliders text-lg"></i></div>`,
			render: (data) => {
				return `<a class="btn btn-xs btn-neutral" href="${process.env.APP_ENV}/des/inquiry/detail/${data}">Process</a>`;
			},
		},
	];

	opt.initComplete = function () {
		const export1 = `<button class="btn btn-accent rounded-none text-white items-center hover:bg-accent/70" id="export-detail" type="button">
                <span class="loading loading-spinner hidden"></span>
                <span class="flex items-center"><i class="fi fi-tr-file-excel text-lg me-2"></i>Export Detail</span>
            </button>`;
		const export2 = `<button class="btn btn-neutral rounded-none text-white items-center hover:bg-neutral/70" id="export-list" type="button">
                <span class="loading loading-spinner hidden"></span>
                <span class="flex items-center"><i class="fi fi-tr-floor-layer text-lg me-2"></i>Export list</span>
            </button>`;
		const back = `<a href="#" class="btn btn-outline btn-neutral rounded-none text-neutral hover:text-white hover:bg-neutral/70 flex gap-3" id="back-report"><i class="fi fi-rr-arrow-circle-left text-xl"></i>Back</a>`;

		$(".table-info").append(`<div class="flex gap-2">
            ${export1}
            ${export2}
            ${options.backReportBtn !== undefined ? back : ""}
         </div>`);
	};
	return opt;
}
