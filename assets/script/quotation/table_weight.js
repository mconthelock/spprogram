import { showDigits, intVal } from "@amec/webasset/utils";
import { createBtn } from "@amec/webasset/components/buttons";
import { tableOpt } from "../utils.js";
export async function tableWeightOption(data = []) {
	const packtype = () => {
		return `<select class="w-full s2 edit-input package-type">
            <option value=""></option>
            <option value="Wooden package">Wooden package</option>
            <option value="Carton package+Pallet">Carton package+Pallet</option>
            <option value="Carton box">Carton box</option>
            <option value="Pallet">Pallet</option>
            <option value="Bare">Bare</option>
            </select>`;
	};

	const textInput = (data, digits = 0) => {
		return `<input type="text" class="w-full cell-input input-number text-right" value="${showDigits(data, digits) || 0}">`;
	};

	const fooerData = (data) => {
		return `<div class="w-full text-right">${data}</div>`;
	};

	const opt = { ...tableOpt };
	opt.data = data;
	opt.paging = false;
	opt.lengthChange = false;
	opt.searching = false;
	opt.info = false;
	opt.order = [[0, "asc"]];
	opt.dom = `<"flex "<"table-search flex flex-1 gap-5 "f><"flex items-center table-option"l>><"bg-white border border-slate-300 rounded-2xl overflow-auto max-h-[92vh]"t><"flex mt-5"<"table-page flex-1"p><"table-info flex  flex-none gap-5"i>>`;
	opt.columns = [
		{
			data: "SEQ_WEIGHT",
			className: "hidden",
		},
		{
			data: "SEQ_WEIGHT",
			sortable: false,
			className: `sticky-column w-12 min-w-12 cell-display border-r!`,
		},
		{
			data: "PACKAGE_TYPE",
			footer: "Total",
			className: `sticky-column`,
			render: function (data, type, row) {
				if (type === "display") {
					return packtype();
				}
				return data;
			},
		},
		{
			data: "NO_WEIGHT",
			className: `w-32 min-w-32 bg-primary/10`,
			render: function (data, type) {
				if (type === "display") return textInput(data);
				return data;
			},
		},
		{
			data: "NET_WEIGHT",
			className: `w-32 min-w-32 bg-primary/10`,
			render: function (data, type) {
				if (type === "display") return textInput(data);
				return data;
			},
		},
		{
			data: "GROSS_WEIGHT",
			className: `w-32 min-w-32 bg-primary/10`,
			render: function (data, type) {
				if (type === "display") return textInput(data);
				return data;
			},
		},
		{
			data: "WIDTH_WEIGHT",
			className: `w-32 min-w-32 bg-primary/10`,
			render: function (data, type) {
				if (type === "display") return textInput(data);
				return data;
			},
		},
		{
			data: "LENGTH_WEIGHT",
			className: `w-32 min-w-32 bg-primary/10`,
			render: function (data, type) {
				if (type === "display") return textInput(data);
				return data;
			},
		},
		{
			data: "HEIGHT_WEIGHT",
			className: `w-32 min-w-32 bg-primary/10`,
			render: function (data, type) {
				if (type === "display") return textInput(data);
				return data;
			},
		},
		{
			data: "VOLUMN_WEIGHT",
			className: `cell-display w-32 min-w-32 border-r!`,
			render: function (data, type) {
				// 	const volume =
				// 		intVal(row.WIDTH_WEIGHT) *
				// 		intVal(row.LENGTH_WEIGHT) *
				// 		intVal(row.HEIGHT_WEIGHT) *
				// 		0.000001;
				if (type === "display") {
					return showDigits(data, 4);
				}
				return data;
			},
		},
		{
			data: "ROUND_WEIGHT",
			className: `cell-display w-32 min-w-32 border-r!`,
		},
	];

	opt.footerCallback = function () {
		const api = this.api();
		const data = api.rows().data();
		let TOTAL_NO_WEIGHT = 0;
		let TOTAL_NET_WEIGHT = 0;
		let TOTAL_GROSS_WEIGHT = 0;
		let TOTAL_WIDTH_WEIGHT = 0;
		let TOTAL_LENGTH_WEIGHT = 0;
		let TOTAL_HEIGHT_WEIGHT = 0;
		let TOTAL_VOLUMN_WEIGHT = 0;
		let TOTAL_ROUND_WEIGHT = 0;
		data.map((el) => {
			TOTAL_NO_WEIGHT = TOTAL_NO_WEIGHT + (intVal(el.NO_WEIGHT) || 0);
			TOTAL_NET_WEIGHT = TOTAL_NET_WEIGHT + (intVal(el.NET_WEIGHT) || 0);
			TOTAL_GROSS_WEIGHT =
				TOTAL_GROSS_WEIGHT + (intVal(el.GROSS_WEIGHT) || 0);
			TOTAL_WIDTH_WEIGHT =
				TOTAL_WIDTH_WEIGHT + (intVal(el.WIDTH_WEIGHT) || 0);
			TOTAL_LENGTH_WEIGHT =
				TOTAL_LENGTH_WEIGHT + (intVal(el.LENGTH_WEIGHT) || 0);
			TOTAL_HEIGHT_WEIGHT =
				TOTAL_HEIGHT_WEIGHT + (intVal(el.HEIGHT_WEIGHT) || 0);
			TOTAL_VOLUMN_WEIGHT =
				TOTAL_VOLUMN_WEIGHT + (intVal(el.VOLUMN_WEIGHT) || 0);
			TOTAL_ROUND_WEIGHT =
				TOTAL_ROUND_WEIGHT + (intVal(el.ROUND_WEIGHT) || 0);
		});

		api.column(3).footer().innerHTML = fooerData(
			showDigits(TOTAL_NO_WEIGHT, 0),
		);
		api.column(4).footer().innerHTML = fooerData(
			showDigits(TOTAL_NET_WEIGHT, 0),
		);
		api.column(5).footer().innerHTML = fooerData(
			showDigits(TOTAL_GROSS_WEIGHT, 0),
		);
		api.column(6).footer().innerHTML = fooerData(
			showDigits(TOTAL_WIDTH_WEIGHT, 0),
		);
		api.column(7).footer().innerHTML = fooerData(
			showDigits(TOTAL_LENGTH_WEIGHT, 0),
		);
		api.column(8).footer().innerHTML = fooerData(
			showDigits(TOTAL_HEIGHT_WEIGHT, 0),
		);
		api.column(9).footer().innerHTML = fooerData(
			showDigits(TOTAL_VOLUMN_WEIGHT, 4),
		);
		api.column(10).footer().innerHTML = fooerData(
			showDigits(TOTAL_ROUND_WEIGHT, 0),
		);
	};
	opt.initComplete = function () {
		const addRowBtn = createBtn({
			id: "add-weight-row",
			title: "",
			icon: "fi fi-rr-add text-2xl",
			className: `btn-sm btn-primary btn-square text-white`,
		});
		$("#table-weight")
			.closest(".dt-container")
			.find(".table-page")
			.append(`<div class="flex gap-1">${addRowBtn}</div>`);
	};
	return opt;
}
