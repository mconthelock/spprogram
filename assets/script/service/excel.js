import moment from "moment";
import ExcelJS from "exceljs";
import { exportFormat } from "./inquiry.js";
import { ameccaledar } from "../utils.js";
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
    let row1 = 0;
    let str = 0;

    const colCount = sheet.columnCount;
    data.forEach(async (el, i) => {
      str = i + opt.rowstart;
      if (str > opt.rowstart + 1) {
        cloneRows(sheet, row1, str);
        row1 = str % 2 == 0 ? opt.rowstart + 1 : opt.rowstart;
      }

      for (let j = 1; j <= colCount; j++) {
        const format = columns.find((item) => item[1] == j);
        if (format == undefined) continue;
        let value = "";
        if (format[3] == null) continue;
        if (format[2] == "Func") {
          const param = format[4] ? JSON.parse(format[4]) : {};
          value = eval(format[3])(el, param);
        } else if (format[2] == "Formula") {
          value = { formula: format[3].replaceAll("{x}", str) };
        } else {
          if (format[3].includes(".")) {
            value = el;
            const keys = format[3].split(".");
            for (const key of keys) {
              value = value[key] !== undefined ? value[key] : "";
            }
          } else {
            value = el[format[3]] !== undefined ? el[format[3]] : "";
          }
        }

        if (format[2] === "Date" && value) {
          sheet.getCell(str, format[1]).value =
            moment(value).format("YYYY-MM-DD");
        } else if (format[2] === "Datetime" && value) {
          sheet.getCell(str, format[1]).value = moment(value).format(
            "YYYY-MM-DD HH:mm:ss"
          );
        } else {
          sheet.getCell(str, format[1]).value = value;
        }
      }
    });

    // Excute more options (if any)
    if (opt.execute != null && typeof opt.execute == "function") {
      await opt.execute(workbook, sheet);
    }

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

async function getCalendar(data) {
  const minInqMoment = data.reduce((acc, item) => {
    if (!item || !item.INQ_DATE) return acc;
    const m = moment(item.INQ_DATE);
    if (!m.isValid()) return acc;
    return acc === null || m.isBefore(acc) ? m : acc;
  }, null);

  const minInqDate = minInqMoment ? minInqMoment.format("YYYYMMDD") : null;
  const daterange = await ameccaledar(
    minInqDate,
    moment().add(10, "days").format("YYYYMMDD")
  );
  return daterange;
}

function getEffect(data, param) {
  const inqgroup = data.inqgroup;
  const des = inqgroup.filter((item) => item.INQG_GROUP === param.INQG_GROUP);
  return des.length > 0 ? "Y" : "";
}

function nextWorkingDay(data, param) {
  const sdate = moment(data.timeline.MAR_SEND).format("YYYYMMDD");
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
  return moment(current, "YYYYMMDD").format("YYYY-MM-DD");
}

export const getTemplate = async (data) => {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: `${process.env.APP_API}/sp/attachments/export/template/`,
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
        console.log(`Do error`);
        reject(error);
      },
    });
  });
};
