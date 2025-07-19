export function getPriceRatio() {
  return new Promise((resolve) => {
    $.ajax({
      url: `${process.env.APP_API}/sp/priceratio`,
      type: "GET",
      dataType: "json",
      success: function (response) {
        resolve(response);
      },
    });
  });
}

export function getQuotationType() {
  return new Promise((resolve) => {
    $.ajax({
      url: `${process.env.APP_API}/sp/quotationtype`,
      type: "GET",
      dataType: "json",
      success: function (response) {
        resolve(response);
      },
    });
  });
}
