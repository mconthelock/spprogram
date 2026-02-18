import dayjs from "dayjs";
import { currentUser } from "@amec/webasset/api/amec";
import { tableOpt, fileIcons, fileExtension } from "../utils.js";
export async function setupTableAttachment(data = [], view = false) {
	const user = await currentUser();
	const usrgroup = user.group;
	const icons = await fileIcons();
	const opt = { ...tableOpt };
	opt.data = data;
	opt.pageLength = 5;
	opt.paging = true;
	opt.dom = `<"flex gap-3"<"table-search flex flex-1 gap-5 "><"flex items-center table-option"l>><"bg-white border border-slate-300 rounded-2xl overflow-hidden"t><"flex mt-5"<"table-page flex-1"p><"table-info flex  flex-none gap-5"i>>`;
	opt.info = false;
	opt.lengthChange = false;
	opt.order = [2, "desc"];
	opt.columns = [
		{
			data: "FILE_ORIGINAL_NAME",
			title: "File Name",
			className: "text-xs py-[5px] max-w-[220px]",
			render: (data, type, row) => {
				const ext = fileExtension(data);
				const icon = icons.find((x) => x.ext == ext);
				const img = icon
					? icon.icon
					: `${process.env.APP_IMG}/fileicon/photo-gallery.png`;

				const link =
					row.FILE_ID == undefined
						? "#"
						: `${process.env.APP_API}/sp/attachments/download/${row.FILE_ID}`;
				return `<a href="${link}" class="flex items-center gap-1 download-att-${
					row.FILE_NAME ? "server" : "client"
				}">
            <img src="${img}" class="w-6 h-6"/>
            <div class="line-clamp-1">${data}</div>
        </a>`;
			},
		},
		{
			data: "FILE_CREATE_BY",
			title: "Owner",
			className: "text-xs py-[8px]",
			render: (data) => {
				return `<div class="line-clamp-1">${data}</div>`;
			},
		},
		{
			data: "FILE_CREATE_AT",
			title: "File Date",
			className: "text-xs py-[8px]",
			render: (data) => {
				return `<div class="line-clamp-1">${dayjs(data).format(
					"YYYY-MM-DD HH:mm:ss",
				)}</div>`;
			},
		},
		{
			data: "FILE_ORIGINAL_NAME",
			title: `<i class="icofont-ui-delete text-lg"></i>`,
			className: `text-center px-1 py-[8px] ${view ? "hidden" : ""}`,
			sortable: false,
			render: (data, type, row) => {
				if (usrgroup == "MAR" && row.FILE_OWNER == "MAR") {
					return `<a href="#" class="btn btn-ghost btn-sm btn-circle delete-att"><i class="fi fi-rr-trash text-2xl text-red-500"></i></a>`;
				} else if (usrgroup != "MAR" && row.FILE_OWNER != "MAR") {
					return `<a href="#" class="btn btn-ghost btn-sm btn-circle delete-att"><i class="fi fi-rr-trash text-2xl text-red-500"></i></a>`;
				} else {
					return `<a href="#" class="btn btn-ghost btn-sm btn-circle btn-disabled"><i class="fi fi-tr-trash-slash text-2xl text-gray-300"></i></a>`;
				}
			},
		},
	];
	opt.initComplete = function () {
		$("#attachment")
			.closest(".dt-container")
			.find(".table-option")
			.append(
				`<input type="file" id="attachment-file" multiple class="hidden" accept=".pdf,.jpg,.jpeg,.png,.docx,.xlsx,.txt, .csv" />`,
			);
	};
	return opt;
}
