$(document).on("click", "#export", async function () {
  const value = [];
  const url = `${host}export/mar/inquiry.json`;
  const json = await exportHeader(url);
  const header = [].concat(...json.header);
  const cols = [].concat(...json.key);
  value.push(header);
  const data = await getMarInquiryReport();
  console.log(data);
  data.forEach((item) => {
    value.push(exportMap(item, cols));
  });

  var file = "Inquiry.xlsx";
  var workbook = XLSX.utils.book_new(),
    worksheet = XLSX.utils.aoa_to_sheet(value);
  workbook.SheetNames.push("Data");
  workbook.Sheets["Data"] = worksheet;
  XLSX.writeFile(workbook, file);
});

$(document).on("click", "#export-detail", async function () {
  const value = [];
  const url = `${host}export/mar/inquiry_detail.json`;
  const json = await exportHeader(url);
  const header = [].concat(...json.header);
  const cols = [].concat(...json.key);
  value.push(header);
  const data = await getInquiryDetail();
  data.forEach((item) => {
    value.push(exportMap(item, cols));
  });

  var file = "Inquiry Data.xlsx";
  var workbook = XLSX.utils.book_new(),
    worksheet = XLSX.utils.aoa_to_sheet(value);
  console.log(value);
  workbook.SheetNames.push("Data");
  workbook.Sheets["Data"] = worksheet;
  XLSX.writeFile(workbook, file);
});

function getMarInquiryReport(query = "") {
  return new Promise((resolve) => {
    $.ajax({
      url: host + "mar/inquiry/getInquiryReport",
      type: "post",
      async: false,
      dataType: "json",
      data: query,
      async: false,
      success: function (res) {
        resolve(res.data);
      },
    });
  });
}

function getInquiryDetail(query = "") {
  return new Promise((resolve) => {
    $.ajax({
      url: host + "mar/inquiry/getInquiryReport",
      type: "post",
      async: false,
      dataType: "json",
      data: query,
      async: false,
      success: function (res) {
        resolve(res.data);
      },
    });
  });
}
