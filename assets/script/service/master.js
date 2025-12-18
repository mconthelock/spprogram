import { displayEmpInfo } from "@indexDB";
export function getPriceRatio() {
	return new Promise((resolve, reject) => {
		$.ajax({
			url: `${process.env.APP_API}/sp/priceratio`,
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

export function findPriceRatio(data) {
	return new Promise((resolve, reject) => {
		$.ajax({
			url: `${process.env.APP_API}/sp/priceratio/find`,
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
}

export function statusPriceRatio(data) {
	return new Promise((resolve, reject) => {
		$.ajax({
			url: `${process.env.APP_API}/sp/priceratio/status`,
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
}

export function createPriceRatio(data) {
	return new Promise((resolve, reject) => {
		$.ajax({
			url: `${process.env.APP_API}/sp/priceratio/create`,
			type: "POST",
			dataType: "json",
			data: data,
			success: function (response) {
				resolve(response);
			},
			error: function (error) {
				console.log(error);

				reject(error);
			},
		});
	});
}

export function getQuotationType() {
	return new Promise((resolve, reject) => {
		$.ajax({
			url: `${process.env.APP_API}/sp/quotationtype`,
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

export function createQuotationType(data) {
	return new Promise((resolve, reject) => {
		$.ajax({
			url: `${process.env.APP_API}/sp/quotationtype/create`,
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
}

export function getShipments() {
	return new Promise((resolve, reject) => {
		$.ajax({
			url: `${process.env.APP_API}/sp/shipment/`,
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

export function getDeliveryTerm() {
	return new Promise((resolve, reject) => {
		$.ajax({
			url: `${process.env.APP_API}/sp/term/`,
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

export function getMethod() {
	return new Promise((resolve, reject) => {
		$.ajax({
			url: `${process.env.APP_API}/sp/method/`,
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

export const getCurrency = async () => {
	return new Promise((resolve, reject) => {
		$.ajax({
			url: `${process.env.APP_API}/sp/currency`,
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

export const updateCurrency = async (data) => {
	return new Promise((resolve, reject) => {
		$.ajax({
			url: `${process.env.APP_API}/sp/currency/update`,
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

export const getControl = async () => {
	return new Promise((resolve, reject) => {
		$.ajax({
			url: `${process.env.APP_API}/sp/controler/`,
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

export const updateController = async (data) => {
	return new Promise((resolve, reject) => {
		$.ajax({
			url: `${process.env.APP_API}/sp/controler/update/`,
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

export const getReason = async () => {
	return new Promise((resolve, reject) => {
		$.ajax({
			url: `${process.env.APP_API}/sp/reason/`,
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

export const getAppUsers = async () => {
	return new Promise((resolve, reject) => {
		$.ajax({
			url: `${process.env.APP_API}/docinv/appsusers/program/${process.env.APP_ID}`,
			type: "GET",
			dataType: "json",
			success: async function (response) {
				try {
					const user = await Promise.all(
						response.map(async (el) => {
							const data = await displayEmpInfo(el.USERS_ID);
							return { ...el, data };
						})
					);
					resolve(user);
				} catch (err) {
					reject(err);
				}
			},
			error: function (error) {
				reject(error);
			},
		});
	});
};

export const getStatus = async () => {
	return new Promise((resolve, reject) => {
		$.ajax({
			url: `${process.env.APP_API}/sp/status/all/`,
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
