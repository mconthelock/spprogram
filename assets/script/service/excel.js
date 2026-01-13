import { toExcelDate } from "@amec/webasset/dayjs";
import ExcelJS from "exceljs";
import { ameccaledar } from "../utils.js";
import dayjs from "dayjs";
var daterange;

export const cloneRows = async (worksheet, sourceRowNum, targetRowNum) => {
	const sourceRow = worksheet.getRow(sourceRowNum);
	const newRow = worksheet.insertRow(targetRowNum);
	sourceRow.eachCell({ includeEmpty: true }, (cell, colNumber) => {
		const newCell = newRow.getCell(colNumber);
		if (cell.style) {
			newCell.style = { ...cell.style };
		}
	});
	newRow.height = sourceRow.height;
};

export const exportExcel = async (data, template, options = {}) => {
	const opt = {
		filename: `export.xlsx`,
		rowstart: 2,
		...options,
	};
	daterange = await getCalendar(data);
	const file = template.buffer;
	const workbook = new ExcelJS.Workbook();
	await workbook.xlsx.load(file).then(async (workbook) => {
		const sheet_data = workbook.worksheets[1];
		const columns = await exportFormat(sheet_data);
		const sheet = workbook.worksheets[0];
		const colCount = sheet.columnCount;
		const white = opt.rowstart;
		const gray = opt.rowstart + 1;
		let color = white;

		let target = opt.rowstart + 2;
		data.forEach(async (el, i) => {
			cloneRows(sheet, color, target);
			color = i % 2 == 0 ? gray : white;

			for (let j = 1; j <= colCount; j++) {
				const format = columns.find((item) => item[1] == j);
				if (format == undefined || format[3] == null) continue;
				//console.log(format);
				let value = "";
				if (format[2] == "Func") {
					const param = format[4] ? JSON.parse(format[4]) : {};
					value = eval(format[3])(el, param);
					sheet.getCell(target, format[1]).value = value;
				} else if (format[2] == "Formula") {
					value = { formula: format[3].replaceAll("{x}", target) };
					sheet.getCell(target, format[1]).value = value;
				} else {
					if (format[3].includes(".")) {
						const keys = format[3].split(".");
						const item = el[keys[0]];
						if (Array.isArray(item)) {
							console.log(item[0][keys[1]]);
							value = item !== undefined ? item[0][keys[1]] : "";
						} else {
							value = item !== undefined ? item[keys[1]] : "";
						}
					} else {
						value =
							el[format[3]] !== undefined ? el[format[3]] : "";
					}

					//Format Data
					if (format[2] === "Date" && value) {
						// prettier-ignore
						sheet.getCell(target, format[1]).value = dayjs(dayjs(value).locale('th').format('YYYY-MM-DD')).toDate();
						sheet.getCell(target, format[1]).numFmt = "yyyy-mm-dd";
					} else if (format[2] === "Datetime" && value) {
						// prettier-ignore
						sheet.getCell(target, format[1]).value = dayjs(dayjs(value).locale('th').format('YYYY-MM-DD HH:mm:ss')).toDate();
						console.log(
							format[0],
							dayjs(
								dayjs(value)
									.locale("th")
									.format("YYYY-MM-DD HH:mm:ss")
							).toDate()
						);

						// prettier-ignore
						sheet.getCell(target, format[1]).numFmt = "yyyy-mm-dd hh:mm:ss";
					} else {
						sheet.getCell(target, format[1]).value = value;
						sheet.getCell(target, format[1]).numFmt = "General";
					}
				}
			}
			target = target + 1;
		});

		if (opt.static) {
			for (let rw of opt.static) {
				sheet.getCell(rw.cols).value = rw.text;
			}
		}

		// Excute more options (if any)
		if (opt.execute != null && typeof opt.execute == "function") {
			await opt.execute(workbook, sheet);
		}

		sheet.spliceRows(opt.rowstart, 2);

		// Remove all sheets except the first one
		while (workbook.worksheets.length > 1) {
			workbook.removeWorksheet(workbook.worksheets[1].id);
		}
		await workbook.xlsx.writeBuffer().then(function (buffer) {
			const blob = new Blob([buffer], {
				type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
			});
			const link = document.createElement("a");
			link.href = URL.createObjectURL(blob);
			link.download = opt.filename;
			link.click();
		});
	});
};

export const exportFormat = (sheet) => {
	const data_array = [];
	sheet.eachRow({ includeEmpty: false }, function (row, rowNumber) {
		const row_values = [];
		row.eachCell({ includeEmpty: true }, function (cell, colNumber) {
			row_values.push(cell.value);
		});
		data_array.push(row_values);
	});
	return data_array;
};

export const getTemplate = async (filename) => {
	const data = {
		path: `${process.env.FILE_TEMPLATE}/${filename}`,
		name: filename,
	};
	return new Promise((resolve, reject) => {
		$.ajax({
			url: `${process.env.APP_API}/files/template/read/`,
			type: "POST",
			dataType: "json",
			data: data,
			success: function (res) {
				const binaryData = atob(res.content);
				const buffer = new Uint8Array(binaryData.length);
				for (let i = 0; i < binaryData.length; i++) {
					buffer[i] = binaryData.charCodeAt(i);
				}
				res.buffer = buffer;
				resolve(res);
			},
			error: function (error) {
				reject(error);
			},
		});
	});
};

export function getSchedule(data, param) {
	const val = data.AMEC_SCHDL;
	if (val == "" || val == undefined || val == null) return "";

	const str1 = dayjs(val).format("YYMM");
	let jun = "";
	switch (dayjs(val).format("DD")) {
		case "05":
			jun = `${str1}X`;
			break;
		case "10":
			jun = `${str1}A`;
			break;
		case "15":
			jun = `${str1}Y`;
			break;
		case "20":
			jun = `${str1}B`;
			break;
		case "25":
			jun = `${str1}Z`;
			break;
		default:
			jun = `${str1}C`;
			break;
	}
	return jun;
}

//Excel function
function getEffect(data, param) {
	const inqgroup = data.inqgroup;
	const des = inqgroup.filter((item) => item.INQG_GROUP === param.INQG_GROUP);
	return des.length > 0 ? "Y" : "";
}

function nextWorkingDay(data, param) {
	const sdate = dayjs(data.timeline.MAR_SEND).format("YYYYMMDD");
	const days = parseInt(param.days);
	daterange = daterange.filter(
		(item) => item.DAYOFF == 0 && item.WORKID >= sdate
	);
	let i = 1;
	let current = sdate;
	daterange.forEach((item) => {
		if (i == days) {
			current = item.WORKID;
		}
		i++;
	});
	return dayjs(current, "YYYYMMDD").format("YYYY-MM-DD");
}

async function getCalendar(data) {
	const minInqMoment = data.reduce((acc, item) => {
		if (!item || !item.INQ_DATE) return acc;
		const m = dayjs(item.INQ_DATE);
		if (!m.isValid()) return acc;
		return acc === null || m.isBefore(acc) ? m : acc;
	}, null);

	const minInqDate = minInqMoment ? minInqMoment.format("YYYYMMDD") : null;
	const daterange = await ameccaledar(
		minInqDate,
		dayjs().add(10, "days").format("YYYYMMDD")
	);
	return daterange;
}

function inquirySupplier(data, param) {}
