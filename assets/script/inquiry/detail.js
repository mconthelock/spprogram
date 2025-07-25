import "select2/dist/css/select2.min.css";
import "select2";

import { dataSourceFunctions, eventHandlers } from "./dataSourceFunctions";
import { getReason } from "../service/master";
import { creatBtn } from "../utils";

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
                class="w-full   ${field.class !== undefined ? field.class : ""}"
                value="${field.value === undefined ? "" : field.value}" ${
        field.type == "readonly" ? "readonly" : ""
      }  data-mapping="${field.mapping}"/>
            <span class="loading loading-spinner text-primary  hidden"></span>
        </label>`;
      inputContainer.innerHTML = inputLabel;
      elementToListen = inputContainer.querySelector(`#${field.id}`);
      break;
    case "textarea":
      const textarea = `<textarea class="textarea ${
        field.class !== undefined ? field.class : ""
      }" id="${field.id}" name="${field.id}" data-mapping="${
        field.mapping
      }"></textarea>`;
      inputContainer.innerHTML = textarea;
      break;

    case "select":
      const selectInput = document.createElement("select");
      selectInput.id = field.id;
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
        radioInput.name = field.id;
        radioInput.value = opt;
        radioInput.className = "radio radio-sm radio-primary text-primary";
        if (opt === field.value) {
          radioInput.checked = true;
        }

        label.appendChild(radioInput);
        label.append(` ${opt}`);
        radioGroup.appendChild(label);
      });
      inputContainer.appendChild(radioGroup);
      const hiddenRadio = document.createElement("input");
      hiddenRadio.type = "text";
      hiddenRadio.id = field.id;
      hiddenRadio.value = field.value;
      hiddenRadio.className = "hidden";
      inputContainer.appendChild(hiddenRadio);
      break;

    case "status":
      const statusBadge = document.createElement("span");
      statusBadge.className =
        "bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full";
      statusBadge.textContent = field.value;
      inputContainer.appendChild(statusBadge);

      const hiddenStatus = document.createElement("input");
      hiddenStatus.type = "text";
      hiddenStatus.id = field.id;
      hiddenStatus.value = field.value;
      hiddenStatus.className = "hidden";
      inputContainer.appendChild(hiddenStatus);
      break;
    case "hidden":
      const hiddenInput = document.createElement("input");
      hiddenInput.type = "hidden";
      hiddenInput.id = field.id;
      hiddenInput.value = field.value;
      inputContainer.appendChild(hiddenInput);
      break;
    case "staticText":
      const staticText = document.createElement("p");
      staticText.className = "text-sm h-full flex items-center text-gray-700";
      staticText.textContent = field.value;
      inputContainer.appendChild(staticText);
      const hiddenText = document.createElement("input");
      hiddenText.type = "text";
      hiddenText.id = field.id;
      hiddenText.value = field.value;
      hiddenText.className = "hidden";
      inputContainer.appendChild(hiddenText);
      break;

    default:
      const defaultInput = document.createElement("input");
      defaultInput.type = "text";
      defaultInput.id = field.id;
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
