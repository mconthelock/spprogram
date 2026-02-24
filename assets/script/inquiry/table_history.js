import dayjs from "dayjs";
import { displayname } from "@amec/webasset/api/amec";
import { displayEmpInfo, fillImages } from "@amec/webasset/indexDB";
import { tableOpt } from "../utils.js";
export async function setupTableHistory(data = []) {
	const opt = { ...tableOpt };
	opt.dom = `<"flex gap-3"<"table-search flex flex-1 gap-5 "><"flex items-center table-option"l>><"bg-white border border-slate-300 rounded-2xl overflow-hidden"t><"flex mt-5"<"table-page flex-1"i><"table-info flex flex-none gap-5"p> >`;
	opt.data = data;
	opt.pageLength = 5;
	opt.paging = true;
	// opt.info = false;
	opt.lengthChange = false;
	opt.order = [1, "desc"];
	opt.columns = [
		{
			data: "INQ_REV",
			className: "text-center text-xs w-[45px] max-w-[45px]",
			title: "Rev.",
			sortable: false,
			render: (data, type) => {
				if (type === "display") {
					return `<a href="#" class="btn btn-xs btn-circle btn-ghost view-last-revision" data-value="${data}">${data}</a>`;
				}
				return data;
			},
		},
		{
			data: "INQH_DATE",
			className: "text-xs py-[8px] px-[5px] w-[200px] max-w-[225px]",
			title: "Date",
			render: (data, type, row) => {
				if (type === "display") {
					const emp = row.users;
					const dsp = displayname(emp.SNAME);
					const name = `${dsp.fname} ${dsp.lname.substring(0, 1)}. (${
						emp.SEMPNO
					})`;
					return `
                        <div class="flex gap-2">
                            <div class="avatar">
                                <div class="w-8 h-8 rounded-full">
                                    <img src="" id="image-${emp.SEMPNO}" class="hidden" />
                                </div>
                            </div>
                            <div class="flex flex-col">
                                <a href="http://webflow/form/usrInfo.asp?uid=${
									emp.SEMPNO
								}" target="_blank" class="text-nowrap font-bold">${name}</a>
                                <div class="text-nowrap text-gray-500">${dayjs(
									data,
								).format("YYYY-MM-DD HH:mm:ss")}</div>
                            </div>
                        </div>`;
				}
				return dayjs(data).format("YYYY-MM-DD HH:mm:ss");
			},
		},
		{
			data: "status",
			title: "Action",
			className: "text-xs py-[8px] px-[5px] w-[150px] max-w-[150px]",
			render: (data) => (data == null ? "" : data.STATUS_ACTION),
		},
		{
			data: "INQH_REMARK",
			title: "Remark",
			className: "text-xs py-[8px] px-[5px]",
			render: function (data, type) {
				if (type === "display") {
					if (data == null) return "";
					return `<div class="flex">
            <div class="line-clamp-1 INQH_REMARK">${data}</div>
            <div class="tooltip tooltip-left" data-tip="${data}"><i class="fi fi-rr-info text-lg readmore"></i></div>
          </div>`;
				}
				return data;
			},
		},
	];
	opt.createdRow = async function (row, data) {
		const emp = await displayEmpInfo(data.users.SEMPNO);
		const element = $(row).find(`#image-${data.users.SEMPNO}`);
		await fillImages(element, data.users.SEMPNO);

		const remark = data.INQH_REMARK;
		if (remark == null || remark == "") return;

		const tdEl = $(row).find("td").eq(3).get(0) || row;
		const style = window.getComputedStyle(tdEl);
		const width = parseFloat(style.width) || 32;
		const $temp = $(
			`<div id="temp-remark" class="text-xs" style="width:${
				width - 25
			}px;white-space:normal;">${remark}</div>`,
		).appendTo("body");

		const tempEl = $temp.get(0);
		const tempStyle = window.getComputedStyle(tempEl);
		// determine line-height (fallback to 1.2 * font-size if 'normal')
		let lineHeight = parseFloat(tempStyle.lineHeight);
		if (isNaN(lineHeight) || tempStyle.lineHeight === "normal") {
			const fontSize = parseFloat(tempStyle.fontSize) || 14;
			lineHeight = fontSize * 1.2;
		}
		const totalHeight = tempEl.scrollHeight || tempEl.offsetHeight;
		const lines = Math.max(1, Math.round(totalHeight / lineHeight));
		if (lines == 1) $(tdEl).find(".readmore").remove();
		$temp.remove();
	};
	return opt;
}
