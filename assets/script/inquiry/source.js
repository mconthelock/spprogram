import { dateToSchedule } from "@amec/webasset/utils";
import * as mst from "../service/master.js";
import * as mkt from "../service/mkt.js";
import * as inq from "../service/inquiry.js";
import * as cus from "../service/customers.js";
import * as utils from "../utils.js";

export const init = {
	getTraders: async function () {
		const data = await mst.getPriceRatio();
		const traders = data.map((item) => item.TRADER);
		const uniqueTraders = [...new Set(traders)];
		let options = uniqueTraders.map((trader) => {
			return {
				id: trader,
				text: trader,
			};
		});
		return options;
	},

	getQuoType: async function () {
		const data = await mst.getQuotationType();
		let options = data.map((type) => {
			return {
				id: type.QUOTYPE_ID,
				text: type.QUOTYPE_DESC,
			};
		});
		return options;
	},

	getShipment: async function () {
		const data = await mst.getShipments();
		let options = data.map((shp) => {
			return {
				id: shp.SHIPMENT_ID,
				text: shp.SHIPMENT_DESC,
			};
		});
		return options;
	},

	getCurrency: async function () {
		const data = await mst.getCurrency();
		const currency = data.filter((item) => item.CURR_LATEST == "1");
		let options = currency.map((cur) => {
			return {
				id: cur.CURR_CODE,
				text: cur.CURR_CODE,
			};
		});
		return options;
	},

	getDeliveryTerm: async function () {
		const data = await mst.getDeliveryTerm();
		let options = data.map((term) => {
			return {
				id: term.TERM_ID,
				text: term.TERM_DESC,
			};
		});
		return options;
	},

	getMethod: async function () {
		const data = await mst.getMethod();
		let options = data.map((method) => {
			return {
				id: method.METHOD_ID,
				text: method.METHOD_DESC,
			};
		});
		return options;
	},

	getAgent: async function () {
		const data = await mkt.getAgent();
		const agents = data.filter((item) => item.STATUS == "Enabled");
		let options = agents.map((agent) => {
			return {
				id: `${agent.AGENT} (${agent.country.CTNAME})`,
				text: `${agent.AGENT} (${agent.country.CTNAME})`,
			};
		});
		return options;
	},

	getCountries: async function () {
		const data = await mkt.getCountries();
		let options = data.map((country) => {
			return {
				id: country.CTNAME,
				text: country.CTNAME,
			};
		});
		return options;
	},

	getSeries: async function () {
		const data = await mkt.getSeries();
		let options = data.map((series) => {
			return {
				id: series.ABBREVIATION,
				text: series.ABBREVIATION,
			};
		});
		return options;
	},

	getCustomers: async function () {
		const data = await cus.getCustomer();
		let options = data.map((customer) => {
			return {
				id: customer.CUS_ID,
				text: customer.CUS_DISPLAY,
			};
		});
		return options;
	},

	getMarPerson: async function () {
		const data = await mst.getAppUsers();
		const result = data.filter((x) =>
			["MAR"].includes(x.appsgroups.GROUP_CODE),
		);
		let options = result.map((el) => {
			const emp = el.data;
			const name = emp.SNAME.replace(/  /g, " ").toLowerCase();
			const sname = name.split(" ");
			const fname = sname[0].charAt(0).toUpperCase() + sname[0].slice(1);
			const lname = sname[1].charAt(0).toUpperCase() + sname[1].slice(1);
			return {
				id: el.USERS_ID,
				text: `${fname} ${lname}`,
			};
		});
		return options;
	},

	getSalePerson: async function () {
		const data = await mst.getAppUsers();
		const result = data.filter((x) =>
			["SEG", "SEL"].includes(x.appsgroups.GROUP_CODE),
		);
		let options = result.map((sale) => {
			const group = sale.appsgroups.GROUP_CODE;
			const emp = sale.data;
			const name = emp.SNAME.replace(/  /g, " ").toLowerCase();
			const sname = name.split(" ");
			const fname = sname[0].charAt(0).toUpperCase() + sname[0].slice(1);
			const lname = sname[1].charAt(0).toUpperCase() + sname[1].slice(1);
			return {
				id: sale.USERS_ID,
				text: `${fname} ${lname}`,
			};
		});
		return options;
	},
};

export const events = {
	//Original Project
	handleProjectChange: async (e) => {
		const obj = e.target;
		const loader = $(obj).closest(".input").find(".loading");
		loader.removeClass("hidden");

		const q = { PRJ_NO: obj.value.toUpperCase() };
		let data = await mkt.getMainProject(q);
		if (data.length == 0) data = await mkt.getPartProject(q);
		if (data.length == 0) data = await mkt.getDummyProject(q);
		// if (data.length == 0) data = await mkt.getCubeProject(q);
		if (data.length > 0) {
			const values = data[0];
			for (const key in values) {
				if ($('input[data-mapping="' + key + '"]').length > 0) {
					const input = $('input[data-mapping="' + key + '"]');
					if (input.attr("id") == "schedule") {
						const val = await dateToSchedule(values[key]);
						input.val(val);
					} else {
						input.val(values[key]);
					}
				}

				if ($('select[data-mapping="' + key + '"]').length > 0) {
					let val = values[key];
					const selected = $('select[data-mapping="' + key + '"]');
					if (selected.attr("id") == "agent") {
						const ops = new Set();
						const agents = new Set();
						const countries = new Set();
						val = `${values.AGENT} (${values.DSTN})`;
						selected.find(`option`).map((i, op) => {
							if ($(op).val() != "") {
								ops.add($(op).val());
								agents.add($(op).val().split("(")[0].trim());
								countries.add(
									$(op).val().split("(")[1].replace(")", ""),
								);
							}
						});
						if (ops.has(val)) {
							$('select[data-mapping="' + key + '"]').val(val);
							$('select[data-mapping="' + key + '"]').trigger(
								"change",
							);
						} else {
							const agentMaster = await mkt.getAgent();
							if (agents.has(values.AGENT)) {
								const agn = agentMaster.find(
									(x) => x.AGENT == values.AGENT,
								);
								val = `${agn.AGENT} (${agn.country.CTNAME})`;
								$('select[data-mapping="' + key + '"]').val(
									val,
								);
								$('select[data-mapping="' + key + '"]').trigger(
									"change",
								);
							}

							if (countries.has(values.DSTN)) {
								const cnty = agentMaster.find(
									(x) => x.country.CTNAME == values.DSTN,
								);
								val = `${cnty.AGENT} (${cnty.country.CTNAME})`;
								$('select[data-mapping="' + key + '"]').val(
									val,
								);
								$('select[data-mapping="' + key + '"]').trigger(
									"change",
								);
							}
						}
					} else {
						$('select[data-mapping="' + key + '"]').val(val);
						$('select[data-mapping="' + key + '"]').trigger(
							"change",
						);
					}
				}
			}
		}
		$("#inquiry-no").focus().select();
		loader.addClass("hidden");
	},

	handleInquiryChange: async (e) => {
		const settting = (val) => {
			if (val == undefined) return;
			$("#trader").val(val.CNT_TRADER).trigger("change");
			$("#quotation-type").val(val.CNT_QUOTATION).trigger("change");
			$("#delivery-method").val(val.CNT_METHOD).trigger("change");
			$("#delivery-term").val(val.CNT_TERM).trigger("change");
			$("#inq-leadtime").val("1").trigger("change");
		};

		const obj = e.target;
		if ($(obj).hasClass("stockpart")) {
			$("#project-no").val(obj.value.toUpperCase());
			return;
		}

		const loader = $(obj).closest(".input").find(".loading");
		loader.removeClass("hidden");
		const values = await utils.setInquiryNo(obj.value);
		obj.value = values;

		const controller = await mst.getControl();
		const prefix = controller.find(
			(clt) => clt.CNT_PREFIX == values.substring(0, 5).toUpperCase(),
		);

		if (prefix !== undefined) {
			await settting(prefix);
		} else {
			if ($("#agent").val() !== null) {
				const agent = $("#agent").val().split("(")[0].trim();
				const anyprefix = controller.find(
					(clt) => clt.CNT_AGENT == agent && clt.CNT_PREFIX == "Any",
				);
				await settting(anyprefix);
			}
		}

		const inquiry = await inq.getInquiry({ INQ_NO: values });
		if (inquiry.length > 0) {
			await showMessage(`Inquiry ${values} is already exist!`);
			$("#inquiry-no").focus().select();
			loader.addClass("hidden");
			return;
		}

		loader.addClass("hidden");
	},

	handleRatioChange: (e) => {},

	handleCustomerChange: async (e) => {
		const obj = e.target;
		const data = await cus.getCustomer();
		const customers = data.find((item) => item.CUS_ID == obj.value);
		$("#project-name").val(customers.CUS_NAME + " STOCK");
		$("#trader").val("Direct").change();
		const agent = customers.CUS_AGENT + " (" + customers.CUS_COUNTRY + ")";
		$("#agent").val(agent).change();
		$("#country").val(customers.CUS_COUNTRY).change();

		$("#quotation-type").val(customers.CUS_QUOTATION).change();
		$("#delivery-term").val(customers.CUS_TERM).change();
		$("#delivery-method").val(2).change();
		$("#inq-leadtime").val(customers.CUS_LT).change();
		$("#currency").val(customers.CUS_CURENCY).change();

		$("#add-item").removeClass("btn-disabled");
		$("#inquiry-no").focus().select();
	},
};

export const stockHeader = async (name, item) => {
	//   const str = name.split("_");
	const customers = await cus.getCustomer();
	const value = customers.find((item) => item.CUS_NAME == name);
	if (value !== undefined) {
		$("#project-no").val(`${value.CUS_DISPLAY} STOCK`);
		$("#project-name").val(`${value.CUS_DISPLAY} STOCK`);
		$("#shop-order").val(`-`);
		const series = item >= 6 ? "JSW" : "GQXL3";
		const operation = item >= 6 ? "B2" : "2BC";
		const spec = item >= 6 ? "1200/JS-SE/03500/30" : "P1000-CO-060,05S/O";
		$("#series").val(series).trigger("change");
		$("#operation").val(operation);
		$("#spec").val(spec);
		$("#schedule").val(`201505Y`);

		const agent = `${value.CUS_AGENT} (${value.CUS_COUNTRY})`;
		$("#agent").val(agent).trigger("change");
		$("#country").val(value.CUS_COUNTRY).trigger("change");
	}
};

export const projectConclude = async (data) => {
	let q = {};
	if (data.mfgno) q = { SMFG_NO: data.mfgno };
	else q = { PRJ_NO: data.prjno, CAR_NO: data.carno };

	let prjdata = await mkt.getMainProject(q);
	if (prjdata.length == 0) await mkt.getPartProject(q);
	if (prjdata.length == 0) await mkt.getDummyProject(q);
	return prjdata;
};
