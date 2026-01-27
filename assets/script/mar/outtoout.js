import "select2/dist/css/select2.min.css";
import "@amec/webasset/css/select2.min.css";
import "@amec/webasset/css/dataTable.min.css";

import { showLoader } from "@amec/webasset/preloader";
import { showMessage } from "@amec/webasset/utils";
import { setDatePicker } from "@amec/webasset/flatpickr";
import { readInput } from "@amec/webasset/excel";
import { creatBtn, activatedBtn } from "@amec/webasset/components/buttons";
import { createTable } from "@amec/webasset/dataTable";
import { setupCard } from "../inquiry/detail.js";
import { getInquiry, dataExports, dataDetails } from "../service/inquiry.js";
import {
	getDeliveryTerm,
	getMethod,
	findPriceRatio,
} from "../service/master.js";
import { initApp, tableOpt } from "../utils.js";

var table;
$(document).ready(async () => {
	try {
		await showLoader({ show: true });
		await initApp({ submenu: `.navmenu-quotation` });
		const cards = await setupCard();
		const optDetail = await tableDetail();
		table = createTable(optDetail);
		setDatePicker({ dayOff: true });
	} catch (error) {
		console.log(error);
		await showMessage(`Something went wrong.`);
		return;
	} finally {
		await showLoader({ show: false });
	}
});

async function tableDetail(data = []) {
	const opt = { ...tableOpt };
	opt.data = data;
	opt.dom = `<"flex items-center mb-3"<"table-search flex flex-1 gap-5"f><"flex items-center table-option"l>><"bg-white border border-slate-300 rounded-2xl overflow-auto"t><"flex mt-5 mb-3"<"table-info flex flex-col flex-1 gap-5"><"table-page flex-none"i>>`;
	opt.searching = false;
	opt.lengthChange = false;
	opt.columns = [
		{
			data: "INQD_CAR",
			title: "Ele No.",
			className: "sticky-column",
		},
		{
			data: "INQD_ITEM",
			title: "Item",
			className: "sticky-column",
		},
		{
			data: "INQD_DRAWING",
			title: "Drawing No.",
			className: "sticky-column min-w-[175px] ",
		},
		{
			data: "INQD_PARTNAME",
			title: "Part Name",
			className: "min-w-[175px]",
		},
		{
			data: "INQD_VARIABLE",
			title: "Specification",
			className: "min-w-[175px] text-start!",
		},
		{
			data: "INQD_SUPPLIER",
			title: "Supplier",
		},
		{
			data: "INQD_QTY",
			title: "Qty",
		},
		{
			data: "INQD_UM",
			title: "UM",
		},
		{
			data: "INQD_FC_COST",
			title: `<div>SPU Price</div><div>[1]</div>`,
			className: "text-right bg-primary/20",
			render: function (data, type, row, meta) {
				if (type === "display") {
					const str = `<input type="text" class="w-full! text-end cell-input" value="${data == null ? "" : data}"/>`;
					return str;
				}
				return data;
			},
		},
		{
			data: "INQD_FC_BASE",
			title: `<div>Exchange</div><div>[2]</div>`,
		},
		{
			data: "INQD_TC_COST",
			title: `<div>SPU Price (THB)</div><div>[1*2]</div>`,
		},
		{
			data: "INQD_TC_BASE",
			title: `<div>Profit</div><div>[3]</div>`,
		},
		{
			data: "INQD_EXRATE",
			title: `<div>Exchange</div><div>[4]</div>`,
		},
		{
			data: "INQD_UNIT_PRICE",
			title: `<div>Unit Price</div><div>[(1*2*3)/4]</div>`,
		},
		{
			data: "INQD_UNIT_PRICE",
			title: "Amount",
		},
	];
	opt.footerCallback = function () {
		/*const api = this.api();
		const data = api.rows().data();
		let totalqty = 0;
		let totalfccost = 0;
		let totaltccost = 0;
		let totalunit = 0;
		let total = 0;
		data.map((el) => {
			const price = calPrice(el);
			totalqty += intVal(el.INQD_QTY);
			totalfccost += intVal(el.INQD_FC_COST);
			totaltccost += intVal(price.tccost);
			totalunit += intVal(price.unitprice);
			total += intVal(price.amount);
		});

		api.column(6).footer().innerHTML = digits(totalqty, 0);
		api.column(8).footer().innerHTML = digits(totalfccost, 3);
		api.column(10).footer().innerHTML = digits(totaltccost, 3);
		api.column(13).footer().innerHTML = digits(totalunit, 3);
		api.column(14).footer().innerHTML = digits(total, 3);*/
		// api.column(12).footer().innerHTML = currency;
	};
	opt.initComplete = async function () {
		const btn1 = await creatBtn({
			id: "import-data-btn",
			title: "Import data",
			icon: `fi fi-rs-progress-upload text-xl`,
			className: `btn-outline btn-accent text-accent hover:shadow-lg hover:text-white!`,
		});
		$(".table-info").append(`<div class="flex gap-2">${btn1}</div>`);
	};
	return opt;
}

$(document).on("click", "#import-data-btn", async function () {
	$("#importouttooutfile").click();
});

$(document).on("change", "#importouttooutfile", async function (e) {
	showLoader({ show: true });
	try {
		const fl = e.target.files;
		const data = await readInput(fl[0]);
		console.log(data);

		let supplier;
		if (data[0][14].richText.length > 0) {
			const title = data[0][14].richText[1].text;
			if (title.search("TOKAN") >= 0) supplier = "TOKAN";
			else {
				if (
					data[11][26] != "" &&
					data[11][26].toUpperCase() == "KISWIRE"
				)
					supplier = "KISWIRE";
				else supplier = "TOKYO ROPE";
			}
		}

		const priceRatio = await findPriceRatio({
			TRADER: data[1][3],
			SUPPLIER: supplier,
			QUOTATION: 25,
		});

		if (priceRatio.length == 0) {
			await showMessage(`Not found price ratio for this Sale Company.`);
			return;
		}

		// prettier-ignore
		{
            const terms = await getDeliveryTerm();
            const term = typeof data[11][22] == "object" ? data[11][22].result : data[11][22];
            const termsData = terms.find(x => x.TERM_DESC == term);

            const methods = await getMethod();
            const method = typeof data[11][24] == "object" ? data[11][24].result : data[11][24];
            const methodData = methods.find(x => x.METHOD_DESC == method);

            const header = {
                INQ_NO: data[11][3],
                INQ_TRADER: data[1][3],
                INQ_COUNTRY: data[6][3],
                INQ_PRJNO: data[2][3],
                INQ_PRJNAME: data[3][3],
                INQ_CONTRACTOR: data[4][3],
                INQ_ENDUSER: data[5][3],
                INQ_USERPART: data[7][3],
                INQ_TYPE: 'Out2out',
                INQ_QUOTATION_TYPE: 25,
                INQ_DELIVERY_TERM: termsData.TERM_ID,
                INQ_DELIVERY_METHOD: methodData.METHOD_ID,
            };

            console.log(priceRatio);


            const detail = [];
            for (let i = 11; i < data.length; i++) {
                if (
                    data[i][3] != undefined &&
                    data[i][3] != null &&
                    data[i][3] != ""
                ) {

                    const row = {
                        INQD_CAR: typeof data[i][4] == "object" ? data[i][4].result : data[i][4],
                        INQD_ITEM: typeof data[i][14] == "object" ? data[i][14].result : data[i][14],
                        INQD_DRAWING: typeof data[i][15] == "object" ? data[i][15].result : data[i][15],
                        INQD_PARTNAME: typeof data[i][16] == "object" ? data[i][16].result : data[i][16],
                        INQD_VARIABLE: typeof data[i][17] == "object" ? data[i][17].result : data[i][17],
                        INQD_SUPPLIER: supplier,
                        INQD_QTY: typeof data[i][18] == "object" ? data[i][18].result : data[i][18],
                        INQD_UM: typeof data[i][19] == "object" ? data[i][19].result : data[i][19],
                        INQD_FC_COST: 0,
                        INQD_FC_BASE: 0,
                        INQD_TC_COST: 0,
                        INQD_TC_BASE: 0,
                        INQD_EXRATE: 0,
                        INQD_UNIT_PRICE: 0,
                        INQD_RUNNO: i+1,
                        INQD_SEQ: i+1,
                    };
                    detail.push(row);
                }
            }
            const optDetail = await tableDetail(detail);
            table = createTable(optDetail);

            //Set Header Info
            $("#trader").closest("div.grid").find("label").html("Sale Company");
            const chkInq = await getInquiry({
                INQ_NO: header.INQ_NO,
                INQ_LATEST: 1,
            });
            if (chkInq.length > 0)
                throw new Error(`Dupplicate inquiry No.: ${header.INQ_NO}`);

            //Get ratio
            //Get exchange rate
        }
	} catch (error) {
		console.log(error);
		await showMessage(`Something went wrong.`);
		return;
	} finally {
		await showLoader({ show: false });
	}

	//if(data[0][14])
	// await readXlsxFile(fl[0]).then(async function (rows) {
	// 	//Verify File Format
	// 	const title = rows[0][14];
	// 	if (
	// 		title === undefined ||
	// 		title == null ||
	// 		title.indexOf("QUOTATION REQUISITION") < 0
	// 	) {
	// 		await showErrorNotify("Invalid file format.");
	// 		return false;
	// 	}

	// 	//Set Quotation No
	// 	const inquiry = rows[12][3];
	// 	if (inquiry == null || inquiry == "") {
	// 		await showErrorNotify("Invalid file format.");
	// 		return false;
	// 	}

	// 	const check = await getInquiry(inquiry);
	// 	if (check.length > 0) {
	// 		await showErrorNotify("Duppliccate quotation No.");
	// 		return false;
	// 	}

	// 	//Set Supplier
	// 	let supplier;
	// 	const suppliername = rows[0][14].toUpperCase(); //await setSupplier(rows[0]);
	// 	if (suppliername.search("TOKAN") >= 0) supplier = "TOKAN";
	// 	else {
	// 		const origin = rows[12][26];
	// 		if (origin == "KISWIRE") supplier = "KISWIRE";
	// 		else supplier = "TOKYO ROPE";
	// 	}

	// 	const curr1 = supplier == "TOKAN" ? "USD" : "THB";
	// 	const exchange1 = curreencies.find(
	// 		(x) => x.CURR_CODE == curr1,
	// 	).CURR_RATE;

	// 	//Set Price Ratio
	// 	const company = rows[1][3];
	// 	const price = await getFormular(company, supplier, 25);
	// 	if (price.length == 0) {
	// 		await showErrorNotify("Not found price ratio for this agent");
	// 		return false;
	// 	}

	// 	const curr2 = price[0].CURRENCY;
	// 	const exchange2 = curreencies.find(
	// 		(x) => x.CURR_CODE == curr2,
	// 	).CURR_RATE;
	// 	const ratio = price[0].FORMULA;
	// 	//Quotation Information
	// 	await setQuotation(rows, curr1, curr2);
	// 	rows.forEach(async (el, i) => {
	// 		if (i >= 12 && el[3] != null) {
	// 			const runno = i - 11;
	// 			el = {
	// 				...el,
	// 				runno,
	// 				supplier,
	// 				ratio,
	// 				exchange1: exchange1 == undefined ? 0 : exchange1,
	// 				exchange2: exchange2 == undefined ? 0 : exchange2,
	// 			};
	// 			await setQuotationDetail(el, runno);
	// 		}
	// 	});

	// 	$("#import").addClass("d-none");
	// 	$(".savedata").removeClass("disabled");
	// });
});
