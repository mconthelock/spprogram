import "select2/dist/css/select2.min.css";
import "select2";

import { dataSourceFunctions, eventHandlers } from "./dataSourceFunctions.js";

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
      const inputLabel = `<label class="input bg-white">
            <input type="${field.type}" id="${field.id}"
                class="form-input-readonly  ${
                  field.class !== undefined ? field.class : ""
                }"
                value="${field.value === undefined ? "" : field.value}"/>
            <span class="loading loading-spinner text-primary  hidden"></span>
        </label>`;
      inputContainer.innerHTML = inputLabel;
      elementToListen = inputContainer.querySelector(`#${field.id}`);
      break;
    case "textarea":
      const textarea = document.createElement("textarea");
      textarea.id = field.id;
      textarea.className =
        "w-full border border-gray-300 rounded-md p-2 text-xs";
      if (field.class !== undefined) {
        textarea.classList.add(field.class);
      }
      inputContainer.appendChild(textarea);
      break;

    case "select":
      const selectInput = document.createElement("select");
      selectInput.id = field.id;
      selectInput.className =
        "w-full border border-gray-300 rounded-md p-2 bg-white";

      let options = [];
      if (field.source) {
        if (dataSourceFunctions[field.source]) {
          options = await dataSourceFunctions[field.source]();
        } else {
          console.error(`Data source function ${field.source} not found.`);
        }
      } else if (field.options) {
        options = field.options;
      }

      options.forEach((opt) => {
        const option = document.createElement("option");
        option.value = opt;
        option.textContent = opt;
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
      }, 0);
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
