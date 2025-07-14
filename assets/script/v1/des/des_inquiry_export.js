$(document).on("click", "#export", async function (e) {
  e.preventDefault();
  await showLoading();
  await addReportTable(table, "INQ_ID");
  const value = [];
  const url = `${host}export/des/inquiry_report.json?v=${Date.now()}`;
  const json = await exportHeader(url);
  const header = [].concat(...json.header);
  const cols = [].concat(...json.key);
  value.push(header);
  const data = await getDesInquiryReport();
  const clear = await deleteReportTable();
  data.forEach((item) => {
    value.push(exportMap(item, cols));
  });
  const ws = XLSX.utils.aoa_to_sheet(value);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, ws, "Sheet1");
  XLSX.write(workbook, { bookType: "xlsx", bookSST: true, type: "base64" });
  XLSX.writeFile(workbook, "Inquiry.xlsx", {
    compression: true,
    cellStyles: true,
  });
  await hideLoading();
});

function getDesInquiryReport() {
  return new Promise((resolve) => {
    $.ajax({
      url: host + "report/getDesInquiryReport",
      type: "post",
      dataType: "json",
      success: function (res) {
        resolve(res.data);
      },
    });
  });
}
