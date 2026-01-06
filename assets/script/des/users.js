import "datatables.net-responsive-dt/css/responsive.dataTables.min.css";
import "@amec/webasset/css/select2.min.css";
import "@amec/webasset/css/dataTable.min.css";
import moment from "moment";
import { createTable } from "@amec/webasset/dataTable";
import { displayEmpInfo, fillImages } from "@amec/webasset/indexDB";
import * as service from "../service/master.js";
import * as utils from "../utils.js";
import { getDesigner } from "./data.js";
var table;

$(async function () {
	try {
		await utils.initApp();
		let users = await service.getAppUsers();
		users = users.filter((u) =>
			["LDE", "DE"].includes(u.appsgroups?.GROUP_CODE)
		);
		const opt = await createUserTable(users);
		table = await createTable(opt, {
			buttonFilter: { status: true, column: "2" },
		});
	} catch (error) {
		console.log(error);
	} finally {
		await utils.showLoader({ show: false });
	}
});

async function createUserTable(users = []) {
	const designer = await getDesigner();
	const opt = { ...utils.tableOpt };
	opt.data = users;
	opt.pageLength = 15;
	opt.order = [[0, "desc"]];
	opt.dom = `<"flex items-center mb-3"<"table-search flex flex-1 gap-5"f><"flex items-center table-option"l>><"bg-white border border-slate-300 rounded-2xl overflow-hidden"t><"flex mt-5 mb-3"<"table-info flex flex-col flex-1 gap-5"i><"table-page flex-none"p>>`;
	opt.columns = [
		{
			data: "USERS_ID",
			render: (data, type, row) => {
				if (type === "display") {
					const emp = row.data;
					return `<div class="flex items-center gap-5">
          <div class="flex-none">
            <div class="avatar">
                <div class="ring-primary ring-offset-base-100 w-10 rounded-full ring-2 ring-offset-2">
                    <img src="" id="image-${data}" class="hidden" />
                    <div class="skeleton h-8 w-8"></div>
                </div>
            </div>
          </div>
          <div class="flex-1 flex flex-col gap-2">
            <div class="text-start font-bold">${emp.SNAME}</div>
            <div class="text-start text-xs text-gray-600">${emp.SEMPNO} - ${emp.SPOSNAME}</div>
          </div>`;
				}
				return data;
			},
		},
		{ data: "data.SDEPT" },
		{ data: "data.SSEC" },
		{
			data: "USERS_ID",
			sortable: false,
			render: (data, type) => {
				if (type === "display") {
					const des = designer.find(
						(d) => d.DES_USER === data && d.DES_GROUP === "1"
					);
					return `<input type="radio" name="radio-${data}" class="radio radio-neutral design-group" value="1" ${
						des ? "checked" : ""
					} />`;
				}
				return data;
			},
		},
		{
			data: "USERS_ID",
			sortable: false,
			render: (data, type) => {
				if (type === "display") {
					const des = designer.find(
						(d) => d.DES_USER === data && d.DES_GROUP === "2"
					);
					return `<input type="radio" name="radio-${data}" class="radio radio-neutral design-group" value="2" ${
						des ? "checked" : ""
					} />`;
				}
				return data;
			},
		},
		{
			data: "USERS_ID",
			sortable: false,
			render: (data, type) => {
				if (type === "display") {
					const des = designer.find(
						(d) => d.DES_USER === data && d.DES_GROUP === "3"
					);
					return `<input type="radio" name="radio-${data}" class="radio radio-neutral design-group" value="3" ${
						des ? "checked" : ""
					} />`;
				}
				return data;
			},
		},
		{
			data: "USERS_ID",
			sortable: false,
			render: (data, type) => {
				if (type === "display") {
					const des = designer.find(
						(d) => d.DES_USER === data && d.DES_GROUP === "6"
					);
					return `<input type="radio" name="radio-${data}" class="radio radio-neutral design-group" value="6" ${
						des ? "checked" : ""
					} />`;
				}
				return data;
			},
		},
		{
			data: "USERS_ID",
			sortable: false,
			render: (data, type) => {
				if (type === "display") {
					const des = designer.find((d) => d.DES_USER === data);
					return `<input type="checkbox" class="checkbox checkbox-neutral engineer" id="engineer-${data}" ${
						des && des.DES_ENGINEER === "1" ? "checked" : ""
					} />`;
				}
				return data;
			},
		},
		{
			data: "USERS_ID",
			sortable: false,
			render: (data, type) => {
				if (type === "display") {
					const des = designer.find((d) => d.DES_USER === data);
					return `<input type="checkbox" class="checkbox checkbox-neutral checker" id="checker-${data}" ${
						des && des.DES_CHECKER === "1" ? "checked" : ""
					}/>`;
				}
				return data;
			},
		},
	];
	opt.createdRow = async function (row, data) {
		const emp = await displayEmpInfo(data.USERS_ID);
		const element = $(row).find(`#image-${data.USERS_ID}`);
		await fillImages(element, data.USERS_ID);
	};
	return opt;
}

$(document).on("change", ".design-group", async function () {
	const tr = $(this).closest("tr");
	const data = table.row(tr).data();
	const group = $(this).val();
	await updateDesigner(data.USERS_ID, { DES_GROUP: group });
	await utils.showMessage("Update designer group successfully", "success");
});

$(document).on("click", ".engineer", async function () {
	const tr = $(this).closest("tr");
	const data = table.row(tr).data();
	const value = $(this).is(":checked") ? 1 : null;
	await updateDesigner(data.USERS_ID, { DES_ENGINEER: value });
	await utils.showMessage("Update designer group successfully", "success");
});

$(document).on("click", ".checker", async function () {
	const tr = $(this).closest("tr");
	const data = table.row(tr).data();
	const value = $(this).is(":checked") ? 1 : null;
	await updateDesigner(data.USERS_ID, { DES_CHECKER: value });
	await utils.showMessage("Update designer group successfully", "success");
});

async function updateDesigner(id, data) {
	return new Promise((resolve, reject) => {
		$.ajax({
			url: `${process.env.APP_API}/sp/designer/${id}`,
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
}
