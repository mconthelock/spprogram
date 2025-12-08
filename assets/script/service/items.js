import dayjs from "dayjs";
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

export const getItemsImage = async (id) => {
  const res = await fetch(`${process.env.APP_API}/sp/items/photo/${id}`);
  if (!res.ok) {
    await fetchMsgErr(res);
    throw new Error("Failed to fetch user image");
  }
  return res.text();
};

export const createItems = async (data) => {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: `${process.env.APP_API}/sp/items/create/`,
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

export const updateItems = async (data) => {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: `${process.env.APP_API}/sp/items/update/`,
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

export const uploadItemsPhoto = async (data) => {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: `${process.env.APP_API}/sp/items/photo/upload/`,
      type: "POST",
      dataType: "json",
      data: data,
      processData: false,
      contentType: false,
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

export async function currentPeriod() {
  const cyear = dayjs().year();
  const month = dayjs().month() + 1;
  if (month >= 4 && month <= 9) {
    return {
      current: { year: cyear, period: 1 },
      last: { year: cyear - 1, period: 2 },
    };
  }
  if (month <= 3) {
    return {
      current: { year: cyear - 1, period: 2 },
      last: { year: cyear - 1, period: 1 },
    };
  }
  return {
    current: { year: cyear, period: 2 },
    last: { year: cyear, period: 1 },
  };
}
