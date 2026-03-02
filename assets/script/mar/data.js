import {
	inquirySupplier,
	inquirySecound,
	inquiryCountDwg,
	inquiryValues,
	nextWorkingDay,
} from "../service/index.js";
export const dataExports = async (data) => {
	const details = [];
	data.forEach(async (el) => {
		console.log(el.timeline);
		let row = {
			...el,
			inquirySupplier: await inquirySupplier(el),
			inquirySecound: await inquirySecound(el),
			inquiryCountDwg: await inquiryCountDwg(el),
			inquiryValues: await inquiryValues(el),
			SHIPMENT_VALUE: el.shipment.SHIPMENT_VALUE,
			MARUSER: el.maruser.SNAME,
			STATUS_DESC: el.status.STATUS_DESC,
			PRJ_NO: el.orders.length == 0 ? null : el.orders[0].PRJ_NO,
			ORDER_NO: el.orders.length == 0 ? null : el.orders[0].ORDER_NO,
			IDS_DATE: el.orders.length == 0 ? null : el.orders[0].IDS_DATE,
			CUST_RQS: el.orders.length == 0 ? null : el.orders[0].CUST_RQS,
			DSTN: el.orders.length == 0 ? null : el.orders[0].DSTN,
			QUO_DATE: el.quotation ? el.quotation.QUO_DATE : null,
			MAR_SEND: el.timeline.MAR_SEND,
			DE_READ: el.timeline.DE_READ,
			DE_CONFIRM: el.timeline.DE_CONFIRM,
			BM_CONFIRM: el.timeline.BM_CONFIRM,
			FIN_READ: el.timeline.FIN_READ,
			FMN_CONFIRM: el.timeline.FMN_CONFIRM,
			QT_READ: el.timeline.QT_READ,
			FINUSER: el.timeline.FIN_USER,
		};

		delete row.details;
		delete row.maruser;
		delete row.status;
		delete row.shipment;
		delete row.orders;
		delete row.quotation;
		delete row.timeline;
		details.push(row);
	});
	return details;
};
