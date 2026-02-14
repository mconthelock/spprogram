import "@amec/webasset/css/dataTable.min.css";

import { showLoader } from "@amec/webasset/preloader";
import { showMessage } from "@amec/webasset/utils";
import { createTable } from "@amec/webasset/dataTable";
import { activatedBtn } from "@amec/webasset/components/buttons";
import { tableInquiryPKCOption } from "../inquiry/index.js";
import { getTemplate, exportExcel } from "../service/excel";
import { getInquiry, dataExports, dataDetails } from "../service/inquiry.js";
import { initApp } from "../utils.js";

var table;
$(async function () {
	try {
		await showLoader();
		await initApp();
		const data = await getInquiry({
			INQ_STATUS: "< 80",
			INQ_PKC_REQ: "1",
			IS_TIMELINE: 1,
			timeline: {
				PKC_CONFIRM: "IS NULL",
			},
		});
		const opt = await tableInquiryPKCOption(data);
		table = await createTable(opt);
	} catch (error) {
		console.log(error);
		await showMessage(error);
	} finally {
		await showLoader({ show: false });
	}
});
