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
} from "../service/index.js";
import { initApp } from "../utils.js";

var table;
$(async function () {
	try {
		await showLoader();
		const app = await initApp({ submenu: ".navmenu-newinq" });
		if (!app) return;
		let data = await getInquiry({
			INQ_DATE: `>= ${dayjs().add(-60, "day").format("YYYY-MM-DD")}`,
			IS_GROUP: 1,
			// IS_QUOTATION: 1,
			// quotation: {
			// 	QUO_VALIDITY: ">= 2026-01-13",
			// },
		});

		data = data.map((el) => {
			el.priority = [4, 27].includes(el.INQ_STATUS) ? 100 : 0;
			return el;
		});
		const opt = await tableInquiryAdminOption(data, { new: true });
		table = await createTable(opt);
	} catch (error) {
		console.log(error);
		await showMessage(error);
	} finally {
		await showLoader({ show: false });
	}
});

$(document).on("click", ".process-btn", async function (e) {
	e.preventDefault();
	try {
		await showLoader();
		const row = table.row($(this).closest("tr")).data();
		const id = row.INQ_ID;
		const data = await getInquiry({
			INQ_ID: id,
			IS_DETAILS: true,
		});
		await setAS400Data(data[0]);
	} catch (error) {
		console.log(error);
		await showMessage(`Something went wrong.`);
	} finally {
		await showLoader({ show: false });
	}
});
