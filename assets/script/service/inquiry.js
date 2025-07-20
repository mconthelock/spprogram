export function getProject(data) {
  return new Promise((resolve) => {
    $.ajax({
      url: `${process.env.APP_API}/sp/project`,
      type: "POST",
      dataType: "json",
      data: {},
      success: function (response) {
        resolve(response);
      },
    });
  });
}

export const getTraders = async () => {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: `${process.env.APP_API}/sp/project`,
      type: "POST",
      dataType: "json",
      data: {},
      success: function (response) {
        resolve(response);
      },
      error: function (error) {
        reject(error);
      },
    });
  });
};

export const getInquiry = async () => {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: `${process.env.APP_API}/sp/project`,
      type: "POST",
      dataType: "json",
      data: {},
      success: function (response) {
        resolve(response);
      },
      error: function (error) {
        reject(error);
      },
    });
  });
};

export const getCountries = async () => {};
