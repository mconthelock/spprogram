export function getPriceRatio() {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: `${process.env.APP_API}/sp/priceratio`,
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

export function findPriceRatio(data) {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: `${process.env.APP_API}/sp/priceratio/find`,
      type: "POST",
      dataType: "json",
      data: data,
      success: function (response) {
        resolve(response);
      },
      error: function (error) {
        reject(error);
      },
    });
  });
}

export function statusPriceRatio(data) {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: `${process.env.APP_API}/sp/priceratio/status`,
      type: "POST",
      dataType: "json",
      data: data,
      success: function (response) {
        resolve(response);
      },
      error: function (error) {
        reject(error);
      },
    });
  });
}

export function createPriceRatio(data) {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: `${process.env.APP_API}/sp/priceratio/create`,
      type: "POST",
      dataType: "json",
      data: data,
      success: function (response) {
        resolve(response);
      },
      error: function (error) {
        console.log(error);

        reject(error);
      },
    });
  });
}

export function getQuotationType() {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: `${process.env.APP_API}/sp/quotationtype`,
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

export function createQuotationType(data) {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: `${process.env.APP_API}/sp/quotationtype/create`,
      type: "POST",
      dataType: "json",
      data: data,
      success: function (response) {
        resolve(response);
      },
      error: function (error) {
        reject(error);
      },
    });
  });
}

export function getShipments() {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: `${process.env.APP_API}/sp/shipment/`,
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

export function getDeliveryTerm() {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: `${process.env.APP_API}/sp/term/`,
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

export function getAgent() {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: `${process.env.APP_API}/sp/shipment/`,
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

export function getCountries() {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: `${process.env.APP_API}/sp/shipment/`,
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
