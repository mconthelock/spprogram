import { init } from "../inquiry/source.js";
import { getStatus, getAppUsers } from "../service/master.js";
import { createBtn } from "@amec/webasset/components/buttons";

export const setSeries = async () => {
	const id = "#series";
	const data = await init.getSeries();
	$(`${id}`)
		.empty()
		.append(new Option("", "", false, false));
	data.map((el) => {
		$(`${id}`).append(new Option(el.text, el.id, false, false));
	});
};

export const setOrderType = async () => {
	const id = "#ordertype";
	const data = [
		{ id: "", value: "All" },
		{ id: "ELE", value: "Elevator" },
		{ id: "ESO", value: "EScalator" },
		{ id: "MOV", value: "Moving Walk" },
	];
	data.map((el) => {
		$(`${id}`).append(new Option(el.value, el.id, false, false));
	});
};

export const setTrader = async () => {
	const id = "#trader";
	const data = await init.getTraders();
	const traders = data.map((item) => item.id);
	const uniqueTraders = [...new Set(traders)];
	$(`${id}`)
		.empty()
		.append(new Option("", "", false, false));
	uniqueTraders.map((el) => {
		$(`${id}`).append(new Option(el, el, false, false));
	});
};

export const setAgent = async () => {
	const id = "#agent";
	const data = await init.getAgent();
	$(`${id}`)
		.empty()
		.append(new Option("", "", false, false));
	data.map((el) => {
		$(`${id}`).append(new Option(el.text, el.id, false, false));
	});
};

export const setCountry = async () => {
	const id = "#country";
	const data = await init.getCountries();
	$(`${id}`)
		.empty()
		.append(new Option("", "", false, false));
	data.map((el) => {
		$(`${id}`).append(new Option(el.text, el.id, false, false));
	});
};

export const setStatus = async () => {
	const id = "#status";
	const data = await getStatus();
	$(`${id}`)
		.empty()
		.append(new Option("", "", false, false));
	data.map((el) => {
		$(`${id}`).append(
			new Option(el.STATUS_ACTION, el.STATUS_ID, false, false),
		);
	});
};

export const setSaleEngineer = async () => {
	const id = "#se_engineer";
	let users = await getAppUsers();
	users = users.filter((u) =>
		["SLG", "SLE"].includes(u.appsgroups?.GROUP_CODE),
	);
	$(`${id}`)
		.empty()
		.append(new Option("", "", false, false));
	users.map((el) => {
		$(`${id}`).append(
			new Option(
				`${el.data.SNAME} (${el.data.SEMPNO})`,
				el.data.SEMPNO,
				false,
				false,
			),
		);
	});
};

export const setReportButton = async () => {
	const search = await createBtn({
		id: "search",
		title: "Search",
		icon: "fi fi-ts-assessment text-xl",
		className: `bg-accent text-white hover:shadow-lg`,
	});

	const reset = await createBtn({
		id: "reset-report",
		title: "Reset",
		icon: "ffi fi-br-refresh text-xl",
		className: `btn-outline btn-accent hover:shadow-lg hover:text-white`,
	});
	$("#btn-container").append(` ${search} ${reset}`);
};
