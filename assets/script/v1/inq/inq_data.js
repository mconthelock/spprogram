function getProject(q) {
  return new Promise((resolve) => {
    $.ajax({
      url: host + "marketing/getproject",
      type: "post",
      dataType: "json",
      data: q,
      //async: false,
      success: function (res) {
        resolve(res.data);
      },
    });
  });
}

function getPriceRatio(q) {
  return new Promise((resolve) => {
    $.ajax({
      url: `${host}mar/price/getRatio`,
      type: "post",
      dataType: "json",
      data: q,
      //async: false,
      success: function (res) {
        resolve(res.data);
      },
    });
  });
}

function getInquiry(no) {
  return new Promise((resolve) => {
    $.ajax({
      url: host + "inquiry/getInquiry",
      type: "post",
      //async: false,
      dataType: "json",
      data: { inqno: no, latest: 1 },
      //async: false,
      success: function (res) {
        resolve(res.data);
      },
    });
  });
}

function getInquiryProperties() {
  return new Promise((resolve) => {
    const id = $("#inqno").val();
    const agent =
      $("#agent").val() != null ? $("#agent").val().trim().substring(0, 3) : "";
    const prefix = id.substr(0, 2) == "T-" ? id.substr(0, 5) : "Any";

    $.ajax({
      url: host + "inquiry/getcontrol",
      type: "post",
      dataType: "json",
      data: { agent, prefix },
      success: function (res) {
        resolve(res.data);
      },
    });
  });
}

function getInquiryDetail(id = "") {
  return new Promise((resolve) => {
    $.ajax({
      url: host + "inquiry/getInquiryDetail",
      type: "post",
      //async: false,
      dataType: "json",
      data: { inqid: id, latest: 1 },
      //async: false,
      success: function (res) {
        resolve(res.data);
      },
    });
  });
}

function uploadFile(id) {
  return new Promise((resolve) => {
    $.ajax({
      url: `${host}inquiry/insertAttachment/${id}`,
      method: "post",
      dataType: "json",
      data: formdata,
      async: false,
      processData: false,
      contentType: false,
      success: function (res) {
        resolve(res);
      },
    });
  });
}

function getAttachment(no) {
  return new Promise((resolve) => {
    $.ajax({
      url: host + "inquiry/getAttachment",
      type: "post",
      async: false,
      dataType: "json",
      data: { inqno: no },
      async: false,
      success: function (res) {
        resolve(res.data);
      },
    });
  });
}

function getElmes(ordno, carno, item) {
  return new Promise((resolve) => {
    $.ajax({
      url: host + "elmes/showData",
      type: "post",
      async: false,
      dataType: "json",
      data: { ordno, carno, item },
      async: false,
      success: function (res) {
        resolve(res.data);
      },
    });
  });
}

function getHistory(no) {
  return new Promise((resolve) => {
    $.ajax({
      url: host + "inquiry/getHistory",
      type: "post",
      async: false,
      dataType: "json",
      data: { inqno: no.toUpperCase() },
      async: false,
      success: function (res) {
        resolve(res.data);
      },
    });
  });
}

function getCutomer(id) {
  return new Promise((resolve) => {
    $.ajax({
      url: `${host}mar/master/getCustomers`,
      type: "post",
      async: false,
      dataType: "json",
      data: { cusid: id },
      async: false,
      success: function (res) {
        resolve(res.data);
      },
    });
  });
}

function getPrice(customer, item) {
  return new Promise((resolve) => {
    $.ajax({
      url: host + "mar/price/showPricelist",
      type: "post",
      async: false,
      dataType: "json",
      data: { customer, item },
      async: false,
      success: function (res) {
        resolve(res.data);
      },
    });
  });
}

function revised(id, newid) {
  return new Promise((resolve) => {
    $.ajax({
      url: host + "inquiry/revised",
      type: "post",
      async: false,
      dataType: "json",
      data: { id, newid },
      async: false,
      success: function (res) {
        resolve(res.data);
      },
    });
  });
}

async function getQuery() {
  var query = {};
  if ($("#query").length > 0) {
    $("#query")
      .find("input")
      .each(function () {
        query[$(this).attr("id")] = $(this).val();
      });
  } else {
    const q = localStorage.getItem("sp_query_report");
    await logMonitorting(q);
    query = JSON.parse(q);
  }
  return query;
}

function logMonitorting(query) {
  $.ajax({
    url: host + "admin/inquiries/logMonitorting",
    type: "post",
    async: false,
    dataType: "json",
    data: { query },
  });
}

function getWeight(id) {
  return new Promise((resolve) => {
    $.ajax({
      url: host + "pkc/weight/getWeight",
      type: "post",
      async: false,
      dataType: "json",
      data: { id },
      async: false,
      success: function (res) {
        resolve(res.data);
      },
    });
  });
}

function getQuotation(id) {
  return new Promise((resolve) => {
    $.ajax({
      url: host + "mar/Quotation/getQuotation",
      type: "post",
      async: false,
      dataType: "json",
      data: { id },
      async: false,
      success: function (res) {
        resolve(res.data);
      },
    });
  });
}
