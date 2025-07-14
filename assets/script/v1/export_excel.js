function exportHeader(url) {
  var items = [];
  var head = [];
  $.ajax({
    url: url,
    type: "get",
    dataType: "json",
    async: false,
    success: function (res) {
      $.each(res, function (key, val) {
        items.push(key);
        head.push(val);
      });
    },
  });
  return { key: items, header: head };
}

function exportMap(data, cols) {
  let value = [];
  for (let i = 0; i < cols.length; i++) {
    const val = data[cols[i]] == null ? "" : data[cols[i]];
    value.push(val);
  }
  return value;
}

async function addReportTable(obj, key) {
  const insert = (data) => {
    return new Promise((resolve) => {
      $.ajax({
        url: host + "report/addReportTable",
        type: "post",
        dataType: "json",
        data: { data: data },
        success: function (res) {
          resolve(res.data);
        },
      });
    });
  };
  //Get data form column 0 of each row
  const data = obj
    .rows()
    .data()
    .toArray()
    .map((item) => {
      return { INQ_ID: item[key], SESSION_ID: $("#sid").val() };
    });
  await insert(data);
  return true;
}

function deleteReportTable() {
  return new Promise((resolve) => {
    $.ajax({
      url: host + "report/deleteReportTable",
      type: "post",
      async: false,
      dataType: "json",
      async: false,
      success: function (res) {
        resolve(res.data);
      },
    });
  });
}

function createExcel(url, q = "") {
  return new Promise((resolve) => {
    $.ajax({
      url: url,
      type: "post",
      dataType: "json",
      data: q,
      success: function (res) {
        if (res.status === false) {
          showErrorNotify(res.msg);
          return false;
        }

        const fileName = res.filename + ".xlsx";
        const fileType =
          "data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,";
        // For Internet Explorer.
        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
          const encodeBase64 = res.dExcel;
          const byteCharacters = atob(encodeBase64);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          const blob = new Blob([byteArray], { type: fileType });
          window.navigator.msSaveOrOpenBlob(blob, fileName);
        } else {
          const $a = $("<a>");
          $a.attr("href", fileType + res.dExcel);
          $("body").append($a);
          console.log($a);
          $a.attr("download", fileName);
          $a[0].click();
          $a.remove();
        }
        resolve(res);
      },
    });
  });
}
