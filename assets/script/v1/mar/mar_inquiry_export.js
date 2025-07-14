$(document).on("click", "#export", async function (e) {
  e.preventDefault();
  await showLoading();
  await addReportTable(table, "INQ_ID");
  const value = [];
  const url = `${host}export/mar/inquiry.json?v=${Date.now()}`;
  const json = await exportHeader(url);
  const header = [].concat(...json.header);
  const cols = [].concat(...json.key);
  value.push(header);
  const data = await getMarInquiryReport();
  const clear = await deleteReportTable();
  data.forEach((item) => {
    value.push(exportMap(item, cols));
  });
  const ws = XLSX.utils.aoa_to_sheet(value);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, ws, "sheet1");
  XLSX.write(workbook, { bookType: "xlsx", bookSST: true, type: "base64" });
  XLSX.writeFile(workbook, "Inquiry.xlsx", {
    compression: true,
    cellStyles: true,
  });
  await hideLoading();
});

$(document).on("click", "#export-detail", async function (e) {
  e.preventDefault();
  await showLoading();
  await addReportTable(table, "INQ_ID");
  const value = [];
  const url = `${host}export/mar/inquiry_detail.json?v=${Date.now()}`;
  const json = await exportHeader(url);
  const header = [].concat(...json.header);
  const cols = [].concat(...json.key);
  value.push(header);
  const data = await getMarInquiryDetailReport();
  const clear = await deleteReportTable();
  data.forEach((item) => {
    value.push(exportMap(item, cols));
  });

  const ws = XLSX.utils.aoa_to_sheet(value);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, ws, "sheet1");
  XLSX.write(workbook, { bookType: "xlsx", bookSST: true, type: "base64" });
  XLSX.writeFile(workbook, "Inquiry.xlsx", {
    compression: true,
    cellStyles: true,
  });
  await hideLoading();
});

function getMarInquiryReport() {
  return new Promise((resolve) => {
    $.ajax({
      url: host + "report/getMarInquiryReport",
      type: "post",
      dataType: "json",
      success: function (res) {
        resolve(res.data);
      },
    });
  });
}

function getMarInquiryDetailReport() {
  return new Promise((resolve) => {
    $.ajax({
      url: host + "report/getMarInquiryDetailReport",
      type: "post",
      dataType: "json",
      success: function (res) {
        resolve(res.data);
      },
    });
  });
}
