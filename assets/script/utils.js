import { showbgLoader } from "@amec/webasset/preloader";
import { initAuthen } from "@amec/webasset/authen";

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
	await new Promise((r) => setTimeout(r, 500));
	await showbgLoader({ show: false });
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

export const setInquiryNo = (val) => {
	return val
		.trim()
		.replace(/(\r\n|\n|\r)/g, "")
		.replaceAll(" ", "")
		.toUpperCase();
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
