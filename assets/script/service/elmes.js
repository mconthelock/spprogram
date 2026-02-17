export const getElmesItem = async (ordno, item) => {
	return new Promise((resolve, reject) => {
		$.ajax({
			url: `${process.env.APP_API}/elmes/gplitem/item/${ordno}/${item}`,
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

export const getElmesDrawing = async (data) => {
	return new Promise((resolve, reject) => {
		$.ajax({
			url: `${process.env.APP_API}/elmes/gplitem/drawing`,
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

export const getSecondItem = async (ordno, item) => {
	return new Promise((resolve, reject) => {
		$.ajax({
			url: `${process.env.APP_API}/elmes/secondary/search/`,
			type: "POST",
			dataType: "json",
			data: { ORDERNO: ordno, ITEMNO: item },
			success: function (response) {
				resolve(response);
			},
			error: function (error) {
				reject(error);
			},
		});
	});
};
