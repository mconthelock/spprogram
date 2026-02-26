import "select2/dist/css/select2.min.css";
import "@amec/webasset/css/select2.min.css";

import dayjs from "dayjs";
import { showLoader } from "@amec/webasset/preloader";
import { showMessage } from "@amec/webasset/utils";
import { createBtn, activatedBtnRow } from "@amec/webasset/components/buttons";
import {
	getItems,
	createItems,
	updateItems,
	getPriceList,
	updatePriceList,
} from "../service/index.js";
import { initApp } from "../utils.js";

$(async function () {
	try {
		await showLoader({ show: true });
		await initApp({ submenu: ".navmenu-price" });
		await setItemDetail();
		await setupButton();
	} catch (error) {
		console.log(error);
		await showMessage(`Something went wrong.`);
	} finally {
		await showLoader({ show: false });
	}
});

async function setItemDetail() {
	try {
		if ($("#itemid").val() == "") return;
		const data = await getItems({ ITEM_ID: $("#itemid").val() });
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
	} catch (error) {
		console.log(error);
		await showMessage(`Something went wrong.`);
	}
}

async function setupButton() {
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
		href: `${process.env.APP_ENV}/fin/items/`,
		title: "Back to List",
		icon: "fi fi-sr-arrow-left text-xl",
		className: `bg-accent text-white`,
	});
	$("#btn-container").append(save, back);
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
		await showMessage("Please fill in all required fields.");
		return;
	}

	try {
		await showLoader({ show: true });
		await activatedBtnRow($(this));
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
				CREATE_AT: new Date(),
				CREATE_BY: $("#user-login").attr("empname"),
			};
			const newitem = await createItems(payload);
			payload.ITEM_ID = newitem.ITEM_ID;
			await savePrice(payload);
			window.location.href = `${process.env.APP_ENV}/fin/items/detail/${payload.ITEM_ID}`;
		} else {
			payload = {
				...payload,
				ITEM_ID: $("#itemid").val(),
				UPDATE_AT: new Date(),
				UPDATE_BY: $("#user-login").attr("empname"),
			};
			await updateItems(payload);
			await savePrice(payload);
			await showMessage(
				"Direct Sale's item saved successfully",
				"success",
			);
		}
	} catch (error) {
		console.log(error);
		await showMessage(`Something went wrong.`);
		await activatedBtnRow($(this), false);
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

$(document).on("change", ".price-change", async function (e) {
	e.preventDefault();
	const fccost = parseFloat($("#fccost").val()) || 0;
	const fcrate = parseFloat($("#fcrate").val()) || 0;
	const tccost = Math.ceil(fccost * fcrate);
	$("#tccost").val(tccost);
});
