import dayjs from "dayjs";
import * as mst from "./master.js";
import { displayEmpInfo } from "@amec/webasset/indexDB";
import { currentUser } from "@amec/webasset/api/amec";
import { getDesigner } from "../des/data.js";

export const sendGLD = async (data) => {
	let users = await mst.getAppUsers();
	users = users.filter((u) => ["LDE"].includes(u.appsgroups?.GROUP_CODE));
	const designer = await getDesigner();
	users.map((u) => {
		const des = designer.find((d) => d.DES_USER === u.USERS_ID);
		if (des) u.DES_GROUP = des.DES_GROUP;
	});

	let emailto = [];
	let group = data.inqgroup;
	group = group.filter((g) => g.INQG_LATEST == "1" && g.INQG_STATUS == 0);
	group.map((g) => {
		const user = users.find((u) => u.DES_GROUP == g.INQG_GROUP);
		if (user) emailto.push(user.data.SRECMAIL);
	});
	return await createEmailData(data, emailto);
};

export const mailToSaleEngineer = async (data) => {
	try {
		const emp = await displayEmpInfo(data.timeline.SE_USER);
		const emailto = emp?.SRECMAIL ? [emp.SRECMAIL] : [];
		return await createEmailData(data, emailto);
	} catch (error) {
		console.error("Error sending email to Sale Engineer:", error);
		throw error; // Rethrow the error after logging it
	}
};

export const sendPKC = async (data) => {
	let users = await mst.getAppUsers();
	users = users.filter((u) => ["PKC"].includes(u.appsgroups?.GROUP_CODE));
	if (data.INQ_PKC_REQ == 1) {
		const emailto = users.map((u) => u.data.SRECMAIL);
		return await createEmailData(data, emailto);
	}
};

export const sendAAS = async () => {};

export const sendFIN = async () => {};

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

async function createEmailData(data, emailto) {
	const sender = await currentUser();
	const emailData = {
		inquiryNo: data.INQ_NO,
		requester: sender ? sender.displayname.sname : "Unknown User",
		issueDate: dayjs(data.CREATE_AT).format("YYYY-MM-DD HH:mm"),
		message: data.remark !== undefined ? data.remark : "-",
		itemList: [
			{
				inqno: data.INQ_NO,
				inqrev: data.INQ_REV,
				agent: data.INQ_AGENT,
				country: data.INQ_COUNTRY,
				status: data.status.STATUS_DESC,
				maruser: data.maruser.SNAME,
			},
		],
	};
	const finalHtml = createEmailHtml(emailData);
	const mailto = {
		from: "SP Program <no-reply@MitsubishiElevatorAsia.co.th>",
		to: "chalorms@MitsubishiElevatorAsia.co.th", //emailto
		cc: ["chalorms@MitsubishiElevatorAsia.co.th", data.maruser.SRECMAIL],
		subject: `Inquiry No. ${data.INQ_NO} Update`,
		html: finalHtml,
		// attachments: [
		//   {
		//     filename: "export_inquiry_list_template.xlsx",
		//     path: "//amecnas/amecweb/file/development/SP/template/export_inquiry_list_template.xlsx",
		//   },
		// ],
	};
	return await sendMail(mailto);
}

function createEmailHtml(data) {
	const { inquiryNo, requester, issueDate, message, itemList } = data;
	// (Optional) กำหนดการ Map ชื่อคอลัมน์สำหรับตาราง
	const columnMap = {
		inqno: "Inquiry No",
		inqrev: "Rev.",
		agent: "Agent",
		country: "Country",
		status: "Status",
		maruser: "MAR Incharge",
	};
	const itemTableHtml = createHtmlTable(itemList, columnMap);
	return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #dddddd; }
                .content { padding: 20px 0; }
                .footer { font-size: 0.8em; color: #777777; padding-top: 20px; border-top: 1px solid #eeeeee; }
            </style>
        </head>
        <body>
            <div class="container">
                <h2 style="display:block; padding-left: 8px; text-align: left;background-color: #1abc9c; color: white;">Inquiry No. ${inquiryNo} Update</h2>
                <div class="content">
                    <p>Dear All Concern</p>
                    <p><strong>${requester}</strong> has sent new Inquiry on **SP Program** since ${issueDate}. Please accesss to system and processing data.</p>
                    <p style="border-left: 3px solid #ff9900; padding-left: 10px; background-color: #fffacd; padding: 10px;">
                        <strong>Note:</strong> ${
							message == undefined ? "-" : message
						}
                    </p>

                    <h3>Inquiry Information:</h3>
                    ${itemTableHtml}
                </div>
                <div class="footer">
                    <p>This email have automatically sent by system. <strong style="color: red;">Please do not reply.</strong> If you have any question or need some help. Please contact to system admin. </p>
                </div>
            </div>
        </body>
        </html>
    `;
}

function createHtmlTable(data, columnMapping = {}) {
	if (!data || data.length === 0) {
		return "<p>ไม่มีข้อมูลแสดง</p>";
	}

	// กำหนดคีย์คอลัมน์และชื่อหัวตาราง
	const keys = Object.keys(data[0]);
	const headers = keys.map((key) => columnMapping[key] || key);

	// สร้างส่วนหัวตาราง (Thead)
	const tableHeader = `
        <thead>
            <tr style="background-color: #f2f2f2;">
                ${headers
					.map(
						(header) =>
							`<th style="border: 1px solid #dddddd; padding: 8px; text-align: left;">${header}</th>`,
					)
					.join("")}
            </tr>
        </thead>
    `;

	// สร้างส่วนเนื้อหาตาราง (Tbody)
	const tableBody = `
        <tbody>
            ${data
				.map(
					(item, index) => `
                <tr style="background-color: ${
					index % 2 === 0 ? "#ffffff" : "#f9f9f9"
				};">
                    ${keys
						.map(
							(key) => `
                        <td style="border: 1px solid #dddddd; padding: 8px;">${item[key]}</td>
                    `,
						)
						.join("")}
                </tr>
            `,
				)
				.join("")}
        </tbody>
    `;

	// รวมเป็นตาราง HTML ที่มีสไตล์ขั้นพื้นฐานสำหรับอีเมล
	return `
        <table style="font-family: Arial, sans-serif; border-collapse: collapse; width: 100%;">
            ${tableHeader}
            ${tableBody}
        </table>
    `;
}
