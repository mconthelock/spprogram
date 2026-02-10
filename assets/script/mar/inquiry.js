import "@amec/webasset/css/dataTable.min.css";

import { showLoader } from "@amec/webasset/preloader";
import { showMessage } from "@amec/webasset/utils";
import { createTable } from "@amec/webasset/dataTable";
import { activatedBtn } from "@amec/webasset/components/buttons";
import { tableInquiryOption } from "../inquiry/index.js";
import { getTemplate, exportExcel } from "../service/excel";
import { getInquiry, dataExports, dataDetails } from "../service/inquiry.js";
import { initApp } from "../utils.js";

var table;
$(async function () {
	try {
		await initApp({ submenu: ".navmenu-newinq" });
		let data;
		if ($("#pageid").val() == "2") {
			data = await getInquiry({
				INQ_STATUS: "< 80",
				IS_GROUP: 1,
				IS_DETAILS: 1,
				IS_TIMELINE: 1,
			});
			data = await prebmdata(data);
		} else {
			data = await getInquiry({
				INQ_STATUS: "< 80",
				IS_GROUP: 1,
			});
		}
		data = data.map((el) => {
			el.priority = [4, 27].includes(el.INQ_STATUS) ? 100 : 0;
			return el;
		});
		const opt = await tableInquiryOption(data, { new: true });
		table = await createTable(opt);
	} catch (error) {
		console.log(error);
		await showMessage(error);
	} finally {
		await showLoader({ show: false });
	}
});

async function prebmdata(data) {
	data = data.filter((d) => {
		const isAmec = d.details.some((dt) => {
			if (dt.INQD_SUPPLIER == null) return false;
			return dt.INQD_SUPPLIER.toUpperCase().includes("AMEC");
		});
		return isAmec && d.INQ_STATUS >= 28 && d.timeline.BM_CONFIRM == null;
	});
	return data;
}

$(document).on("click", "#export1", async function (e) {
	e.preventDefault();
	try {
		await activatedBtn($(this));
		const q = {};
		const query = {
			...q,
			INQ_STATUS: "< 80",
			IS_DETAILS: true,
			IS_ORDERS: true,
			IS_TIMELINE: true,
			IS_FIN: true,
		};
		const template = await getTemplate("export_inquiry_list.xlsx");
		let data = await getInquiry(query);
		if ($("#pageid").val() == "2") data = await prebmdata(data);
		const sortData = data.sort((a, b) => a.INQ_ID - b.INQ_ID);
		let result = await dataExports(sortData);
		await exportExcel(result, template, {
			filename: "Inquiry List.xlsx",
			rowstart: 3,
		});
	} catch (error) {
		console.log(error);
		await showMessage(`Something went wrong.`);
	} finally {
		await activatedBtn($(this), false);
	}
});

$(document).on("click", "#export2", async function (e) {
	e.preventDefault();
	try {
		await activatedBtn($(this));
		const q = {};
		const query = {
			...q,
			INQ_STATUS: "< 80",
			IS_DETAILS: true,
			IS_ORDERS: true,
			IS_TIMELINE: true,
		};
		let data = await getInquiry(query);
		if ($("#pageid").val() == "2") data = await prebmdata(data);
		const result = await dataDetails(data);
		const template = await getTemplate("export_inquiry_list_detail.xlsx");
		await exportExcel(result, template, {
			filename: "Inquiry Detail List.xlsx",
			rowstart: 3,
		});
	} catch (error) {
		console.log(error);
		await showMessage(`Something went wrong.`);
	} finally {
		await activatedBtn($(this), false);
	}
});
