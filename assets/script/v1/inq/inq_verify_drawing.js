async function checkDrawing(txt) {
  if (txt == "" || txt == null) return true;
  if (txt.length < 5)
    return {
      status: false,
      msg: "Drawing format is invalid",
    };
  //const txt = "X12CX-108";
  const values = (str) => {
    str = str
      .toString()
      .trim()
      .replace(/(\r\n|\n|\r)/g, "");
    str = str.replaceAll(" ", "");
    return str;
  };

  const drawing = values(txt);
  const gno = drawing.indexOf("G");
  //const hno = drawing.indexOf("H");
  const dno = drawing.indexOf("-");
  const dwg = [];
  if ((gno >= 8 && gno <= 9) || (dno >= 5 && dno <= 9)) {
    //const index = gno > 0 ? gno : hno > 0 ? hno : dno;
    const index = gno > 0 ? gno : dno;
    //console.log(index);
    dwg.push(drawing.substring(0, index));
    dwg.push(drawing.substring(index));
  } else {
    dwg.push(drawing);
  }

  if (dwg[0] === undefined && drawing.length > 9) {
    return {
      status: false,
      msg: "Drawing format is invalid",
    };
  }

  if (dwg[1] !== undefined && dwg[1].length > 6) {
    const detail = await childDrawing(dwg[1]);
    if (detail.status === false) {
      return {
        status: false,
        msg: detail.msg,
      };
    }
  }

  return { status: true, value: dwg };
}

function childDrawing(val) {
  const value = [];
  const tail = [];
  value.push(val.substring(0, 3));
  value.push(val.substring(3));

  let str = value[1].split("L");
  for (let index = 0; index < str.length; index++) {
    if (str[index].length > 0 && str[index] <= 99) {
      tail.push("L" + str[index]);
    } else {
      if (index > 0) {
        return {
          status: false,
          msg: `L Value (${str[index]}) is not valid`,
        };
      }
    }
  }
  return {
    status: true,
    value: { gno: value[0], lno: tail },
  };
}
