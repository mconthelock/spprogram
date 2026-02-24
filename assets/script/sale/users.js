import "@amec/webasset/css/dataTable.min.css";
import { showLoader } from "@amec/webasset/preloader";
import { showMessage } from "@amec/webasset/utils";
import { createTable } from "@amec/webasset/dataTable";
import { getAppUsers } from "../service/index.js";
import { initApp, tableOpt } from "../utils.js";

var table;
$(document).ready(async () => {
	try {
		await showLoader();
		await initApp();
		const users = await getAppUsers();
		const result = users.filter((x) =>
			["SLG", "SLE"].includes(x.appsgroups.GROUP_CODE),
		);
		console.log(result);

		const opt = await tableUsersOption(result);
		table = await createTable(opt);
	} catch (error) {
		console.log(error);
		await showMessage(`Something went wrong.`);
	} finally {
		await showLoader({ show: false });
	}
});

async function tableUsersOption(data) {
	const opt = { ...tableOpt };
	opt.data = data;
	opt.columns = [
		{
			data: "employee",
			title: "Users",
			render: (data) => {
				//
				return `<div class="flex gap-3">
                    <div class="flex-none">
                        <div class="avatar">
                            <div class="ring-primary ring-offset-base-100 w-16 rounded-full ring-2 ring-offset-2">
                                <img src="https://img.daisyui.com/images/profile/demo/spiderperson@192.webp" />
                            </div>
                        </div>
                    </div>
                    <div class="flex-1">
                        <h1 class="font-bold mb-2">${data.SNAME} (${data.SEMPNO})</h1>
                        <h2>${data.SRECMAIL}</h2>
                    </div>
                </div>`;
			},
		},
		{
			data: "employee",
			title: "Users",
			render: (data) => {
				return "";
			},
		},
	];
	opt.initComplete = async function () {
		$("#datatable_loading").addClass("hidden");
	};
	return opt;
}
