export function getProject(data) {
  /*return new Promise((resolve) => {
    $.ajax({
      url: `${process.env.APP_API}/sp/project`,
      type: "POST",
      dataType: "json",
      data: {},
      success: function (response) {
        resolve(response);
      },
    });
  });*/
  return { id: data };
}
