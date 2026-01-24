import "datatables.net-responsive-dt/css/responsive.dataTables.min.css";
import "@amec/webasset/css/dataTable.min.css";
import "@amec/webasset/css/select2.min.css";
import select2 from "select2";

import { setDatePicker } from "@amec/webasset/flatpickr";
import * as rpt from "../inquiry/report.js";
import { createTable } from "@amec/webasset/dataTable";
import { statusColors } from "../inquiry/detail.js";
import { tableInquiry, confirmDeleteInquiry } from "../inquiry/table.js";
import * as utils from "../utils.js";
import * as service from "../service/inquiry.js";
import dayjs from "dayjs";
var table;
$(async function () {
	try {
		await utils.initApp();
		await setDatePicker();
		await rpt.setTrader();
		await rpt.setAgent();
		await rpt.setCountry();
		await rpt.setStatus();
		await rpt.setSeries();
		await rpt.setOrderType();
		await rpt.setButton();
		// const mst = await init;
		// const traders = await mst.getTraders();
		$(".select").select2({});
		$("#form-container").removeClass("hidden");
		// const data = await service.getInquiry({ INQ_STATUS: ">= 30 && < 43" });
		// const opt = await tableOptions(data);
		// table = await createTable(opt);
	} catch (error) {
		console.log(error);
		await showErrorMessage(`Something went wrong.`, "2036");
	} finally {
		await showLoader({ show: false });
	}
});
