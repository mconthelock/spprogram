import { tableOpt } from "../utils";
export async function tablePartOption(data = []) {
	const opt = { ...tableOpt };
	opt.data = data;
	opt.lengthChange = false;
	opt.searching = false;
	opt.columns = [
		{
			data: null,
			title: "No.",
			render: (data, type, row, meta) => meta.row + 1,
		},
		{
			data: null,
			title: "Name",
			render: (data, type, row, meta) => meta.row + 1,
		},
	];
	return opt;
}
