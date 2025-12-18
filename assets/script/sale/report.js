import "datatables.net-responsive-dt/css/responsive.dataTables.min.css";
import "@styles/select2.min.css";
import "@styles/datatable.min.css";
import "select2";
import { setDatePicker } from "@public/flatpickr";
import { createTable, destroyTable } from "@public/dataTable";
import { getFormHeader } from "../inquiry/detail.js";
import * as service from "../service/inquiry.js";
import * as mkt from "../service/mkt.js";
import * as mst from "../service/master.js";
import * as utils from "../utils.js";
import { tableOpt } from "./table.js";
import { grep } from "jquery";

var table;
$(async function () {
	try {
		await utils.initApp({ submenu: ".navmenu-newinq" });
		$(".select").select2({});
		await setDatePicker();
		await setSeries();
		await setOrderType();
		await setTrader();
		await setAgent();
		await setCountry();
		await setStatus();
		await setSE();
		$("#form-container").removeClass("hidden");
	} catch (error) {
		console.log(error);
		await utils.errorMessage(error);
	} finally {
		await utils.showLoader({ show: false });
	}
});

$(document).on("click", "#reset-form", async function (e) {
	e.preventDefault();
	$("#form-container")[0].reset();
	$(".select").val(null).trigger("change");
	localStorage.removeItem("spinquiryquery");
});

$(document).on("click", "#back-report", async function (e) {
	e.preventDefault();
	await destroyTable();
	$("#form-container").removeClass("hidden");
	localStorage.removeItem("spinquiryquery");
});

$(document).on("click", "#search", async function (e) {
	e.preventDefault();
	try {
		let formdata = await getFormHeader();
		Object.keys(formdata).forEach(
			(key) => formdata[key] == "" && delete formdata[key]
		);

		if (Object.keys(formdata).length == 0) {
			await utils.showMessage(
				"Please select at least one filter criteria."
			);
			return;
		}

		formdata = { ...formdata, INQ_TYPE: "SP" };
		let data = await service.getInquiry(formdata);
		const opt = await tableOpt(data, {
			backReportBtn: true,
			report: true,
		});
		table = await createTable(opt);
		$("#form-container").addClass("hidden");
		$("#table").removeClass("hidden");
		localStorage.setItem("spinquiryquery", JSON.stringify(formdata));
	} catch (error) {
		console.log(error);
		await utils.errorMessage(error);
	} finally {
		await utils.showLoader({ show: false });
	}
});

export const setSeries = async () => {
	const id = "#series";
	const data = await mkt.getSeries();
	$(`${id}`).empty().append(new Option("", "", false, false));
	data.map((el) => {
		$(`${id}`).append(
			new Option(el.ABBREVIATION, el.ABBREVIATION, false, false)
		);
	});
};

export const setOrderType = async () => {
	const id = "#ordertype";
	const data = [
		{ id: "", value: "All" },
		{ id: "ELE", value: "Elevator" },
		{ id: "ESO", value: "EScalator" },
		{ id: "MOV", value: "Moving Walk" },
	];
	data.map((el) => {
		$(`${id}`).append(new Option(el.value, el.id, false, false));
	});
};

export const setTrader = async () => {
	const id = "#trader";
	const data = await mst.getPriceRatio();
	const traders = data.map((item) => item.TRADER);
	const uniqueTraders = [...new Set(traders)];
	$(`${id}`).empty().append(new Option("", "", false, false));
	uniqueTraders.map((el) => {
		$(`${id}`).append(new Option(el, el, false, false));
	});
};

export const setAgent = async () => {
	const id = "#agent";
	const data = await mkt.getAgent();
	const agents = data.filter((item) => item.STATUS == "Enabled");
	const uniqueAgents = [
		...new Map(agents.map((item) => [item.AGENT, item])).values(),
	];
	$(`${id}`).empty().append(new Option("", "", false, false));
	uniqueAgents.map((el) => {
		$(`${id}`).append(new Option(el.AGENT, el.AGENT, false, false));
	});
};

export const setCountry = async () => {
	const id = "#country";
	const data = await mkt.getCountries();
	$(`${id}`).empty().append(new Option("", "", false, false));
	data.map((el) => {
		$(`${id}`).append(new Option(el.CTNAME, el.CTNAME, false, false));
	});
};

export const setStatus = async () => {
	const id = "#status";
	const data = await mst.getStatus();
	$(`${id}`).empty().append(new Option("", "", false, false));
	data.map((el) => {
		$(`${id}`).append(
			new Option(el.STATUS_ACTION, el.STATUS_ID, false, false)
		);
	});
};

export const setSE = async () => {
	const id = "#se_engineer";
	let users = await mst.getAppUsers();
	users = users.filter((u) =>
		["SEG", "SEL"].includes(u.appsgroups?.GROUP_CODE)
	);
	$(`${id}`).empty().append(new Option("", "", false, false));
	users.map((el) => {
		$(`${id}`).append(
			new Option(el.data.SNAME, el.data.SEMPNO, false, false)
		);
	});
};
