import "@amec/webasset/css/dataTable.min.css";
import { showLoader } from "@amec/webasset/preloader";
import { showMessage, showConfirm } from "@amec/webasset/utils";
import { currentUser } from "@amec/webasset/api/amec";
import { createTable } from "@amec/webasset/dataTable";
import { activatedBtnRow } from "@amec/webasset/components/buttons";
import { tableInquiryDEOption } from "../inquiry/index.js";
import { initApp } from "../utils.js";
import {
	getInquiry,
	getTemplate,
	exportExcel,
	updateInquiryTimeline,
} from "../service/index.js";
import { getDesigner, dataExports } from "./data.js";
var table;
$(async function () {
	await showLoader();
	const app = await initApp();
	if (!app) return;

	try {
		const data = await query();
		const tableOpt = await tableInquiryDEOption(data);
		table = await createTable(tableOpt);
	} catch (error) {
		console.log(error);
		await showMessage(error);
	} finally {
		await showLoader({ show: false });
	}
});

async function query() {
	try {
		const pageid = $("#pageid").val();
		const des = await getDesigner();
		const user = $("#user-login").attr("empno");
		const desgroup = des.find((d) => d.DES_USER == user).DES_GROUP;
		const data = await getInquiry({
			INQ_TYPE: "SP",
			INQ_STATUS: "< 29",
			IS_GROUP: 1,
			IS_TIMELINE: 1,
		});
		// console.log(desgroup);
		let result = [];
		switch (pageid) {
			case "1":
				result = data.filter((d) => {
					if (d.INQ_STATUS < 11) return false;
					return d.inqgroup.some((g) => {
						// console.log(
						// 	g.INQG_DES,
						// 	g.INQG_GROUP,
						// 	g.INQG_STATUS,
						// 	g.INQG_ASG_DATE,
						// );

						return (
							g.INQG_GROUP == desgroup &&
							g.INQG_STATUS < 20 &&
							g.INQG_ASG_DATE == null
						);
					});
				});
				// console.log(result);
				break;
			case "2":
				result = data.filter((d) => {
					if (d.INQ_STATUS < 11) return false;
					return d.inqgroup.some(
						(g) =>
							g.INQG_GROUP == desgroup &&
							g.INQG_STATUS < 24 &&
							g.INQG_ASG_DATE != null &&
							g.INQG_DES_DATE == null &&
							g.INQG_DES == user,
					);
				});
				break;
			case "3":
				result = data.filter((d) => {
					if (d.INQ_STATUS < 11) return false;
					return d.inqgroup.some(
						(g) =>
							g.INQG_GROUP == desgroup &&
							g.INQG_STATUS < 26 &&
							g.INQG_ASG_DATE != null &&
							g.INQG_DES_DATE != null &&
							g.INQG_CHK_DATE == null &&
							g.INQG_CHK == user,
					);
				});
				break;
			default:
				result = data;
				break;
		}
		return result;
	} catch (error) {
		console.log(error);
		return [];
	}
}

$(document).on("click", ".process-btn", async function (e) {
	e.preventDefault();
	try {
		const pageid = $("#pageid").val();
		const user = await currentUser();
		const group = user.group;
		const row = table.row($(this).closest("tr")).data();
		const timeline = row.timeline;
		if (timeline.DE_READ == null) {
			await activatedBtnRow($(this));
			const data = {
				INQ_NO: row.INQ_NO,
				INQ_REV: row.INQ_REV,
				DE_READ: new Date(),
			};
			await updateInquiryTimeline(data);
		}
		window.location.replace(
			`${process.env.APP_ENV}/des/inquiry/detail/${row.INQ_ID}/${pageid}/`,
		);
	} catch (error) {
		console.log(error);
		await showMessage(error);
		await activatedBtn($(this), false);
	}
});

$(document).on("click", "#export1", async function (e) {
	e.preventDefault();
	try {
		await activatedBtnRow($(this));
		const usergroup = $("#user-login").attr("groupcode");
		const template = await getTemplate(
			"export_inquiry_list_template_for_de.xlsx",
		);

		let data = await query();
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
		await activatedBtnRow($(this), false);
	}
});
