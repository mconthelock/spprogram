import "@amec/webasset/css/dataTable.min.css";
import * as dayjs from "dayjs";
import { showLoader } from "@amec/webasset/preloader";
import { showMessage, showConfirm } from "@amec/webasset/utils";
import { createTable } from "@amec/webasset/dataTable";
import { activatedBtn } from "@amec/webasset/components/buttons";
import { tableInquiryAdminOption, setAS400Data } from "../inquiry/index.js";
import {
	getTemplate,
	exportExcel,
	getInquiry,
	dataExports,
	dataDetails,
	deleteInquiry,
	getItems,
	currentPeriod,
	createInquiry,
} from "../service/index.js";
import { initApp } from "../utils.js";

var table;
$(async function () {
	try {
		await showLoader();
		const app = await initApp({ submenu: ".navmenu-newinq" });
		if (!app) return;
		let data = await getInquiry({
			INQ_DATE: `>= ${dayjs().add(-250, "day").format("YYYY-MM-DD")}`,
			IS_GROUP: 1,
		});

		data = data.filter(
			(el) => el.INQ_TYPE == "Price" || el.INQ_TYPE == "Cost",
		);
		const opt = await tableInquiryAdminOption(data, { new: true });
		table = await createTable(opt);
	} catch (error) {
		console.log(error);
		await showMessage(error);
	} finally {
		await showLoader({ show: false });
	}
});

$(document).on("click", ".create-simulate", async function (e) {
	e.preventDefault();
	try {
		await showLoader({ show: true });
		const type = $(this).data("id");

		let data = await getItems();
		data = data.filter((item) => item.ITEM_STATUS == 1);
		if (type == 1) data = data.filter((item) => item.CATEGORY != 99);
		else data = data.filter((item) => item.CATEGORY == 99);
		if (type == 1) await setPriceDetails(data);
		else await setCostDetails(data);
		window.location.reload();
	} catch (error) {
		console.log(error);
		await showMessage(error);
		await showLoader({ show: false });
	}
});

async function setHeader() {
	return {
		INQ_REV: `*`,
		INQ_STATUS: 30,
		INQ_DATE: dayjs().format("YYYY-MM-DD"),
		INQ_TRADER: "Direct",
		INQ_PRJNO: `PL-SIMULATE`,
		INQ_PRJNAME: `Price list simulation`,
		INQ_PRDSCH: `201501Z`,
		INQ_SPEC: `P1050-CO-120-10S/O`,
		INQ_QUOTATION_TYPE: 5,
		INQ_DELIVERY_TERM: 1,
		INQ_DELIVERY_METHOD: 1,
		INQ_SHIPMENT: "1",
		INQ_MAR_PIC: "16077",
		INQ_MAR_SENT: dayjs().format("YYYY-MM-DD HH:mm:ss"),
		CREATE_AT: dayjs().format("YYYY-MM-DD HH:mm:ss"),
		UPDATE_AT: dayjs().format("YYYY-MM-DD HH:mm:ss"),
		CREATE_BY: $("#user-login").attr("empno"),
		INQ_CUR: "THB",
		INQ_TCCUR: "THB",
		INQ_LATEST: 1,
	};
}

async function setDetails(data) {
	const rows = [];
	let detail = [];
	let runno = 0;
	data.map((item, index) => {
		if (index > 0 && index % 500 == 0) {
			rows.push(detail);
			detail = [];
			runno = 0;
		}
		const val = {
			INQD_SEQ: runno + 1,
			INQD_RUNNO: runno + 1,
			INQD_MFGORDER: `STOCK`,
			INQD_CAR: "99",
			INQD_ITEM: item.ITEM_NO,
			INQD_PARTNAME: item.ITEM_NAME,
			INQD_DRAWING: item.ITEM_DWG,
			INQD_VARIABLE: item.ITEM_VARIABLE,
			INQD_QTY: 1,
			INQD_UM: item.ITEM_UNIT,
			INQD_SUPPLIER: item.ITEM_SUPPLIER,
			INQD_FC_COST: 0,
			INQD_TC_COST: 0,
			INQD_UNIT_PRICE: 0,
			INQD_FC_BASE: 1.3,
			INQD_TC_BASE: 0,
			INQD_LATEST: 1,
			INQD_OWNER: "MAR",
			CREATE_AT: dayjs().format("YYYY-MM-DD HH:mm:ss"),
			INQD_OWNER_GROUP: "MAR",
			ITEMID: item.ITEM_ID,
		};
		detail.push(val);
		runno++;
	});
	rows.push(detail);
	return rows;
}

async function setCostDetails(data) {
	let timelinedata = {
		INQ_REV: "*",
		MAR_USER: "16077",
		MAR_SEND: dayjs().format("YYYY-MM-DD HH:mm:ss"),
	};
	data = data.sort((a, b) => a.ITEM_NO.localeCompare(b.ITEM_NO));
	const header = await setHeader();
	const details = await setDetails(data);
	let inqid = 1;
	for (const row of details) {
		if (row.length == 0) continue;

		const inqno = `COST-${dayjs().format("YYYY-MM-DD")}`;
		const fomdata = {
			header: {
				...header,
				INQ_NO: inqno,
				INQ_TYPE: "Cost",
				INQ_SERIES: "GPSXL",
			},
			details: row,
			timelinedata: { ...timelinedata, INQ_NO: inqno },
		};
		const inquiry = await createInquiry(fomdata);
		await setAS400Data(inquiry);
		inqid++;
	}
}

async function setPriceDetails(data) {
	let timelinedata = {
		INQ_REV: "*",
		MAR_USER: "16077",
		MAR_SEND: dayjs().format("YYYY-MM-DD HH:mm:ss"),
	};
	const period = await currentPeriod();
	const dept = [
		{ id: "EME", code: [1] },
		{ id: "EEL", code: [2, 5] },
		{ id: "EAP", code: [3] },
		{ id: "ESO", code: [6, 7, 8, 9] },
	];

	for (const d of dept) {
		const result = data
			.filter((item) => d.code.includes(Math.floor(item.ITEM_NO / 100)))
			.sort((a, b) => a.ITEM_NO.localeCompare(b.ITEM_NO));
		const header = await setHeader();
		const details = await setDetails(result);
		let inqid = 1;
		for (const row of details) {
			if (row.length == 0) continue;

			const inqno = `${d.id}-${period.current.year}-${period.current.period}H-${inqid}`;
			const fomdata = {
				header: {
					...header,
					INQ_NO: inqno,
					INQ_TYPE: type == 1 ? "Price" : "Cost",
					INQ_SERIES: d.id == "ESO" ? "JSWZ" : "GPSXL",
				},
				details: row,
				timelinedata: { ...timelinedata, INQ_NO: inqno },
			};
			const inquiry = await createInquiry(fomdata);
			await setAS400Data(inquiry);
			inqid++;
		}
	}
}
