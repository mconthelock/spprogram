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
	for (const el of data) {
		let row = {
			...el,
			// inquirySupplier: await inquirySupplier(el),
			// inquirySecound: await inquirySecound(el),
			// inquiryCountDwg: await inquiryCountDwg(el),
			// inquiryValues: await inquiryValues(el),
			MARUSER: el.maruser.SNAME,
			STATUS_DESC: el.status.STATUS_ACTION,
		};

		if (el.timeline) {
			row = {
				...row,
				MAR_SEND: el.timeline.MAR_SEND,
				BM_DATE: el.timeline.BM_CONFIRM,
				FIN_NAME: el.timeline.FIN_USER
					? await displayEmpInfo(el.timeline.FIN_USER).then(
							(res) => res.SNAME,
						)
					: "",
				FIN_READ_DATE: el.timeline.FIN_READ,
				FIN_CONFIRM_DATE: el.timeline.FIN_CONFIRM,
				FCK_NAME: el.timeline.FCK_USER
					? await displayEmpInfo(el.timeline.FCK_USER).then(
							(res) => res.SNAME,
						)
					: "",
				FCK_READ_DATE: el.timeline.FCK_READ,
				FCK_CONFIRM_DATE: el.timeline.FCK_CONFIRM,
				FMN_NAME: el.timeline.FMN_USER
					? await displayEmpInfo(el.timeline.FMN_USER).then(
							(res) => res.SNAME,
						)
					: "",
				FMN_READ_DATE: el.timeline.FMN_READ,
				FMN_APPROVE_DATE: el.timeline.FMN_CONFIRM,
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

export const dataFilter = async (data, page) => {
	return data.filter((el) => {
		switch (page) {
			case "1":
				if (
					(el.INQ_TYPE == "SP" || el.INQ_TYPE == "Price") &&
					el.INQ_STATUS < 43
				) {
					return el;
				}
				break;
			case "2":
				if (
					(el.INQ_TYPE == "SP" || el.INQ_TYPE == "Price") &&
					el.INQ_STATUS == 43
				) {
					return el;
				}
				break;
			case "3":
				if (
					(el.INQ_TYPE == "SP" || el.INQ_TYPE == "Price") &&
					el.INQ_STATUS == 44
				) {
					return el;
				}
				break;
			default:
				if (el.INQ_TYPE == "SP" || el.INQ_TYPE == "Price") {
					return el;
				}
				break;
		}
	});
};
