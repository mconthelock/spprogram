import dayjs from "dayjs";
import { displayEmpInfo } from "@amec/webasset/indexDB";
import { nextWorkingDay, countWorkingDay } from "../service/index.js";
import { getStatus } from "../service/index.js";
export async function getDesigner() {
	return new Promise((resolve, reject) => {
		$.ajax({
			url: `${process.env.APP_API}/sp/designer/all`,
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

export async function getDesignerGroup() {
	const user = $("#user-login").attr("empno");
	const designer = await getDesigner();
	return designer.find((d) => d.DES_USER == user);
}

export const dataExports = async (data) => {
	const details = [];
	const statusMap = await getStatus();
	const deName = async (id) => {
		if (id == null) return "";
		const des = await displayEmpInfo(id);
		return des ? des.SNAME : "";
	};

	const deFinish = (data) => {
		let finishDate = null;
		for (const key in data) {
			if (finishDate == null) {
				finishDate =
					data[key].INQG_CHK_DATE == null
						? null
						: dayjs(data[key].INQG_CHK_DATE).format(
								"YYYY-MM-DD HH:mm:ss",
							);
				continue;
			}

			if (data[key].INQG_CHK_DATE == null) continue;

			if (dayjs(data[key].INQG_CHK_DATE) > dayjs(finishDate)) {
				finishDate = dayjs(data[key].INQG_CHK_DATE).format(
					"YYYY-MM-DD HH:mm:ss",
				);
			}
		}
		return finishDate;
	};

	for (const el of data) {
		const des_finish = el.INQ_STATUS < 30 ? null : deFinish(el.inqgroup);
		let row = {
			...el,
			MARUSER: el.maruser.SNAME,
			STATUS_DESC: el.status.STATUS_DESC,
			NEXT_WORKING_DAY: await nextWorkingDay(el, 4),
			IS_ELEVATOR: el.inqgroup.some((g) => g.INQG_GROUP == 6) ? "" : "P",
			DES_FINISH: des_finish,
			DES_TIME: await countWorkingDay(el.timeline.DE_READ, des_finish),
			SALE_LEADER: await deName(el.timeline.SG_USER),
			SALE_USER: await deName(el.timeline.SE_USER),
		};
		const eme = el.inqgroup.filter((g) => g.INQG_GROUP == 1);
		if (eme.length > 0) {
			row = {
				...row,
				IS_EME: "P",
				EME_REV: eme[0].INQG_REV,
				EME_STATUS:
					statusMap.find((s) => s.STATUS_ID == eme[0].INQG_STATUS)
						?.STATUS_ACTION || "",
				EME_CLASS: eme[0].INQG_CLASS,
				EME_ASGDATE: eme[0].INQG_ASG_DATE,
				EME_ASGUSER: await deName(eme[0].INQG_ASG),
				EME_DESDATE: eme[0].INQG_DES_DATE,
				EME_DESUSER: await deName(eme[0].INQG_DES),
				EME_CHK_DATE: eme[0].INQG_CHK_DATE,
				EME_CHK_USER: await deName(eme[0].INQG_CHK),
				EME_REMARK: eme[0].INQG_DES_REASON,
				EME_TIME: await countWorkingDay(
					el.timeline.DE_READ,
					eme[0].INQG_CHK_DATE,
				),
			};
		}

		const eel = el.inqgroup.filter((g) => g.INQG_GROUP == 2);
		if (eel.length > 0) {
			row = {
				...row,
				IS_EEL: "P",
				EEL_REV: eel[0].INQG_REV,
				EEL_STATUS:
					statusMap.find((s) => s.STATUS_ID == eel[0].INQG_STATUS)
						?.STATUS_ACTION || "",
				EEL_CLASS: eel[0].INQG_CLASS,
				EEL_ASGDATE: eel[0].INQG_ASG_DATE,
				EEL_ASGUSER: await deName(eel[0].INQG_ASG),
				EEL_DESDATE: eel[0].INQG_DES_DATE,
				EEL_DESUSER: await deName(eel[0].INQG_DES),
				EEL_CHK_DATE: eel[0].INQG_CHK_DATE,
				EEL_CHK_USER: await deName(eel[0].INQG_CHK),
				EEL_REMARK: eel[0].INQG_DES_REASON,
				EEL_TIME: await countWorkingDay(
					el.timeline.DE_READ,
					eel[0].INQG_CHK_DATE,
				),
			};
		}

		const eap = el.inqgroup.filter((g) => g.INQG_GROUP == 3);
		if (eap.length > 0) {
			row = {
				...row,
				IS_EAP: "P",
				EAP_REV: eap[0].INQG_REV,
				EAP_STATUS:
					statusMap.find((s) => s.STATUS_ID == eap[0].INQG_STATUS)
						?.STATUS_ACTION || "",
				EAP_CLASS: eap[0].INQG_CLASS,
				EAP_ASGDATE: eap[0].INQG_ASG_DATE,
				EAP_ASGUSER: await deName(eap[0].INQG_ASG),
				EAP_DESDATE: eap[0].INQG_DES_DATE,
				EAP_DESUSER: await deName(eap[0].INQG_DES),
				EAP_CHK_DATE: eap[0].INQG_CHK_DATE,
				EAP_CHK_USER: await deName(eap[0].INQG_CHK),
				EAP_REMARK: eap[0].INQG_DES_REASON,
				EAP_TIME: await countWorkingDay(
					el.timeline.DE_READ,
					eap[0].INQG_CHK_DATE,
				),
			};
		}

		const eso = el.inqgroup.filter((g) => g.INQG_GROUP == 6);
		if (eso.length > 0) {
			row = {
				...row,
				IS_ESO: "P",
				ESO_REV: eso[0].INQG_REV,
				ESO_STATUS:
					statusMap.find((s) => s.STATUS_ID == eso[0].INQG_STATUS)
						?.STATUS_ACTION || "",
				ESO_CLASS: eso[0].INQG_CLASS,
				ESO_ASGDATE: eso[0].INQG_ASG_DATE,
				ESO_ASGUSER: await deName(eso[0].INQG_ASG),
				ESO_DESDATE: eso[0].INQG_DES_DATE,
				ESO_DESUSER: await deName(eso[0].INQG_DES),
				ESO_CHK_DATE: eso[0].INQG_CHK_DATE,
				ESO_CHK_USER: await deName(eso[0].INQG_CHK),
				ESO_REMARK: eso[0].INQG_DES_REASON,
				ESO_TIME: await countWorkingDay(
					el.timeline.DE_READ,
					eso[0].INQG_CHK_DATE,
				),
			};
		}
		details.push(row);
	}
	return details;
};
