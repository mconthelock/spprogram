import dayjs from "dayjs";
import { getAppUsers } from "./master.js";
import { displayEmpInfo } from "@amec/webasset/indexDB";
import { currentUser } from "@amec/webasset/api/amec";
import { getDesigner } from "../des/data.js";

export const mar2sale = async (data) => {
	try {
		if (data.INQ_STATUS > 10) {
			await sale2de(
				data,
				`[SP Notification] Inquiry No. ${data.INQ_NO} is sent to you for processing`,
			);
			return;
		}
		const users = await getAppUsers();
		const userfilter = users.filter((u) =>
			["SLG"].includes(u.appsgroups?.GROUP_CODE),
		);

		const mailData = {
			template: "spprogram/inquiry",
			//to: userfilter.map((u) => u.data.SRECMAIL),
			to: `chalorms@MitsubishiElevatorAsia.co.th`,
			subject: `[SP Notification] Inquiry No. ${data.INQ_NO} is sent to Sale for processing`,
			context: {
				message: `${data.maruser.SNAME} has sent part supply inquiry to you since ${dayjs().format("YYYY-MM-DD HH:mm")}. Please accesss to system and processing data.`,
				recipientName: `Sale users`,
				showTable: true,
				tableHeaders: [
					"Inquiry No",
					"Rev.",
					"MAR Incharge",
					"Sent Date",
					"Link",
				],
				tableRows: [
					[
						data.INQ_NO,
						data.INQ_REV,
						data.maruser.SNAME,
						dayjs().format("YYYY-MM-DD HH:mm"),
						`<a href="${process.env.APP_ENV}/se/inquiry/detail/${data.INQ_ID}/1/">View Inquiry</a>`,
					],
				],
			},
		};
		await sendMail(mailData);
	} catch (error) {
		await error2admin(error);
		console.error("Error sending email to Sale:", error);
		//throw error;
	}
};

export const sale2se = async (data) => {
	try {
	} catch (error) {
		await error2admin(error);
		console.error("Error sending email to SE", error);
		//throw error;
	}
};

export const sale2de = async (data, subject = "") => {
	try {
		let emailto = [];
		const users = await getAppUsers();
		const designer = await getDesigner();
		const filteredUsers = users.filter((u) => {
			if (u.appsgroups?.GROUP_CODE == "LDR") {
				const des = designer.find((d) => d.DES_USER === u.USERS_ID);
				if (des) {
					u.des = des;
					return true;
				}
			}
			return false;
		});

		const group = data.inqgroup;
		const filteredGroup = group.filter(
			(g) => g.INQG_LATEST == 1 && g.INQG_SKIP == "1",
		);

		for (const grp of filteredGroup) {
			for (const user of filteredUsers) {
				if (user.des.DES_GROUP == grp.INQG_GROUP) {
					emailto.push(user.data.SRECMAIL);
				}
			}
		}

		const mailData = {
			template: "spprogram/inquiry",
			//to: emailto,
			to: `chalorms@MitsubishiElevatorAsia.co.th`,
			subject:
				subject ||
				`[SP Notification] Sale had forwarded Inquiry No. ${data.INQ_NO}`,
			context: {
				message: `Please accesss to SP Program to process data.`,
				recipientName: `D/E users`,
				showTable: true,
				tableHeaders: [
					"Inquiry No",
					"Rev.",
					"MAR Incharge",
					"Sent Date",
					"Link",
				],
				tableRows: [
					[
						data.INQ_NO,
						data.INQ_REV,
						data.maruser.SNAME,
						dayjs().format("YYYY-MM-DD HH:mm"),
						`<a href="${process.env.APP_ENV}/des/inquiry/detail/${data.INQ_ID}/1/">View Inquiry</a>`,
					],
				],
			},
		};
		await sendMail(mailData);
	} catch (error) {
		await error2admin(error);
		console.error("Error sending email to DE Group Leader:", error);
		//throw error;
	}
};

export const de2pkc = async (data) => {
	try {
		if (!data.INQ_PKC_REQ == 1) return;
		const users = await getAppUsers();
		const userfilter = users.filter((u) =>
			["PKC"].includes(u.appsgroups?.GROUP_CODE),
		);
		const mailData = {
			template: "spprogram/inquiry",
			to: userfilter.map((u) => u.data.SRECMAIL),
			bcc: `chalorms@MitsubishiElevatorAsia.co.th`,
			subject: `[SP Notification] Please confirm packaging and weight of Inquiry No. ${data.INQ_NO} `,
			context: {
				message: `Part supply's inquiry has already declared drawing and need your confirmation of packaging and weight. Please accesss to system and processing data.`,
				recipientName: `PKC users`,
				showTable: true,
				tableHeaders: [
					"Inquiry No",
					"Rev.",
					"MAR Incharge",
					"Inquiry Date",
					"Sent Date",
					"Link",
				],
				tableRows: [
					[
						data.INQ_NO,
						data.INQ_REV,
						data.maruser.SNAME,
						dayjs(data.INQ_DATE).format("YYYY-MM-DD"),
						dayjs().format("YYYY-MM-DD HH:mm"),
						`<a href="${process.env.APP_ENV}/pkc/inquiry/detail/${data.INQ_ID}/">View Inquiry</a>`,
					],
				],
			},
		};
		await sendMail(mailData);
	} catch (error) {
		await error2admin(error);
		console.error("Error sending email to DE Group Leader:", error);
		//throw error;
	}
};

export const fin2mar = async (data) => {
	try {
		if (data.INQ_STATUS < 45) return;
		const mailData = {
			template: "spprogram/inquiry",
			to: data.maruser.SRECMAIL,
			bcc: `chalorms@MitsubishiElevatorAsia.co.th`,
			subject: `[SP Notification] Inquiry No. ${data.INQ_NO} have been approved Price`,
			context: {
				message: `Finance has sent part supply inquiry to you since ${dayjs().format("YYYY-MM-DD HH:mm")}. Please accesss to system and processing data.`,
				recipientName: `${data.maruser.SNAME}`,
				showTable: true,
				tableHeaders: [
					"Inquiry No",
					"Rev.",
					"Inquiry Date",
					"Approve Date",
					"Link",
				],
				tableRows: [
					[
						data.INQ_NO,
						data.INQ_REV,
						dayjs(data.INQ_DATE).format("YYYY-MM-DD"),
						dayjs().format("YYYY-MM-DD HH:mm"),
						`<a href="${process.env.APP_ENV}/mar/quotation/detail/${data.INQ_ID}/1/">View Inquiry</a>`,
					],
				],
			},
		};
		await sendMail(mailData);
	} catch (error) {
		await error2admin(error);
		console.error("Error sending email to DE Group Leader:", error);
		//throw error;
	}
};

export const mar2fin = async (data) => {
	try {
		const users = data.maruser;
	} catch (error) {
		await error2admin(error);
		console.error("Error sending email to DE Group Leader:", error);
		//throw error;
	}
};

export const error2admin = async (error) => {
	try {
		const user = await currentUser();
		const mailData = {
			template: "spprogram/inquiry",
			to: `chalorms@MitsubishiElevatorAsia.co.th`,
			subject: `[SP Notification] Error occurred in SP Program`,
			context: {
				recipientName: `Admin`,
				message: `${error?.message || error?.toString() || JSON.stringify(error)} / ${user ? `User: ${user.empno} - ${user.username}` : ""}`,
				showTable: false,
			},
		};
		await sendMail(mailData);
	} catch (error) {
		console.error("Error sending email to Admin:", error);
		//throw error;
	}
};

//Mail
export const sendMail = (data) => {
	return new Promise((resolve, reject) => {
		$.ajax({
			url: `${process.env.APP_API}/mail/sendmail`,
			type: "POST",
			contentType: "application/json",
			data: JSON.stringify(data),
			success: (response) => {
				resolve(response);
			},
			error: (error) => {
				reject(error);
			},
		});
	});
};
