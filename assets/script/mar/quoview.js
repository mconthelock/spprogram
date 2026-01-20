import "datatables.net-responsive-dt/css/responsive.dataTables.min.css";
import "@amec/webasset/css/select2.min.css";
import "@amec/webasset/css/dataTable.min.css";
import dayjs from "dayjs";
import ExcelJS from "exceljs";
import { showLoader } from "@amec/webasset/preloader";
import { createTable } from "@amec/webasset/dataTable";
import * as utils from "../utils.js";
import * as inqs from "../inquiry/detail.js";
import * as tb from "../inquiry/table.js";
import * as tbquo from "../quotation/table_view.js";
import * as service from "../service/inquiry.js";
import * as cus from "../service/customers.js";
var table;
var tableAttach;

$(document).ready(async () => {
	try {
		const view =
			$("#view-type").val() == "inquiry" ? "newinq" : "quotation";
		await utils.initApp({ submenu: `.navmenu-${view}` });
		const inquiry = await service.getInquiryID($("#inquiry-id").val());
		if (inquiry.length == 0) throw new Error("Inquiry do not found");

		$("#inquiry-title").html(inquiry.INQ_NO);
		inquiry.QUO_DATE = moment(inquiry.quotation.QUO_DATE).format(
			"YYYY-MM-DD",
		);
		inquiry.QUO_VALIDITY = moment(inquiry.quotation.QUO_VALIDITY).format(
			"YYYY-MM-DD",
		);
		inquiry.QUO_NOTE =
			inquiry.quotation.QUO_NOTE == null
				? ""
				: inquiry.quotation.QUO_NOTE.replace(/\n/g, "<br>");
		const customers = await cus.getCustomer();
		const customer = customers.find(
			(c) => c.CUS_ID == inquiry.INQ_CUSTOMER,
		);
		inquiry.QUO_CUSTOMER = customer == undefined ? "" : customer.CUS_NAME;
		const cards = await inqs.setupCard(inquiry);
		const details = inquiry.details.filter((dt) => dt.INQD_LATEST == 1);
		const tableContainer = await tbquo.setupTableDetail(
			details,
			inquiry.INQ_TYPE,
		);
		table = await createTable(tableContainer);

		const logs = await service.getInquiryHistory(inquiry.INQ_NO);
		const history = await tb.setupTableHistory(logs);
		await createTable(history, { id: "#history" });

		const file = await service.getInquiryFile({ INQ_NO: inquiry.INQ_NO });
		const attachment = await tb.setupTableAttachment(file, true);
		tableAttach = await createTable(attachment, { id: "#attachment" });
	} catch (error) {
		await showErrorMessage(`Something went wrong.`, "2036");
		return;
	} finally {
		await showLoader({ show: false });
	}
});
