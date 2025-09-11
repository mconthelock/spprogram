export const getItems = async (data) => {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: `${process.env.APP_API}/sp/items/search/`,
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
