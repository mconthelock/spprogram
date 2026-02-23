import { displayEmpInfo } from "@amec/webasset/indexDB";
import {
	inquirySupplier,
	inquirySecound,
	inquiryCountDwg,
	inquiryValues,
	nextWorkingDay,
} from "../service/index.js";
export const dataExports = async (data) => {
	const details = [];
	// data.forEach(async (el) => {
	for (const el of data) {
		let row = {
			...el,
			inquirySupplier: await inquirySupplier(el),
			inquirySecound: await inquirySecound(el),
			inquiryCountDwg: await inquiryCountDwg(el),
			inquiryValues: await inquiryValues(el),
			MARUSER: el.maruser.SNAME,
			STATUS_DESC: el.status.STATUS_DESC,
			NEXT_WORKING_DAY: await nextWorkingDay(),
			INQ_SALE_FORWARD: el.INQ_SALE_FORWARD ? "Yes" : "No",
		};

		if (el.timeline) {
			row = {
				...row,
				MAR_SEND: el.timeline.MAR_SEND,
				SG_READ: el.timeline.SG_READ,
				SG_CONFIIRM: el.timeline.SG_CONFIRM,
				SE_READ: el.timeline.SE_READ,
				SE_CONFIRM: el.timeline.SE_CONFIRM,
				SG_USER: el.timeline.SG_USER
					? await displayEmpInfo(el.timeline.SG_USER).then(
							(res) => res.SNAME,
						)
					: "",
				SE_USER: el.timeline.SE_USER
					? await displayEmpInfo(el.timeline.SE_USER).then(
							(res) => res.SNAME,
						)
					: "",
			};
		}

		delete row.details;
		delete row.maruser;
		delete row.status;
		delete row.shipment;
		delete row.orders;
		delete row.quotation;
		delete row.quotation;
		details.push(row);
	}
	return details;
};
