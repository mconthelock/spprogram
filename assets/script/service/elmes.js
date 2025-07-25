export const getElmesItem = async (ordno, item) => {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: `${process.env.APP_API}/elmes/gplitem/item/${ordno}/${item}`,
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
