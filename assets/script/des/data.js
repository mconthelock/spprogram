import { nextWorkingDay } from "../service/index.js";
export async function getDesigner() {
	return new Promise((resolve, reject) => {
		$.ajax({
			url: `${process.env.APP_API}/sp/designer/all`,
			type: "GET",
			dataType: "json",
			success: function (response) {
				resolve(response);
			},
			error: function (error) {
				reject(error);
			},
		});
	});
}

export async function getDesignerGroup() {
	const user = $("#user-login").attr("empno");
	const designer = await getDesigner();
	return designer.find((d) => d.DES_USER == user);
}

export const dataExports = async (data) => {
	const details = [];
	for (const el of data) {
		let row = {
			...el,
			// inquirySupplier: await inquirySupplier(el),
			// inquirySecound: await inquirySecound(el),
			// inquiryCountDwg: await inquiryCountDwg(el),
			// inquiryValues: await inquiryValues(el),
			MARUSER: el.maruser.SNAME,
			STATUS_DESC: el.status.STATUS_DESC,
			NEXT_WORKING_DAY: await nextWorkingDay(el, 4),
			// INQ_SALE_FORWARD: el.INQ_SALE_FORWARD ? "Yes" : "No",
			IS_EME: el.inqgroup.some((g) => g.INQG_GROUP == 1) ? "Yes" : "No",
			IS_EEL: el.inqgroup.some((g) => g.INQG_GROUP == 2) ? "Yes" : "No",
			IS_EAP: el.inqgroup.some((g) => g.INQG_GROUP == 3) ? "Yes" : "No",
			IS_ESO: el.inqgroup.some((g) => g.INQG_GROUP == 6) ? "Yes" : "No",
		};
		details.push(row);
	}
	return details;
};
