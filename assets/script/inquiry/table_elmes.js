export async function setupElmesTable(data) {
	const opt = {};
	opt.dom = `<"flex mb-3"<"table-search flex flex-1 gap-5"><"flex items-center table-option"f>><"bg-white border border-slate-300 rounded-2xl"t><"flex mt-5"<"table-page flex-1"><"table-info flex  flex-none gap-5"p>>`;
	opt.data = data;
	opt.ordering = false;
	opt.columns = [
		{ data: "orderno", title: "MFG No." },
		{ data: "carno", title: "Car" },
		{ data: "itemno", title: "Item" },
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
		$("#tableElmes")
			.closest(".dt-container")
			.find(".table-search")
			.append(
				`<h1 class="font-semibold text-xl flex items-center">Part List</h1>`,
			);
	};
	return opt;
}
