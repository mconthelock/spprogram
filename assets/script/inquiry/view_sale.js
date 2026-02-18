import { showDigits } from "@amec/webasset/utils";
import { currentUser } from "@amec/webasset/api/amec";
import { tableOpt } from "../utils.js";
export async function setupSaleViewDetail(data = []) {
	const renderText = (str, logs, key) => {
		if (logs == undefined) return str;
		let li = ``;
		const log = logs.sort(
			(a, b) => new Date(b.LOG_DATE) - new Date(a.LOG_DATE),
		);
		log.map((el) => {
			li += `<li class="flex gap-4 p-1 border-b">
        <div>${el[key] == null ? "" : el[key]}</div>
        <div class="text-xs">${moment(el.UPDATE_AT).format(
			"yyyy-MM-DD h:mm a",
		)}</div>
        <div class="text-xs">${displayname(el.UPDATE_BY).fname}</div>
      </li>`;
		});
		const element = `<ul class="hidden">${li}</ul>${str}`;
		return element;
	};

	const renderLog = (data, logs, key) => {
		let update = false;
		if (logs == undefined) return update;
		if (logs.length > 0) {
			logs.map((log) => {
				if (log[key] != data) update = true;
			});
		}
		return update;
	};

	const renderSupplier = (data, disabled) => {
		const sup = ["", "N/A", "AMEC", "MELINA", "LOCAL"];
		let selector = `<select class="w-25! s2 edit-input supplier" ${disabled ? "disabled" : ""}>`;
		sup.forEach((el) => {
			selector += `<option value="${el}" ${el == data ? "selected" : ""}>${el}</option>`;
		});
		selector += `</select>`;
		return selector;
	};

	//const mode = data.length > 0 ? 1 : 0;
	const user = await currentUser();
	const usrgroup = user.group;
	const opt = { ...tableOpt };
	opt.data = data;
	opt.paging = false;
	opt.searching = false;
	opt.responsive = false;
	opt.info = false;
	opt.orderFixed = [0, "asc"];
	opt.dom = `<"flex "<"table-search flex flex-1 gap-5 "f><"flex items-center table-option"l>><"bg-white border border-slate-300 rounded-2xl overflow-auto max-h-[92vh]"t><"flex mt-5"<"table-page flex-1"p><"table-info flex  flex-none gap-5"i>>`;
	opt.columns = [
		{
			data: "INQD_RUNNO",
			className: "hidden",
		},
		{
			data: "INQD_SEQ",
			title: "No",
			className:
				"sticky-column text-center! cell-display  border-r! w-12.5!",
		},
		{
			data: "INQD_CAR",
			title: "CAR",
			className:
				"sticky-column text-center! cell-display  border-r! w-12.5!",
		},
		{
			data: "INQD_MFGORDER",
			title: "MFG No.",
			className: "sticky-column cell-display  border-r!",
		},
		{
			data: "INQD_ITEM",
			title: "Item",
			className: "sticky-column text-center! cell-display  border-r!",
		},
		{
			data: "INQD_PARTNAME",
			title: "Part Name",
			className: "sticky-column cell-display  border-r! min-w-62!",
		},
		{
			data: "INQD_DRAWING",
			title: "Drawing No.",
			className: "cell-display  border-r! min-w-62!",
		},
		{
			data: "INQD_VARIABLE",
			title: "Variable",
			className: "cell-display  border-r! min-w-50!",
		},
		{
			data: "INQD_QTY",
			title: "Qty.",
			className: "cell-display  border-r!",
		},
		{
			data: "INQD_UM",
			title: "U/M",
			className: "cell-display  border-r!",
		},
		{
			data: "INQD_SUPPLIER",
			title: "Supply By",
			className: "cell-display  border-r!",
		},
		{
			data: "INQD_SENDPART",
			title: `2<sup>nd</sup>`,
			className: "text-center!",
		},
		{
			data: "INQD_UNREPLY",
			title: "U/N",
			className: "text-center!",
		},
		{
			data: "INQD_MAR_REMARK",
			title: "MAR Remark",
			className: `w-62 min-w-62 cell-display border-r!`,
		},
		{
			data: "INQD_DES_REMARK",
			title: "Sale Remark",
			className: `w-62 min-w-62 cell-display border-r!`,
		},
	];
	return opt;
}
