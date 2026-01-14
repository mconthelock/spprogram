export const getInquiry = async (data) => {
	return new Promise((resolve, reject) => {
		$.ajax({
			url: `${process.env.APP_API}/sp/inquiry/search/`,
			type: "POST",
			dataType: "json",
			data: data,
			success: function (response) {
				resolve(response);
			},
			error: function (error) {
				reject(error);
			},
		});
	});
};

export const getInquiryID = async (id) => {
	return new Promise((resolve, reject) => {
		$.ajax({
			url: `${process.env.APP_API}/sp/inquiry/find/${id}/`,
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
};

export const createInquiry = async (data) => {
	return new Promise((resolve, reject) => {
		$.ajax({
			url: `${process.env.APP_API}/sp/inquiry/create/`,
			type: "POST",
			dataType: "json",
			data: data,
			success: function (response) {
				resolve(response);
			},
			error: function (error) {
				reject(error);
			},
		});
	});
};

export const deleteInquiry = async (data) => {
	return new Promise((resolve, reject) => {
		$.ajax({
			url: `${process.env.APP_API}/sp/inquiry/delete/`,
			type: "POST",
			dataType: "json",
			data: data,
			success: function (response) {
				resolve(response);
			},
			error: function (error) {
				reject(error);
			},
		});
	});
};

export const updateInquiry = async (data) => {
	return new Promise((resolve, reject) => {
		$.ajax({
			url: `${process.env.APP_API}/sp/inquiry/update/`,
			type: "POST",
			dataType: "json",
			data: data,
			success: function (response) {
				resolve(response);
			},
			error: function (error) {
				reject(error);
			},
		});
	});
};

export const updateInquiryStatus = async (data, id) => {
	return new Promise((resolve, reject) => {
		$.ajax({
			url: `${process.env.APP_API}/sp/inquiry/update_status/${id}/`,
			type: "POST",
			dataType: "json",
			data: data,
			success: function (response) {
				resolve(response);
			},
			error: function (error) {
				reject(error);
			},
		});
	});
};

export const getInquiryReport = async (data) => {
	try {
		return new Promise((resolve, reject) => {
			$.ajax({
				url: `${process.env.APP_API}/sp/inquiry/query/`,
				type: "POST",
				dataType: "json",
				data: data,
				success: function (response) {
					resolve(response);
				},
				error: function (error) {
					reject(error);
				},
			});
		});
	} catch (error) {
		console.log(error);
		await utils.errorMessage(error);
	}
};

//Function to manage inquiry group
export const getInquiryGroup = async (data) => {
	return new Promise((resolve, reject) => {
		$.ajax({
			url: `${process.env.APP_API}/sp/group/search/`,
			type: "POST",
			dataType: "json",
			data: data,
			success: function (response) {
				resolve(response);
			},
			error: function (error) {
				reject(error);
			},
		});
	});
};

export const createInquiryGroup = async (data) => {
	return new Promise((resolve, reject) => {
		$.ajax({
			url: `${process.env.APP_API}/sp/group/create/`,
			type: "POST",
			dataType: "json",
			data: data,
			success: function (response) {
				resolve(response);
			},
			error: function (error) {
				reject(error);
			},
		});
	});
};

export const updateInquiryGroup = async (data) => {
	return new Promise((resolve, reject) => {
		$.ajax({
			url: `${process.env.APP_API}/sp/group/update/`,
			type: "POST",
			dataType: "json",
			data: data,
			success: function (response) {
				resolve(response);
			},
			error: function (error) {
				reject(error);
			},
		});
	});
};

//Function to manage inquiry detail
export const createInquiryDetail = async (data) => {
	return new Promise((resolve, reject) => {
		$.ajax({
			url: `${process.env.APP_API}/sp/detail/create/`,
			type: "POST",
			dataType: "json",
			data: data,
			success: function (response) {
				resolve(response);
			},
			error: function (error) {
				reject(error);
			},
		});
	});
};

//History
export const getInquiryHistory = async (id) => {
	return new Promise((resolve, reject) => {
		$.ajax({
			url: `${process.env.APP_API}/sp/history/${id}/`,
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
};

//Attachment
export const createInquiryFile = async (data) => {
	return new Promise((resolve, reject) => {
		$.ajax({
			url: `${process.env.APP_API}/sp/attachments/create/`,
			type: "POST",
			dataType: "json",
			data: data,
			processData: false,
			contentType: false,
			success: function (response) {
				resolve(response);
			},
			error: function (error) {
				reject(error);
			},
		});
	});
};

export const getInquiryFile = async (data) => {
	return new Promise((resolve, reject) => {
		$.ajax({
			url: `${process.env.APP_API}/sp/attachments/search/`,
			type: "POST",
			dataType: "json",
			data: data,
			success: function (response) {
				resolve(response);
			},
			error: function (error) {
				reject(error);
			},
		});
	});
};

export const getExportTemplate = async (data) => {
	return new Promise((resolve, reject) => {
		$.ajax({
			url: `${process.env.APP_API}/sp/attachments/export/template/`,
			type: "POST",
			dataType: "json",
			data: data,
			success: function (res) {
				const binaryData = atob(res.content);
				const buffer = new Uint8Array(binaryData.length);
				for (let i = 0; i < binaryData.length; i++) {
					buffer[i] = binaryData.charCodeAt(i);
				}
				res.buffer = buffer;
				resolve(res);
			},
			error: function (error) {
				console.log(`Do error`);
				reject(error);
			},
		});
	});
};

//Inquiry Timeline
export const updateInquiryTimeline = async (data) => {
	return new Promise((resolve, reject) => {
		$.ajax({
			url: `${process.env.APP_API}/sp/timeline/`,
			type: "PATCH",
			dataType: "json",
			data: data,
			success: function (response) {
				resolve(response);
			},
			error: function (error) {
				reject(error);
			},
		});
	});
};

//Align data for export excel
export const dataExports = async (data) => {
	const details = [];
	data.forEach(async (el) => {
		let row = {
			...el,
			inquirySupplier: await inquirySupplier(el),
			inquirySecound: await inquirySecound(el),
			inquiryCountDwg: await inquiryCountDwg(el),
			inquiryValues: await inquiryValues(el),
			SHIPMENT_VALUE: el.shipment.SHIPMENT_VALUE,
			MARUSER: el.maruser.SNAME,
			STATUS_DESC: el.status.STATUS_DESC,
			PRJ_NO: el.orders[0].PRJ_NO,
			ORDER_NO: el.orders[0].ORDER_NO,
			IDS_DATE: el.orders[0].IDS_DATE,
			CUST_RQS: el.orders[0].CUST_RQS,
			DSTN: el.orders[0].DSTN,
			FINUSER: el.timeline.finusers[0].SNAME,
			QUO_DATE: el.quotation ? el.quotation.QUO_DATE : null,
		};

		delete row.details;
		delete row.maruser;
		delete row.status;
		delete row.shipment;
		delete row.orders;
		delete row.quotation;
		delete row.quotation;
		details.push(row);
	});
	return details;
};

async function inquirySupplier(data) {
	let suplier = "";
	const dt = data.details;
	dt.forEach((item) => {
		if (
			item.INQD_SUPPLIER !== null &&
			suplier.split(", ").indexOf(item.INQD_SUPPLIER) === -1
		) {
			suplier += item.INQD_SUPPLIER + ", ";
		}
	});
	return suplier.replace(/, $/, "");
}

async function inquirySecound(data) {
	const dt = data.details;
	let secound = 0;
	dt.forEach((item) => {
		if (item.INQD_SENDPART !== null) secound += 1;
	});
	return secound;
}

async function inquiryCountDwg(data) {
	const dt = data.details;
	let countdwg = 0;
	dt.forEach((item) => {
		if (item.INQD_DRAWING !== null && item.INQD_UNREPLY == null)
			countdwg += 1;
	});
	return countdwg;
}

async function inquiryValues(data) {
	const dt = data.details;
	let values = 0;
	dt.forEach((item) => {
		const qty = item.INQD_QTY !== null ? parseFloat(item.INQD_QTY) : 0;
		const price =
			item.INQD_UNIT_PRICE !== null
				? parseFloat(item.INQD_UNIT_PRICE)
				: 0;
		values += qty * price;
	});
	return values;
}
