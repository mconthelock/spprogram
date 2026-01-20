import "datatables.net-responsive-dt/css/responsive.dataTables.min.css";
import "@amec/webasset/css/select2.min.css";
import "@amec/webasset/css/dataTable.min.css";

import { createTable } from "@amec/webasset/dataTable";
import { setDatePicker } from "@amec/webasset/flatpickr";
import * as inqservice from "../service/inquiry.js";
import * as utils from "../utils.js";
import * as inqs from "../inquiry/detail.js";
import * as tb from "../inquiry/table.js";
import * as tbmar from "../inquiry/table_de.js";

var table;
$(async function () {
	try {
		await utils.initApp();

		let logs, inquiry, details, file;
		inquiry = await inqservice.getInquiryID($("#inquiry-id").val());
		if (inquiry.INQ_STATUS >= 30)
			inquiry.INQ_REV = utils.revision_code(inquiry.INQ_REV);

		const cards = await inqs.setupCard(inquiry);

		details = inquiry.details.filter((dt) => dt.INQD_LATEST == "1");
		const tableContainer = await tbmar.setupTableDetail(details);
		table = await createTable(tableContainer);
	} catch (error) {
		console.log(error);
	} finally {
		await showLoader({ show: false });
	}
});
