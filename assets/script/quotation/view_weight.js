import { showDigits } from "@amec/webasset/utils";
import { tableOpt } from "../utils.js";
export async function tableViewWeightOption(data = []) {
	const opt = { ...tableOpt };
	opt.data = data;
	opt.paging = false;
	opt.lengthChange = false;
	opt.searching = false;
	opt.responsive = false;
	opt.info = false;
	opt.orderFixed = [0, "asc"];
	opt.dom = `<"flex "<"table-search flex flex-1 gap-5 "f><"flex items-center table-option"l>><"bg-white border border-slate-300 rounded-2xl overflow-hidden"t><"flex mt-5"<"table-page flex-1"p><"table-info flex  flex-none gap-5"i>>`;
	opt.columns = [
		{ data: "SEQ_WEIGHT" },
		{ data: "PACKAGE_TYPE" },
		{ data: "NO_WEIGHT", className: "text-right!" },
		{ data: "NET_WEIGHT", className: "text-right!" },
		{ data: "GROSS_WEIGHT", className: "text-right!" },
		{ data: "WIDTH_WEIGHT", className: "text-right!" },
		{ data: "LENGTH_WEIGHT", className: "text-right!" },
		{ data: "HEIGHT_WEIGHT", className: "text-right!" },
		{
			data: "VOLUMN_WEIGHT",
			className: "text-right!",
			render: (data) => {
				if (data == null) return "";
				return showDigits(data, 4);
			},
		},
		{ data: "ROUND_WEIGHT", className: "text-right!" },
	];
	opt.initComplete = function () {
		const sumary = (api, col) => {
			const total = api
				.column(col, { page: "-1" })
				.data()
				.reduce((a, b) => a + (b || 0), 0);
			return total;
		};
		const api = this.api();
		let footer = `<tr class="bg-slate-200 font-semibold">
        <th class="text-right" colspan="2">Total</th>`;
		for (let i = 2; i < this.api().columns().nodes().length; i++) {
			const d = i == 8 ? 4 : 0;
			footer += `<th class="text-right!">${showDigits(
				sumary(api, i),
				d,
			)}</th>`;
		}
		footer += `</tr>`;
		$("#table-weight tfoot").append(footer);
	};
	return opt;
}
