import "@amec/webasset/css/dataTable.min.css";

import { showLoader } from "@amec/webasset/preloader";
import { showMessage, intVal } from "@amec/webasset/utils";
import { createTable } from "@amec/webasset/dataTable";
import { activatedBtn } from "@amec/webasset/components/buttons";
import { tableInquiryFinOption } from "../inquiry/index.js";
import { getTemplate, exportExcel } from "../service/excel";
import {
	getInquiry,
	updateInquiryHeader,
	dataExports,
	dataDetails,
} from "../service/inquiry.js";
import { initApp } from "../utils.js";

var table;
$(async function () {
	try {
		await showLoader({ show: true });
		await initApp();
		const pageid = intVal($("#pageid").val()) || 1;
		const q = { INQ_STATUS: ">= 30 && < 46", INQ_TYPE: "SP" };
		let data = await getInquiry(q);
		const opt = await tableInquiryFinOption(data);
		table = await createTable(opt);
	} catch (error) {
		console.log(error);
		await showMessage(`Something went wrong.`);
	} finally {
		await showLoader({ show: false });
	}
});

$(document).on("change", ".quick-remark", async function (e) {
	e.preventDefault();
	if ($(this).val() == "") return;
	const data = table.row($(this).closest("tr")).data();
	const remark = $(this).val();
	const load = $(this).siblings(".quick-remark-load");
	try {
		load.removeClass("hidden");
		await updateInquiryHeader(
			{
				INQ_FIN_REMARK: remark,
				INQ_LATEST: 1,
			},
			data.INQ_ID,
		);
	} catch (error) {
		console.log(error);
		await showMessage(`Something went wrong.`);
	} finally {
		load.addClass("hidden");
	}
});
