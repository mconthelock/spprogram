import "select2/dist/css/select2.min.css";
import "@styles/datatable.min.css";
import "select2";
import moment from "moment";
import formData from "../../files/formData.json";
import { createTable, destroyTable } from "@public/_dataTable.js";
import { readInput } from "@public/_excel.js";
import { getReason } from "../service/master";
import { getElmesItem } from "../service/elmes.js";
import { getMainProject } from "../service/mkt.js";
import * as service from "../service/inquiry.js";
import * as utils from "../utils.js";
import * as source from "./source";
import * as tb from "./table.js";

export const statusColors = () => {
  return [
    { id: 1, color: "bg-gray-500 text-white" }, //Draft
    { id: 19, color: "bg-indigo-500" }, //MAR Pre process
    { id: 29, color: "bg-sky-500" }, //SE
    { id: 39, color: "bg-amber-500" }, //DE
    { id: 49, color: "bg-slate-500" }, //IS
    { id: 59, color: "bg-pink-500 text-white" }, //FIN
    { id: 98, color: "bg-red-900" }, //MAR Post process
    { id: 99, color: "bg-emerald-500" }, //Fihish
  ];
};

// Create card
export async function setupCard(data) {
  const form = $("#form-container");
  const carddata = form.attr("data");
  const cardIds = carddata.split("|");
  const cardPromises = cardIds.map(async (cardId) => {
    return new Promise(async (resolve) => {
      const cardData = formData.find((item) => item.id === cardId);
      if (cardData) {
        const cardElement = await createFormCard(cardData, data);
        resolve(cardElement);
      } else {
        console.error(`Card data for ID ${cardId} not found.`);
        resolve(null);
      }
    });
  });

  const cardElements = await Promise.all(cardPromises);
  cardElements.forEach((element) => {
    if (element) {
      form.append(element);
      if ($(element).find("#currency").length > 0) {
        $(element).find("#currency").closest(".grid").addClass("hidden");
      }
    }
  });
}
export async function setFieldValue(field, data = {}) {
  const dspName = () => {
    return `ddddd`;
  };

  const dspDetail = (data, topic, cols) => {
    return data[topic][cols];
  };

  const dspStatus = async (data, field) => {
    const colors = await statusColors();
    const cls = colors.find((item) => item.id >= data.INQ_STATUS);
    field.class = cls.color;
    field.display = data.status.STATUS_DESC;
    return field;
  };

  // Start hear
  field.value = data[field.name];
  if (field.name == "INQ_DATE")
    field.value = moment(field.value).format("YYYY-MM-DD");

  if (field.name == "INQ_AGENT")
    field.value = `${data["INQ_AGENT"]} (${data["INQ_COUNTRY"]})`;

  if (field.name == "INQ_PKC_REQ")
    field.display = data["INQ_PKC_REQ"] == 1 ? "Yes" : "No";

  if (field.class == "displayname") field.display = dspName("12069");
  if (field.class == "nesting")
    field.display = dspDetail(data, field.topic, field.mapping);

  if (field.type == "status") field = dspStatus(data, field);
  return field;
}

export async function createFormCard(cardData, data = {}) {
  const card = document.createElement("div");
  card.className = "bg-white rounded-lg shadow overflow-hidden px-6 pt-3";

  const header = document.createElement("div");
  header.className = "text-primary p-3 font-semibold";
  header.textContent = cardData.title;
  card.appendChild(header);

  const body = document.createElement("div");
  body.className = "p-4 space-y-4";
  // ใช้ for...of loop เพื่อให้สามารถใช้ await ได้
  for (let field of cardData.fields) {
    const fieldWrapper = document.createElement("div");
    fieldWrapper.className = "grid grid-cols-3 items-center gap-2 min-h-[42px]";
    const label = document.createElement("label");
    label.htmlFor = field.id || "";
    label.className = "text-sm font-medium text-gray-600 col-span-1";
    label.textContent = field.label;

    // รอให้ field สร้างเสร็จก่อน (เผื่อต้อง fetch data)
    if (Object.keys(data).length !== 0)
      field = await setFieldValue(field, data);
    const inputElement = await createFieldInput(field);
    fieldWrapper.appendChild(label);
    fieldWrapper.appendChild(inputElement);
    body.appendChild(fieldWrapper);
  }

  card.appendChild(body);
  return card;
}

export async function createFieldInput(field) {
  const inputContainer = document.createElement("div");
  inputContainer.className = "col-span-2";
  let elementToListen;
  const loader = document.createElement("span");
  loader.className = "loading loading-spinner";
  switch (field.type) {
    // case "readonly":
    // case "text":
    // case "date":
    //   const inputLabel = `<label class="input bg-white w-full">
    //         <input type="${field.type}" id="${field.id}"
    //             name="${field.name !== undefined ? field.name : field.id}"
    //             class="w-full   ${field.class !== undefined ? field.class : ""}"
    //             value="${field.value === undefined ? "" : field.value}"
    //             maxlength="${
    //               field.maxlength !== undefined ? field.maxlength : ""
    //             }"
    //             ${field.type == "readonly" ? "readonly" : ""}
    //             data-mapping="${field.mapping}"/>
    //         <span class="loading loading-spinner text-primary  hidden"></span>
    //     </label>`;
    //   inputContainer.innerHTML = inputLabel;
    //   elementToListen = inputContainer.querySelector(`#${field.id}`);
    //   break;
    case "textarea":
      const textarea = `<textarea name="${field.name}"
        id="${field.id}" class="textarea w-full ${
        field.class !== undefined ? field.class : ""
      }" data-mapping="${field.mapping}"></textarea>`;
      inputContainer.innerHTML = textarea;
      break;

    case "select":
      const selectInput = `<select></select>`;
      /*const selectInput = document.createElement("select");
      selectInput.id = field.id;
      selectInput.name = field.name;
      selectInput.setAttribute("data-mapping", field.mapping);
      selectInput.className =
        "w-full border border-gray-300 rounded-md p-2 bg-white select2";

      let options = [];
      if (field.source) {
        if (source.init[field.source]) {
          options = await source.init[field.source]();
        }
      } else if (field.options) {
        options = field.options;
      }

      options.forEach((opt) => {
        const option = document.createElement("option");
        option.value = opt.id;
        option.textContent = opt.text;
        selectInput.appendChild(option);
      });

      if (field.value) selectInput.value = field.value;
      inputContainer.appendChild(selectInput);
      elementToListen = selectInput;

      setTimeout(() => {
        const jQueryElement = $(`#${field.id}`);
        jQueryElement.select2({ width: "100%" });

        if (field.onChange && eventHandlers[field.onChange]) {
          jQueryElement.on("change", eventHandlers[field.onChange]);
        }
      }, 1000);*/
      break;

    case "radio":
      let optionstr = ``;
      const value = field.value ? field.value : "0";
      field.options.forEach((opt) => {
        optionstr += `<label class="flex items-center gap-2 text-sm">
            <input type="radio" name="radio-4" class="radio radio-primary" ${
              opt.value == value ? "checked" : ""
            } /> ${opt.text}
        </label>`;
      });
      const radioGroup = `<div class="flex items-center gap-4 h-full">${optionstr}</div>`;
      inputContainer.innerHTML = radioGroup;
      break;

    case "status":
      const statusBadge = `<div class="badge ${field.class}">${field.display}</div><input type="hidden" name="${field.name}" value="${field.value}" id="${field.id}"/>`;
      inputContainer.innerHTML = statusBadge;
      break;

    case "hidden":
      inputContainer.innerHTML(
        `<input type="hidden" class="${field.class ? field.class : ""}" id="${
          field.id ? field.id : ""
        }" name="${field.name ? field.name : ""}" value="${
          field.value ? field.value : ""
        }"/>`
      );
      break;

    case "staticText":
      const staticText = `<p class="text-sm h-full flex items-center text-gray-700 border-b border-gray-300 pb-2 ps-2 ${
        field.class !== undefined ? field.class : ""
      }">${
        !field.display ? field.value : field.display
      }</p><input type="hidden" name="${field.name}" value="${
        field.value
      }" id="${field.id}"/>`;
      inputContainer.innerHTML = staticText;
      break;

    default:
      const inputLabel = `<label class="input bg-white w-full">
            <input type="${field.type}" id="${field.id}"
                name="${field.name !== undefined ? field.name : field.id}"
                class="w-full   ${field.class !== undefined ? field.class : ""}"
                value="${field.value === undefined ? "" : field.value}"
                maxlength="${
                  field.maxlength !== undefined ? field.maxlength : ""
                }"
                ${field.type == "readonly" ? "readonly" : ""}
                data-mapping="${field.mapping}"/>
            <span class="loading loading-spinner text-primary  hidden"></span>
        </label>`;
      inputContainer.innerHTML = inputLabel;
      elementToListen = inputContainer.querySelector(`#${field.id}`);
      break;
  }

  if (elementToListen && field.onChange && source.events[field.onChange]) {
    elementToListen.addEventListener("change", source.events[field.onChange]);
  }
  return inputContainer;
}

export async function importExcel(file) {
  const excelData = await readInput(file, {
    startRow: 2,
    endCol: 10,
    headerName: [
      "Inquiry No",
      "Seq. no",
      "Drawing No",
      "Part Name",
      "Qty",
      "Unit",
      "Variable",
      "Original MFG No",
      "Original Car No",
      "Item",
    ],
  });

  if (excelData.length > 0) {
    await importHeader({ mfgno: excelData[1][7], inquiryno: excelData[1][0] });
    const readdata = excelData.map(async (el, i) => {
      const init = await tb.initRow(el[1]);
      const newRow = {
        ...init,
        INQD_CAR: el[8],
        INQD_MFGORDER: el[7],
        INQD_ITEM: el[9],
        INQD_PARTNAME: el[3],
        INQD_DRAWING: el[2],
        INQD_VARIABLE: el[6],
        INQD_QTY: el[4],
        INQD_UM: el[5],
        INQD_SUPPLIER: "AMEC",
        INQD_OWNER: "MAR",
        INQ_NO: el[0],
      };
      return newRow;
    });
    //convert to array
    const result = await Promise.all(readdata);
    return result;
  } else {
    return null;
  }
}

export async function importText(file) {
  const readFile = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        resolve(e.target.result);
      };
      reader.onerror = (e) => {
        reject(e);
      };
      reader.readAsText(file);
    });
  };
  const contents = await readFile(file);
  const lines = contents.split("\n").filter((line) => line.trim() !== "");
  if (lines.length == 0) return null;

  const cols = lines[0].split("\t");
  if (cols.length !== 10) return;

  const readdata = [];
  lines.forEach(function (row) {
    const el = row.split("\t");
    const init = tb.initRow(el[1]);
    const newRow = {
      ...init,
      INQD_CAR: el[8],
      INQD_MFGORDER: el[7].replaceAll("-", ""),
      INQD_ITEM: el[9].substring(0, 3),
      INQD_PARTNAME: el[3],
      INQD_DRAWING: el[2],
      INQD_VARIABLE: el[6],
      INQD_QTY: el[4],
      INQD_UM: el[5],
      INQD_SUPPLIER: "AMEC",
      INQD_OWNER: "MAR",
      INQ_NO: el[0],
    };
    readdata.push(newRow);
  });
  await importHeader({
    mfgno: readdata[0].INQD_MFGORDER,
    inquiryno: readdata[0].INQ_NO,
  });
  return readdata;
}

export async function importHeader(data) {
  const prj = await getMainProject({ MFGNO: data.mfgno });
  if (prj.length > 0) {
    const projectNo = document.querySelector("#project-no");
    projectNo.value = prj[0].PRJ_NO;
    projectNo.dispatchEvent(new Event("change"));
  }

  const inqno = document.querySelector("#inquiry-no");
  inqno.value = data.inquiryno;
  inqno.dispatchEvent(new Event("change"));
}

export async function applyValueCard(data) {
  const form = $("#form-container");
  const applyWeight = (data) => {
    form.find(".weight").text(`${data == 1 ? "Yes" : "No"}`);
  };
  const applyQuotation = (data) => {
    form.find(".quotype").text(`${data.QUOTYPE_DESC}`);
  };
  const applyTerm = (data) => {
    form.find(".delivery").text(`${data.TERM_DESC}`);
  };
  const applyMethod = (data) => {
    form.find(".method").text(`${data.METHOD_DESC}`);
  };
  const applyShipment = (data) => {
    form.find(".shipment").text(`${data.SHIPMENT_DESC}`);
  };

  form.find(".view-data").map((i, el) => {
    const mapping = $(el).attr("data-mapping");
    if (mapping) {
      Object.keys(data).forEach((key) => {
        if (mapping == key) {
          let value = data[key];
          if (key === "INQ_DATE") value = moment(value).format("YYYY-MM-DD");
          $(el).text(value);
        }
      });
    }
  });

  await applyWeight(data.INQ_PKC_REQ);
  await applyQuotation(data.quotype);
  await applyTerm(data.term);
  await applyMethod(data.method);
  await applyShipment(data.shipment);

  //Display Status
  const colors = await statusColors();
  const cls = colors.find((item) => item.id >= data.INQ_STATUS);
  $("#status-badge").addClass(cls.color);
  $("#status-badge").text(data.status.STATUS_DESC);
}

//Start: Unreply
export async function createReasonModal() {
  const reason = await getReason();
  let str = ``;
  reason.map((item) => {
    if (item.REASON_ID == 99) {
      str += `<li class="flex flex-col gap-2">
        <div>
            <input type="radio" name="reason"
                class="radio radio-sm radio-neutral me-2 reason-code"
                id="reason-${item.REASON_ID}"
                value="${item.REASON_ID}" />
            <span>${item.REASON_DESC}</span>
        </div>
        <div>
            <fieldset class="fieldset">
                <textarea class="textarea w-full text-comment" placeholder="Explain why can't reply this line" id="text-comment-other"></textarea>
                <div class="label text-xs justify-start text-red-500 text-comment-err"></div>
                <div class="label text-xs justify-end"><span id="text-count">0</span>/100</div>
            </fieldset>
        </div>
      </li>`;
    } else {
      str += `<li>
        <input type="radio" name="reason"
            class="radio radio-sm radio-neutral me-2 reason-code"
            id="reason-${item.REASON_ID}" value="${item.REASON_ID}"/>
        <input type="hidden" class="text-comment" value="${item.REASON_DESC}"/>
        <span>${item.REASON_DESC}</span>
      </li>`;
    }
  });

  const btnSave = await utils.creatBtn({
    id: "save-reason",
    className: "btn-outline  btn-primary  text-primary hover:text-white",
  });
  const btnCancel = await utils.creatBtn({
    id: "cancel-reason",
    title: "Cancel",
    icon: "icofont-close text-2xl",
    className: "btn-outline  btn-neutral  text-neutral hover:text-white",
  });

  const modal = `<input type="checkbox" id="modal-reason" class="modal-toggle" />
        <div class="modal" role="dialog">
            <div class="modal-box p-8">
                <h3 class="text-lg font-bold mb-3">Unable to reply reason</h3>
                <div class="divider"></div>
                <ul class="flex flex-col gap-3">${str}</ul>
                <input type="hidden" id="reason-target"/>
                <div class="flex gap-2">${btnSave}${btnCancel}</div>
            </div>
        </div>
    `;
  $("body").append(modal);
}

export async function clickUnreply(row) {
  //   const row = table.row($(this).parents("tr"));
  const data = row.data();
  if (data.INQD_UNREPLY != "") {
    $(`#reason-${data.INQD_UNREPLY}`).prop("checked", true);
    if (data.INQD_UNREPLY == 99)
      $("#text-comment-other").val(data.INQD_MAR_REMARK);
  } else {
    $(`.reason-code:first`).prop("checked", true);
  }
  $("#reason-target").val(row.index());
  $("#modal-reason").click();
}

export async function countReason(obj) {
  $(obj).removeClass("border-red-500");
  $(obj).closest("li").find(".text-comment-err").html("");
  $("#text-count").removeClass("text-red-500");
  const txt = $(obj).val();
  let cnt = $(obj).val().length;
  if (cnt > 100) {
    $("#text-count").addClass("text-red-500");
    $(obj).val(txt.substring(0, 100));
    $(obj).addClass("border-red-500");
    $(obj)
      .closest("li")
      .find(".text-comment-err")
      .html(`Maximun is 100 charactors.`);
    return;
  }
  $("#text-count").html(cnt);
}

export async function resetUnreply(row) {
  const target = $("#reason-target").val();
  $(row).find(".unreply").prop("checked", false);
  $(row).find(".remark").val(``);
  $("#text-comment-other").val(``);
  $("#text-count").html(`0`);
  $("#modal-reason").prop("checked", false);
}

export async function saveUnreply(table) {
  const target = $("#reason-target").val();
  const row = table.row(target);
  const selected = $(".reason-code:checked");
  const remark = selected.closest("li").find(".text-comment").val();
  if (remark == "" || selected.val() == undefined) {
    $(".text-comment").addClass("border-red-500");
    $(".text-comment-err").html(
      `Please explain reason, Why you can't reply this line.`
    );
    return;
  }

  $(table.row(target).node()).find(".unreply").prop("checked", true);
  $(table.row(target).node()).find(".unreply").val(selected.val());
  $(table.row(target).node()).find(".remark").val(remark);
  $("#reason-target").val(selected.val());

  const data = row.data();
  const newData = {
    ...data,
    INQD_UNREPLY: selected.val(),
    INQD_MAR_REMARK: remark,
  };

  table.row(target).data(newData);
  $("#text-comment-other").val(``);
  $("#text-count").html("0");
  $("#modal-reason").prop("checked", false);
}
//End: Unreply

//Start: Elmes
export async function elmesComponent() {
  const confirmBtn = await utils.creatBtn({
    id: "elmes-confirm",
    title: "Confirm",
    icon: "",
    className: "btn-primary btn-outline text-primary hover:text-white",
  });
  const cancelBtn = await utils.creatBtn({
    id: "elmes-cancel",
    title: "Cancel",
    icon: "icofont-close text-2xl",
    className: "btn-neutral btn-outline text-neutral hover:text-white",
  });

  const str = `<input type="checkbox" id="showElmes" class="modal-toggle" />
    <div class="modal" role="dialog">
        <div class="modal-box w-[100vw] max-w-[100vw] h-[100vh] overflow-y-scroll">
            <table id="tableElmes" class="table w-full"></table>
            <input type="hidden" id="elmes-target"/>
            <div class="flex gap-2 mt-3">${confirmBtn}${cancelBtn}</div>
        </div>
    </div>`;
  $("body").append(str);
}

export async function elmesSetup(row) {
  let tableElmes;
  const data = row.data();
  const mfgno = $(row.node()).find(".mfgno").val();
  const item = $(row.node()).find(".itemno").val();
  if (mfgno.length === 0 || item.length < 3) return;

  const elmes = await getElmesItem(mfgno, item);
  if (elmes.length > 0) {
    const setting = await tb.elmesTable(elmes);
    tableElmes = await createTable(setting, {
      id: "#tableElmes",
      columnSelect: { status: true },
    });
    $("#elmes-target").val(row.index());
    $("#showElmes").click();
  } else {
    const newData = {
      ...data,
      INQD_MFGORDER: mfgno,
      INQD_ITEM: item,
    };
    row.data(newData);
    row.draw(false);
    tableElmes = null;
  }
  return tableElmes;
}

export async function elmesConform(elmesData, increse, table) {
  const rowid = $("#elmes-target").val();
  const data = table.row(rowid).data();
  table.rows(rowid).remove().draw(); //Delete current row first
  //Insert rows
  let i = 0;
  let id = utils.intVal(data.INQD_SEQ);
  elmesData.map((val) => {
    if (val.selected !== undefined) {
      let supplier = `AMEC`;
      if (val.supply === "R") supplier = `LOCAL`;
      if (val.supply === "J") supplier = `MELINA`;
      if (val.supply === "U") supplier = ``;

      let second = `0`;
      if (val.scndpart != "" && val.scndpart.toUpperCase() !== "X")
        second = `1`;

      const newRow = {
        ...data,
        id: id + i,
        INQD_SEQ: id + i,
        INQD_CAR: val.carno,
        INQD_MFGORDER: val.orderno,
        INQD_ITEM: val.itemno,
        INQD_PARTNAME: val.partname,
        INQD_DRAWING: val.drawing,
        INQD_VARIABLE: val.variable,
        INQD_QTY: val.qty,
        INQD_SUPPLIER: supplier,
        INQD_SENDPART: second,
      };
      table.row.add(newRow).draw(false);
      i++;
    }
  });

  await destroyTable("#tableElmes");
  $("#tableElmes").html("");
  $("#elmes-target").val("");
  $("#showElmes").click();
}

export async function elmesCancel(table) {
  await destroyTable("#tableElmes");
  const inx = $("#elmes-target").val();
  $("#tableElmes").html("");
  $("#elmes-target").val("");
  $("#showElmes").click();
  $(table.row(inx).node()).find(".partname").focus();
}
//End: Elmes

//Start: Verify save form

//End: Verify save form
