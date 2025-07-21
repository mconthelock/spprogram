export const getMainProject = async (data) => {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: `${process.env.APP_API}/mkt/orders/search`,
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
};

export function getCountries() {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: `${process.env.APP_API}/mkt/country/`,
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
      url: `${process.env.APP_API}/mkt/agent/`,
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

export function getSeries() {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: `${process.env.APP_API}/mkt/maintain/`,
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
