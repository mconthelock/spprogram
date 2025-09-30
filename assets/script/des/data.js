export async function getDesigner() {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: `${process.env.APP_API}/sp/designer/all`,
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

export async function getDesignerGroup() {
  const user = $("#user-login").attr("empno");
  const designer = await getDesigner();
  return designer.find((d) => d.DES_USER == user);
}
