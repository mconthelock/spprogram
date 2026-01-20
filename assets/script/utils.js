import dayjs from "dayjs";
import ExcelJS from "exceljs";
import { exportFormat } from "./service/inquiry.js";
import { initAuthen } from "@amec/webasset/authen";
import { displayEmpInfo } from "@amec/webasset/indexDB";

export const initApp = async (opt = {}) => {
	try {
		await initAuthen({
			icon: `${process.env.APP_ENV}/assets/images/cube.png`,
			iconLogo: `${process.env.APP_ENV}/assets/images/cube.png`,
			programName: "SP PROGRAM",
			sidebarClass: `size-xl text-gray-50 bg-primary md:h-[calc(100vh-2.5rem)]! md:rounded-3xl! md:py-5 md:shadow-lg`,
		});

		$(".mainmenu").find("details").attr("open", false);
		if (opt.submenu !== undefined) {
			$(`.mainmenu${opt.submenu}`).find("details").attr("open", true);
		}
	} catch (error) {
		console.log(error);
	}
	await new Promise((r) => setTimeout(r, 1000));
	return;
};

export const tableOpt = {
	dom: `<"flex items-center mb-3"<"table-search flex flex-1 gap-5"f><"flex items-center table-option"l>><"bg-white border border-slate-300 rounded-2xl overflow-hidden"t><"flex mt-5 mb-3"<"table-info flex flex-col flex-1 gap-5"i><"table-page flex-none"p>>`,
	order: [[0, "desc"]],
	pageLength: 25,
	responsive: false,
	language: {
		info: "Showing _START_ to _END_ from _TOTAL_ records",
		infoEmpty: "",
		paginate: {
			previous: '<i class="fi fi-br-arrow-alt-circle-left"></i>',
			next: '<i class="fi fi-br-arrow-alt-circle-right"></i>',
			first: '<i class="fi fi-rs-angle-double-small-left"></i>',
			last: '<i class="fi fi-rs-angle-double-small-right"></i>',
		},
		search: "",
		searchPlaceholder: "Filter records...",
		loadingRecords: `<span class="loading loading-spinner loading-xl"></span>`,
		emptyTable: `<span class="text-[14px] text-gray-600 font-medium">Have no record found</span>`,
		zeroRecords: "ไม่พบข้อมูลที่ต้องการ",
		lengthMenu: "_MENU_",
		infoFiltered: "(กรองข้อมูลจากทั้งหมด _MAX_ รายการ)",
	},
	drawCallback: function (settings) {
		const api = this.api();
		const pagination = $(this).closest(".dt-container").find(".dt-paging");
		if (api.page.info().pages <= 1) {
			pagination.addClass("hidden");
		} else {
			pagination.removeClass("hidden");
		}
	},
};

export const showConfirm = (
	class_function,
	title,
	message,
	icon,
	key = "",
	text = false,
) => {
	$("#confirm_accept").addClass(class_function);
	$("#confirm_accept").attr("data-function", class_function);
	$("#confirm_title").html(`${icon}${title}`);
	$("#confirm_message").html(message);
	$("#confirm_key").val(key);
	if (text) {
		$("#confirm_reason").removeClass("hidden");
	}
};

export const creatBtn = (option = {}) => {
	const opt = {
		id: "btn-save",
		title: "Save Changes",
		icon: "icofont-save text-xl",
		className: "from-blue-500 to-blue-600 text-white",
		href: "#",
		other: "",
		...option,
	};

	if (opt.type == "link") {
		return `<a class="btn group relative inline-flex items-center justify-center overflow-hidden font-bold px-3 py-3 transition-all duration-200 hover:shadow-lg hover:shadow-gray-500/40 focus:outline-none focus:ring-4 focus:ring-gray-400/30 active:scale-80 ${opt.className}" type="button" id="${opt.id}" href="${opt.href}"}>
		<div class="items-center gap-2 btn-loader hidden">
			<span class="loading loading-spinner"></span>
			Processing...
		</div>
		<div class="flex items-center gap-2 btn-name">
        	<i class="${opt.icon}"></i>
            <div>${opt.title}</div>
        </div>
		<div class="absolute top-1/2 left-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 scale-0 rounded-full bg-white/20 transition-transform duration-300 ease-out group-hover:scale-[3.5] active:duration-150"></div>
	</a>`;
	}

	return `<button class="btn group relative inline-flex items-center justify-center overflow-hidden font-bold px-4 py-3 transition-all duration-200 hover:shadow-lg hover:shadow-gray-500/40 focus:outline-none focus:ring-4 focus:ring-gray-400/30 active:scale-80 ${opt.className}" type="button" id="${opt.id}" ${opt.other}>
		<div class="items-center gap-2 btn-loader hidden">
			<span class="loading loading-spinner"></span>
			Processing...
		</div>
		<div class="flex items-center gap-2 btn-name">
        	<i class="${opt.icon}"></i>
            <div>${opt.title}</div>
        </div>
		<div class="absolute top-1/2 left-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 scale-0 rounded-full bg-white/20 transition-transform duration-300 ease-out group-hover:scale-[3.5] active:duration-150"></div>
	</button>`;
};

export const activatedBtn = (obj, activate = true) => {
	if (activate) {
		obj.find(".btn-loader").removeClass("hidden").addClass("flex");
		obj.find(".btn-name").addClass("hidden");
		obj.prop("disabled", true);
	} else {
		obj.find(".btn-loader").addClass("hidden").removeClass("flex");
		obj.find(".btn-name").removeClass("hidden");
		obj.prop("disabled", false);
	}
	return;
};

export const intVal = (i) => {
	return typeof i === "string"
		? i.replace(/[\$,]/g, "") * 1
		: typeof i === "number"
			? i
			: 0;
};

export const digits = (n, digit) => {
	var str = "";
	n = intVal(n);
	if (digit > 0) {
		n = n.toFixed(digit);
		str = n.toString().split(".");
		var fstr =
			str[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") + "." + str[1];
	} else {
		var str = Math.round(n).toString();
		var fstr = str.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
	}
	return fstr;
};

export const amecschdule = (data) => {
	const schd = [
		{ id: "05", val: "X" },
		{ id: "10", val: "A" },
		{ id: "15`", val: "Y" },
		{ id: "20", val: "B" },
		{ id: "25", val: "Z" },
		{ id: "28", val: "Z" },
		{ id: "29", val: "Z" },
		{ id: "30", val: "Z" },
		{ id: "31", val: "Z" },
	];
	const fd = dayjs(data).format("YYYYMM");
	const dd = dayjs(data).format("DD");
	const letter = schd.find((x) => x.id == dd);
	return `${fd}${letter.val}`;
};

export const ameccaledar = async (sdate, edate) => {
	return new Promise((resolve, reject) => {
		$.ajax({
			url: `${process.env.APP_API}/calendar/range`,
			type: "POST",
			dataType: "json",
			data: { sdate, edate },
			success: function (response) {
				resolve(response);
			},
			error: function (error) {
				reject(error);
			},
		});
	});
};

export const revision_code = (current) => {
	if (current === "*") return "A";
	const recursive = (val) => {
		if (/^[A-Z]$/.test(val)) {
			if (val === "Z") {
				return "A";
			}
			return String.fromCharCode(val.charCodeAt(0) + 1);
		}
		return val;
	};
	let chars = current.split("");
	let nb = chars.length - 1;
	for (var i = nb; i >= 0; i--) {
		chars[i] = recursive(chars[i]);
		if (chars[i] != "A") break;
	}
	return chars.join("");
};

export const setInquiryNo = (val) => {
	return val
		.trim()
		.replace(/(\r\n|\n|\r)/g, "")
		.replaceAll(" ", "")
		.toUpperCase();
};

export const foundError = async (error) => {
	const message = async (error) => {
		if (error.responseJSON) {
			const message = error.responseJSON.message;
			if (typeof message == "string") {
				return message;
			}
			let msg = ``;
			error.responseJSON.message.map((val) => {
				for (const [key, value] of Object.entries(val)) {
					msg += `<li>${value}</li>`;
				}
			});
			return msg;
		} else {
			return error.message;
		}
	};

	const loop = localStorage.getItem("sperrorloop") || 0;
	const msg = await message(error);
	const text =
		msg !== undefined || typeof msg == "string" ? msg : "Connection Lost";
	$("#handleErrorBox").prop("checked", true);
	$("#handleErrorBox_msg h1").append(`${text}`);
	let count = 3;
	const el = document.getElementById("countdown");
	el.style.setProperty("--value", count);
	el.setAttribute("aria-label", count);
	const timer = setInterval(() => {
		count--;
		el.style.setProperty("--value", count);
		el.setAttribute("aria-label", count);
		el.textContent = count;
		if (count <= 0) {
			clearInterval(timer);
			localStorage.setItem("sperrorloop", intVal(loop) + 1);
			if (loop >= 3) {
				localStorage.removeItem("sperrorloop");
				window.location.href = `${process.env.APP_ENV}/authen/error/`;
				return;
			}
			window.location.reload();
		}
	}, 1000);
	//
};

export const displayname = (val) => {
	if (val == null) return "";
	const fullname = val.toLowerCase();
	const name = fullname.split(/\s+/).filter((n) => n.length > 0);
	if (name.length === 0) return { sname: "", fname: "", lname: "" };
	const fname = name[0].charAt(0).toUpperCase() + name[0].slice(1);
	const lname =
		name[1] && name[1].length > 0
			? name[1].charAt(0).toUpperCase() + name[1].slice(1)
			: "";
	return {
		sname: `${fname}${lname ? " " + lname : ""}`.trim(),
		fname,
		lname,
	};
};

export async function userInfo() {
	const user = $("#user-login");
	const info = await displayEmpInfo(user.attr("empno"));
	return {
		empno: info.SEMPNO,
		username: info.SNAME,
		displayname: displayname(info.SNAME),
		info: info,
		group: user.attr("groupcode"),
	};
}

// File Functions
export const fileExtension = (fileName) => {
	const dotIndex = fileName.lastIndexOf(".");
	if (dotIndex !== -1 && dotIndex < fileName.length - 1) {
		return fileName.substring(dotIndex + 1);
	} else {
		return null;
	}
};

export const fileIcons = () => {
	return [
		{ ext: "xlsx", icon: `${process.env.APP_IMG}/fileicon/excel.png` },
		{ ext: "csv", icon: `${process.env.APP_IMG}/fileicon/excel.png` },
		{ ext: "docx", icon: `${process.env.APP_IMG}/fileicon/word.png` },
		{ ext: "pptx", icon: `${process.env.APP_IMG}/fileicon/powerpoint.png` },
		{ ext: "pdf", icon: `${process.env.APP_IMG}/fileicon/pdf.png` },
		{ ext: "txt", icon: `${process.env.APP_IMG}/fileicon/txt-file.png` },
		{
			ext: "dwg",
			icon: `${process.env.APP_IMG}/fileicon/dwg-extension.png`,
		},
		{
			ext: "tiff",
			icon: `${process.env.APP_IMG}/fileicon/dwg-extension.png`,
		},
		{ ext: "jpg", icon: `${process.env.APP_IMG}/fileicon/jpg.png` },
		{ ext: "png", icon: `${process.env.APP_IMG}/fileicon/png.png` },
	];
};
