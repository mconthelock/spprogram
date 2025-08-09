export const getInquiry = async (data) => {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: `${process.env.APP_API}/sp/inquiry/search/`,
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

export const getInquiryID = async (id) => {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: `${process.env.APP_API}/sp/inquiry/${id}/`,
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

export const createInquiry = async (data) => {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: `${process.env.APP_API}/sp/inquiry/create/`,
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

// Function to manage inquiry group
export const getInquiryGroup = async (data) => {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: `${process.env.APP_API}/sp/group/search/`,
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

export const createInquiryGroup = async (data) => {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: `${process.env.APP_API}/sp/group/create/`,
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

export const createInquiryDetail = async (data) => {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: `${process.env.APP_API}/sp/detail/create/`,
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

//History
export const getInquiryHistory = async (id) => {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: `${process.env.APP_API}/sp/history/${id}/`,
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

//Attachment
export const createInquiryFile = async (data) => {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: `${process.env.APP_API}/sp/attachments/create/`,
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
