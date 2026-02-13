import { dateToSchedule, showMessage } from "@amec/webasset/utils";
import * as srv from "../service/index.js";
// import * as mst from "../service/master.js";
// import * as mkt from "../service/mkt.js";
// import * as inq from "../service/inquiry.js";
// import * as cus from "../service/customers.js";
import { setInquiryNo } from "../utils.js";

export const init = {
	getTraders: async function () {
		const data = await srv.getPriceRatio();
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
		const data = await srv.getQuotationType();
		let options = data.map((type) => {
			return {
				id: type.QUOTYPE_ID,
				text: type.QUOTYPE_DESC,
			};
		});
		return options;
	},

	getShipment: async function () {
		const data = await srv.getShipments();
		let options = data.map((shp) => {
			return {
				id: shp.SHIPMENT_ID,
				text: shp.SHIPMENT_DESC,
			};
		});
		return options;
	},

	getCurrency: async function () {
		const data = await srv.getCurrency();
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
		const data = await srv.getDeliveryTerm();
		let options = data.map((term) => {
			return {
				id: term.TERM_ID,
				text: term.TERM_DESC,
			};
		});
		return options;
	},

	getMethod: async function () {
		const data = await srv.getMethod();
		let options = data.map((method) => {
			return {
				id: method.METHOD_ID,
				text: method.METHOD_DESC,
			};
		});
		return options;
	},

	getAgent: async function () {
		const data = await srv.getAgent();
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
		const data = await srv.getCountries();
		let options = data.map((country) => {
			return {
				id: country.CTNAME,
				text: country.CTNAME,
			};
		});
		return options;
	},

	getSeries: async function () {
		const data = await srv.getSeries();
		let options = data.map((series) => {
			return {
				id: series.ABBREVIATION,
				text: series.ABBREVIATION,
			};
		});
		return options;
	},

	getCustomers: async function () {
		const data = await srv.getCustomer();
		let options = data.map((customer) => {
			return {
				id: customer.CUS_ID,
				text: customer.CUS_DISPLAY,
			};
		});
		return options;
	},

	getMarPerson: async function () {
		const data = await srv.getAppUsers();
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
		const data = await srv.getAppUsers();
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
		let data = await srv.getMainProject(q);
		if (data.length == 0) data = await srv.getPartProject(q);
		if (data.length == 0) data = await srv.getDummyProject(q);
		// if (data.length == 0) data = await srv.getCubeProject(q);
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
							const agentMaster = await srv.getAgent();
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
		const values = await setInquiryNo(obj.value);
		obj.value = values;

		const controller = await srv.getControl();
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

		const inquiry = await srv.getInquiry({ INQ_NO: values });
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
		const data = await srv.getCustomer();
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

		if ($.fn.dataTable.isDataTable("#table")) {
			var tableEl = $("#table").DataTable();
			// tableEl.rows().every(function () {
			// 	this.remove().draw();
			// });

			tableEl.data().clear().draw();
		}
	},

	handleQuotationChange: async (e) => {
		const obj = e.target;
		const trader = $("#trader").val();
		const quotation = obj.value;
		const data = await srv.findPriceRatio({
			QUOTATION: quotation,
			TRADER: trader,
		});

		if ($.fn.dataTable.isDataTable("#table")) {
			var tableEl = $("#table").DataTable();
			if (data.length > 0) {
				$("#currency").val(data[0].CURRENCY).trigger("change");
				$("#tccurrency").val(data[0].SUPPLIER_CUR).trigger("change");
				tableEl.rows().every(function () {
					var d = this.data();
					data.forEach((dm) => {
						if (d.INQD_SUPPLIER == dm.SUPPLIER) {
							d.INQD_TC_BASE = dm.FORMULA;
							this.data(d).draw();
						}
					});
				});
			} else {
				tableEl.rows().every(function () {
					var d = this.data();
					d.INQD_TC_BASE = 0;
					this.data(d).draw();
				});
			}
		}
	},
};
