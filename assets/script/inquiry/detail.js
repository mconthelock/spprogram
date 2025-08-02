import "select2/dist/css/select2.min.css";
import "select2";
import moment from "moment";

import { readInput } from "@public/_excel.js";
import { dataSourceFunctions, eventHandlers } from "./dataSourceFunctions";
import formData from "../../files/formData.json";
import { getReason } from "../service/master";
import { getMainProject } from "../service/mkt.js";
import { creatBtn } from "../utils";

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

export async function createFieldInput(field) {
  const inputContainer = document.createElement("div");
  inputContainer.className = "col-span-2";
  let elementToListen;
  const loader = document.createElement("span");
  loader.className = "loading loading-spinner";
  switch (field.type) {
    case "readonly":
    case "text":
    case "date":
      const inputLabel = `<label class="input bg-white w-full">
            <input type="${field.type}" id="${field.id}"
                name="${field.name !== undefined ? field.name : field.id}"
                class="w-full   ${field.class !== undefined ? field.class : ""}"
                value="${field.value === undefined ? "" : field.value}"
                ${field.type == "readonly" ? "readonly" : ""}
                data-mapping="${field.mapping}"/>
            <span class="loading loading-spinner text-primary  hidden"></span>
        </label>`;
      inputContainer.innerHTML = inputLabel;
      elementToListen = inputContainer.querySelector(`#${field.id}`);
      break;
    case "textarea":
      const textarea = `<textarea name="${field.name}"
        id="${field.id}"
        class="textarea w-full
        ${field.class !== undefined ? field.class : ""}"
        data-mapping="${field.mapping}"
        ></textarea>`;
      inputContainer.innerHTML = textarea;
      break;

    case "select":
      const selectInput = document.createElement("select");
      selectInput.id = field.id;
      selectInput.name = field.name;
      selectInput.setAttribute("data-mapping", field.mapping);
      selectInput.className =
        "w-full border border-gray-300 rounded-md p-2 bg-white select2";

      let options = [];
      if (field.source) {
        if (dataSourceFunctions[field.source]) {
          options = await dataSourceFunctions[field.source]();
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
      }, 1000);
      break;

    case "radio":
      const radioGroup = document.createElement("div");
      radioGroup.className = "flex items-center gap-4 h-full";
      field.options.forEach((opt) => {
        const label = document.createElement("label");
        label.className = "flex items-center gap-1";

        const radioInput = document.createElement("input");
        radioInput.type = "radio";
        radioInput.name = field.name;
        radioInput.value = opt == "Yes" ? "1" : "0"; // Assuming Yes/No options
        radioInput.checked = true;
        radioInput.className = "radio radio-sm radio-primary text-primary";
        if (opt === field.value) {
          radioInput.checked = true;
        }

        label.appendChild(radioInput);
        label.append(` ${opt}`);
        radioGroup.appendChild(label);
      });
      inputContainer.appendChild(radioGroup);
      break;

    case "status":
      const statusBadge = document.createElement("span");
      statusBadge.className = field.class;
      statusBadge.textContent = field.display;
      statusBadge.id = "status-badge";
      inputContainer.appendChild(statusBadge);

      const hiddenStatus = document.createElement("input");
      hiddenStatus.type = "text";
      hiddenStatus.id = field.id;
      hiddenStatus.value = field.value;
      hiddenStatus.name = field.name;
      hiddenStatus.className = "hidden";
      inputContainer.appendChild(hiddenStatus);
      break;
    case "hidden":
      const hiddenInput = document.createElement("input");
      hiddenInput.type = "hidden";
      hiddenInput.id = field.id;
      hiddenInput.name = field.name;
      hiddenInput.value = field.value;
      inputContainer.appendChild(hiddenInput);
      break;
    case "staticText":
      const staticText = document.createElement("p");
      staticText.className =
        "text-sm h-full flex items-center text-gray-700 border-b border-gray-300 pb-2 ps-2 view-data";
      staticText.textContent = field.display;
      staticText.setAttribute("data-mapping", field.mapping);
      inputContainer.appendChild(staticText);

      const hiddenText = document.createElement("input");
      hiddenText.type = "text";
      hiddenText.id = field.id;
      hiddenText.name = field.name;
      hiddenText.value = field.value;
      hiddenText.className = "hidden";
      inputContainer.appendChild(hiddenText);
      break;

    default:
      const defaultInput = document.createElement("input");
      defaultInput.type = "text";
      defaultInput.id = field.id;
      defaultInput.name = field.name;
      if (field.class !== undefined) {
        defaultInput.classList.add(field.class);
      }
      inputContainer.appendChild(defaultInput);
  }

  if (elementToListen && field.onChange && eventHandlers[field.onChange]) {
    elementToListen.addEventListener("change", eventHandlers[field.onChange]);
  }
  return inputContainer;
}

export async function createFormCard(cardData) {
  const card = document.createElement("div");
  card.className = "bg-white rounded-lg shadow overflow-hidden px-6 pt-3";

  const header = document.createElement("div");
  header.className = "text-primary p-3 font-semibold";
  header.textContent = cardData.title;
  card.appendChild(header);

  const body = document.createElement("div");
  body.className = "p-4 space-y-4";

  // ใช้ for...of loop เพื่อให้สามารถใช้ await ได้
  for (const field of cardData.fields) {
    const fieldWrapper = document.createElement("div");
    fieldWrapper.className = "grid grid-cols-3 items-center gap-2 min-h-[42px]";

    const label = document.createElement("label");
    label.htmlFor = field.id || "";
    label.className = "text-sm font-medium text-gray-600 col-span-1";
    label.textContent = field.label;

    // รอให้ field สร้างเสร็จก่อน (เผื่อต้อง fetch data)
    const inputElement = await createFieldInput(field);
    fieldWrapper.appendChild(label);
    fieldWrapper.appendChild(inputElement);
    body.appendChild(fieldWrapper);
  }

  card.appendChild(body);
  return card;
}

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

  const btnSave = await creatBtn({
    id: "save-reason",
    className: "btn-outline  btn-primary  text-primary hover:text-white",
  });
  const btnCancel = await creatBtn({
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

export async function elmesComponent() {
  const confirmBtn = await creatBtn({
    id: "elmes-confirm",
    title: "Confirm",
    icon: "",
    className: "btn-primary btn-outline text-primary hover:text-white",
  });
  const cancelBtn = await creatBtn({
    id: "elmes-cancel",
    title: "Cancel",
    icon: "icofont-close text-2xl",
    className: "btn-neutral btn-outline text-neutral hover:text-white",
  });

  const str = `<input type="checkbox" id="showElmes" class="modal-toggle" />
    <div class="modal" role="dialog">
        <div class="modal-box w-[100vw] max-w-[100vw] h-[100vh] overflow-y-scroll">
            <h3 class="text-lg font-bold">Part List</h3>
            <table id="tableElmes" class="table w-full"></table>
            <input type="text" id="elmes-target"/>
            <div class="flex gap-2">${confirmBtn}${cancelBtn}</div>
        </div>
    </div>`;
  $("body").append(str);
}

export async function elmesTable(data) {
  const opt = {};
  opt.data = data;
  opt.columns = [
    { data: "orderno", title: "MFG No." },
    { data: "carno", title: "Car" },
    { data: "itemno", title: "Item" },
    { data: "partname", title: "Part Name" },
    { data: "drawing", title: "Drawing No." },
    { data: "variable", title: "Variable" },
    { data: "qty", title: "Qty" },
    {
      data: "supply",
      title: "Supply",
      render: (data) => {
        return `AMEC`;
      },
    },
    { data: "scndpart", title: `2<sup>nd</sup>` },
  ];
  return opt;
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
      const init = await initRow(el[1]);
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
    const init = initRow(el[1]);
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

export function initRow(id) {
  return {
    id: id,
    INQD_ID: "",
    INQD_SEQ: id,
    INQD_RUNNO: "",
    INQD_MFGORDER: "",
    INQD_ITEM: "",
    INQD_CAR: "",
    INQD_PARTNAME: "",
    INQD_DRAWING: "",
    INQD_VARIABLE: "",
    INQD_QTY: 1,
    INQD_UM: "PC",
    INQD_SUPPLIER: "",
    INQD_SENDPART: "",
    INQD_UNREPLY: "",
    INQD_FC_COST: "",
    INQD_TC_COST: "",
    INQD_UNIT_PRICE: "",
    INQD_FC_BASE: "",
    INQD_TC_BASE: "",
    INQD_MAR_REMARK: "",
    INQD_DES_REMARK: "",
    INQD_FIN_REMARK: "",
    INQD_LATEST: "",
    INQD_OWNER: "",
  };
}

export async function setupCard() {
  const form = $("#form-container");
  const carddata = form.attr("data");
  const cardIds = carddata.split("|");

  // Create an array to hold promises for card creation
  const cardPromises = cardIds.map(async (cardId) => {
    return new Promise(async (resolve) => {
      const cardData = formData.find((item) => item.id === cardId);
      if (cardData) {
        const cardElement = await createFormCard(cardData);
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

export async function applyValueCard(data) {
  const form = $("#form-container");
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

  //Display Status
  const colors = await statusColors();
  const cls = colors.find((item) => item.id >= data.INQ_STATUS);
  $("#status-badge").addClass(cls.color);
  $("#status-badge").text(data.status.STATUS_DESC);
}
