export const getCurrency = async () => {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: `${process.env.APP_API}/sp/currency`,
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
};

export const updateCurrency = async (data) => {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: `${process.env.APP_API}/sp/currency/update`,
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
