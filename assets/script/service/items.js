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

export const getItemsCategory = async (data) => {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: `${process.env.APP_API}/sp/items/category/all/`,
      type: "GET",
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

export const itemsMasterList = async (items) => {
  const category = await getItemsCategory({});
  const type = [...new Set(items.map((item) => item.ITEM_TYPE))];
  const classed = [...new Set(items.map((item) => item.ITEM_CLASS))];
  const supplier = [...new Set(items.map((item) => item.ITEM_SUPPLIER))];
  return { type, classed, supplier, category };
};

export const getItemsCustomer = async (data) => {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: `${process.env.APP_API}/sp/pricelist/customer/`,
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
