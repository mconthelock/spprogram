import { createBtn } from "@amec/webasset/components/buttons";
import { tableOpt } from "../utils.js";

export async function setupElmesTable(data) {
	const opt = { ...tableOpt };
	opt.dom = `<"flex "<"table-search flex flex-1 gap-5 "f><"flex items-center table-option"l>><"bg-white border border-slate-300 rounded-2xl mt-3 overflow-auto max-h-[92vh]"t><"flex mt-5"<"table-page flex-1"p><"table-info flex  flex-none gap-5"i>>`;
	opt.data = data;
	opt.ordering = false;
	opt.pageLength = 10;
	opt.columns = [
		{ data: "orderno", title: "MFG No.", className: "sticky-column!" },
		{
			data: "carno",
			title: "Car",
			className: "sticky-column! text-center!",
		},
		{ data: "itemno", title: "Item", className: "text-center!" },
		{ data: "partname", title: "Part Name" },
		{ data: "drawing", title: "Drawing No." },
		{ data: "variable", title: "Variable" },
		{ data: "qty", title: "Qty" },
		{
			data: "supply",
			title: "Supply",
			render: (data) => {
				if (data == "R") return `LOCAL`;
				if (data == "J") return `MELINA`;
				if (data == "U") return ``;
				return `AMEC`;
			},
		},
		{ data: "scndpart", title: `2<sup>nd</sup>` },
	];
	opt.initComplete = function () {
		const addDwgBtn = createBtn({
			id: "elmes-confirm",
			title: "Insert Item",
			icon: "fi fi-sr-add text-2xl",
			className: `btn-accent text-white`,
		});
		const cancleBtn = createBtn({
			id: "elmes-cancel",
			title: "Cancel",
			icon: "fi fi-br-rotate-right text-2xl",
			className: `btn-error text-white`,
		});
		$("#tableElmes")
			.closest(".dt-container")
			.find(".table-page")
			.append(`<div class="flex gap-3">${addDwgBtn}${cancleBtn}</div>`);
	};
	return opt;
}
