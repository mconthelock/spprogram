import "select2/dist/css/select2.min.css";
import "@amec/webasset/css/select2.min.css";

import dayjs from "dayjs";
import { showLoader } from "@amec/webasset/preloader";
import { showMessage } from "@amec/webasset/utils";
import { createBtn, activatedBtn } from "@amec/webasset/components/buttons";
import { getBase64Image } from "@amec/webasset/api/file";
import {
	dragDropInit,
	dragDropListImage,
	handleFiles,
} from "@amec/webasset/dragdrop";
import { getCustomer } from "../service/customers.js";
import { getPriceList, updatePriceList } from "../service/pricelist.js";
import * as items from "../service/items.js";
import { initApp } from "../utils.js";

$(async function () {
	try {
		await showLoader({ show: true });
		await initApp({ submenu: ".navmenu-price" });
		const customer = await listCustomer();
		const category = await listCategory();
		const dropdown = await setItemDetail();
	} catch (error) {
		console.log(error);
		await showMessage(error);
	} finally {
		await showLoader({ show: false });
	}
});

async function setItemDetail() {
	const save = await createBtn({
		id: "save-data",
		title: "Save Data",
		icon: "fi fi-sr-disk text-xl",
		className: `bg-primary text-white`,
		other: `data-action="${$("#itemid").val() == "" ? "add" : "edit"}"`,
	});

	const back = await createBtn({
		id: "back-to-list",
		type: "link",
		href: `${process.env.APP_ENV}/mar/items/`,
		title: "Back to List",
		icon: "fi fi-sr-arrow-left text-xl",
		className: `bg-accent text-white`,
	});
	$("#action-row").append(`${save}${back}`);

	if ($("#itemid").val() == "") {
		const el = await dragDropInit({
			showImg: true,
			format: "image",
			multiple: false,
		});
		$("#image-dropzone").append(el);
		return;
	}
	try {
		const data = await items.getItems({ ITEM_ID: $("#itemid").val() });
		for (const [key, value] of Object.entries(data[0])) {
			$(`.field-data[data-map="${key}"]`).val(value);
		}

		const prices = data[0].prices;
		if (prices.length > 0) {
			const latestPrice = prices.filter((price) => price.LATEST === "1");
			if (latestPrice.length > 0) {
				for (const [key, value] of Object.entries(latestPrice[0])) {
					$(`.field-data[data-map="${key}"]`).val(value);
				}
			}
		}

		const customers = data[0].itemscustomer;
		if (customers.length > 0) {
			customers.map((customer) => {
				$(`#customer input[type="checkbox"]`).each(function () {
					if ($(this).val() == customer.CUSTOMER_ID) {
						$(this).prop("checked", true);
					}
				});
			});
		}
		let list = "";
		if (data[0].ITEM_THUMB) {
			const filePath = `${process.env.FILE_IMG}/directsales/${data[0].ITEM_THUMB}`;
			const images = await getBase64Image(filePath);
			list += await dragDropListImage({
				src: images,
				fromDB: true,
			});
		}

		const el = await dragDropInit({
			showImg: true,
			format: "image",
			list: list,
			multiple: false,
		});
		$("#image-dropzone").append(el);
	} catch (error) {
		console.log(error);
		await showErrorMessage(`Something went wrong.`, "2036");
	}
}

async function listCustomer() {
	try {
		const customer_list = await getCustomer();
		let customer_html = ``;
		customer_list.map((customer) => {
			customer_html += `<li class="w-full flex gap-3 flex-row mb-3">
        <input type="checkbox" class="checkbox checkbox-primary text-white" value="${customer.CUS_ID}" />${customer.CUS_NAME}
        </li>`;
		});
		$("#customer").html(customer_html);
	} catch (error) {
		console.log(error);
		await showErrorMessage(`Something went wrong.`, "2036");
	}
}

async function listCategory() {
	try {
		const category = await items.getItemsCategory({});
		category
			.filter((cat) => cat != null)
			.map((cat) => {
				$("#item-category").append(
					`<option class="text-xs" value="${cat.CATE_ID}">${cat.CATE_NAME}</option>`,
				);
			});
	} catch (error) {
		console.log(error);
		await showErrorMessage(`Something went wrong.`, "2036");
	}
}

$(document).on("click", "#save-data", async function () {
	let isValid = true;
	let id;
	$(".field-data.req").each(function () {
		if ($(this).val() == "" || $(this).val() == null) {
			$(this).addClass("input-error");
			isValid = false;
		} else {
			$(this).removeClass("input-error");
		}
	});
	if (!isValid) {
		await showMessage("Please fill in all required fields.", "warning");
		return;
	}
	try {
		const action = $(this).attr("data-action");
		let payload = {};
		$(".field-data").each(function () {
			const key = $(this).attr("data-map");
			const value = $(this).val();
			if (key == "ITEM_DWG" || key == "ITEM_VARIABLE")
				payload[key] = value.toUpperCase();
			else payload[key] = value;
		});

		if (action == "add") {
			payload = {
				...payload,
				ITEM_STATUS: 1,
				CREATE_AT: new Date().toISOString(),
				CREATE_BY: $("#user-login").attr("empname"),
			};
			const newitem = await items.createItems(payload);
			payload.ITEM_ID = newitem.ITEM_ID;
			await savePrice(payload);
			await saveImage(payload);
			await saveCustomer(payload);
			window.location.href = `${process.env.APP_ENV}/mar/items/detail/${payload.ITEM_ID}`;
		} else {
			payload = {
				...payload,
				ITEM_ID: $("#itemid").val(),
				UPDATE_AT: new Date().toISOString(),
				UPDATE_BY: $("#user-login").attr("empname"),
			};
			const updated = await items.updateItems(payload);
			await savePrice(payload);
			await saveImage(payload);
			await saveCustomer(payload);
			await showMessage(
				"Direct Sale's item saved successfully",
				"success",
			);
		}
	} catch (error) {
		console.log(error);
		await showErrorMessage(`Something went wrong.`, "2036");
	} finally {
		await showLoader({ show: false });
	}
});

async function savePrice(payload) {
	//Save Price
	let maxYear =
		dayjs().format("M") < 4
			? dayjs().format("YYYY") - 1
			: dayjs().format("YYYY");
	let maxPeriod = dayjs().format("M") < 4 ? 2 : 1;
	const lastest = await getPriceList({ LATEST: 1 });
	if (lastest.length > 0) {
		maxYear = Math.max(...lastest.map((p) => p.FYYEAR));
		maxPeriod = Math.max(...lastest.map((p) => p.PERIOD));
	}
	const prices = {
		FYYEAR: maxYear,
		PERIOD: maxPeriod,
		ITEM: payload.ITEM_ID,
		STATUS: 1,
		STARTIN: dayjs().format("YYYY-MM-DD HH:mm:ss"),
		INQUIRY: null,
		FCCOST: payload.FCCOST,
		FCBASE: payload.FCBASE,
		TCCOST: payload.TCCOST,
		LATEST: 1,
		CREATE_BY: $("#user-login").attr("empname"),
		CREATE_AT: new Date().toISOString(),
	};
	const responsePrice = await updatePriceList(prices);
	return responsePrice;
}

async function saveImage(payload) {
	//Save Item Detail
	const files = $("#files")[0].files;
	if (files.length > 0) {
		const photo = new FormData();
		photo.append("files", files[0], files[0].name);
		photo.append("ITEM_ID", payload.ITEM_ID);
		const responsePhoto = await items.uploadItemsPhoto(photo);
	} else {
		console.log("No image to upload");
		const updated = await items.updateItems({
			ITEM_ID: $("#itemid").val(),
			ITEM_THUMB: null,
		});
	}
	return;
}

async function saveCustomer(pageload) {
	//Save Customer
	const currentCustomers = await items.getItemsCustomer({
		ITEMS_ID: pageload.ITEM_ID,
	});
	$('#customer input[type="checkbox"]').each(async function () {
		const customerId = $(this).val();
		const isChecked = $(this).is(":checked");
		const existsInDb = currentCustomers.some(
			(c) => c.CUSTOMER_ID == customerId,
		);

		if (isChecked && !existsInDb) {
			// Insert new customer
			const newCusItem = {
				ITEMS_ID: pageload.ITEM_ID,
				CUSTOMER_ID: customerId,
				CREATE_BY: $("#user-login").attr("empname"),
				CREATE_AT: new Date().toISOString(),
			};
			await items.createItemsCustomer(newCusItem);
			console.log("Insert new customer", customerId);
		} else if (!isChecked && existsInDb) {
			// Delete existing customer
			await items.deleteItemsCustomer({
				ITEMS_ID: pageload.ITEM_ID,
				CUSTOMER_ID: customerId,
			});
			console.log("Delete existing customer", customerId);
		}
	});
	return;
}

$(document).on("change", ".price-change", async function (e) {
	e.preventDefault();
	const fccost = parseFloat($("#fccost").val()) || 0;
	const fcrate = parseFloat($("#fcrate").val()) || 0;
	const tccost = Math.ceil(fccost * fcrate);
	$("#tccost").val(tccost);
});

$(document).on("change", 'input[name="files"]', async function (e) {
	handleFiles();
});

$(document).on("click", "#back-to-list", async function (e) {
	e.preventDefault();
	const user = $("#user-login").attr("groupcode");
	if (user != "MAR") {
		window.location.href = `${process.env.APP_ENV}/fin/items`;
		return;
	}

	window.location.href = `${process.env.APP_ENV}/mar/items`;
});
