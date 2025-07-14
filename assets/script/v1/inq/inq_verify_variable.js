function checkVariable(txt) {
  if (txt == "") return true;
  const values = (str) => {
    str = str.replace(/\s{2,}/g, " ");
    str = str.replace(/\t/g, " ");
    str = str
      .toString()
      .trim()
      .replace(/(\r\n|\n|\r)/g, "");
    str = str.replaceAll(" ", "");
    return str;
  };
  //const txt = "MAK=B,G,2,3,, 5-12,15,16,P, JPP=ON,JPA=MST, DWG=503";
  const variable = values(txt);
  // ต้องมี = อย่างน้อย 1 ตัว
  if (variable.search("=") < 0)
    return {
      status: false,
      msg: "Variable is not valid format (1)",
      value: variable,
    };

  //แบ่ง Variable ออกเป็นชุดจากเครื่องหมาย ,
  const val = variable.split(",");
  var i = 0;
  var data = [];
  val.map(function (el) {
    if (el.search("=") < 0) {
      if (i == 0) {
        return {
          status: false,
          msg: "Variable is not valid format",
          value: variable,
        };
      } else {
        if (el != "") data[i - 1] += "," + el;
      }
    } else {
      data[i] = el;
      i++;
    }
  });

  let str = "";
  for (let index = 0; index < data.length; index++) {
    const temp = data[index].split("=");
    if (temp.length != 2) {
      return {
        status: false,
        msg: "Variable is not valid format",
        value: variable,
      };
    }

    if (temp[0].length > 4) {
      return {
        status: false,
        msg: "Variable is not valid format",
        value: variable,
      };
    }

    if (temp[1].search(",") < 0 && temp[1].length > 9) {
      return {
        status: false,
        msg: "Variable is not valid format--",
        value: variable,
      };
    }

    str += str != "" ? "," : "";
    str += data[index];
  }
  return {
    status: true,
    value: str,
    data: data,
  };
}
