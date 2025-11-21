import dayjs from "dayjs";
import {
  dragDropInit,
  dragDropListImage,
  handleFiles,
} from "@public/_dragdrop";
import { getCustomer } from "../service/customers.js";
import * as items from "../service/items.js";
import { getPriceList, updatePriceList } from "../service/pricelist.js";
import * as utils from "../utils.js";

$(async function () {
  try {
    await utils.initApp({ submenu: ".navmenu-price" });
    const customer = await listCustomer();
    const category = await listCategory();
    const dropdown = await setItemDetail();
  } catch (error) {
    console.log(error);
    await utils.errorMessage(error);
  } finally {
    await utils.showLoader({ show: false });
  }
});

async function setItemDetail() {
  if ($("#itemid").val() == "") {
    const el = await dragDropInit({
      showImg: true,
      format: "image",
      multiple: false,
    });
    $("#image-dropzone").append(el);
    return;
  }
  try {
    const data = await items.getItems({ ITEM_ID: $("#itemid").val() });
    for (const [key, value] of Object.entries(data[0])) {
      $(`.field-data[data-map="${key}"]`).val(value);
    }

    const prices = data[0].prices;
    if (prices.length > 0) {
      for (const [key, value] of Object.entries(prices[0])) {
        $(`.field-data[data-map="${key}"]`).val(value);
      }
    }

    const customers = data[0].itemscustomer;
    if (customers.length > 0) {
      customers.map((customer) => {
        $(`#customer input[type="checkbox"]`).each(function () {
          if ($(this).val() == customer.CUSTOMER_ID) {
            $(this).prop("checked", true);
          }
        });
      });
    }
    let list = "";
    if (data[0].ITEM_THUMB) {
      const images = await items.getItemsImage(data[0].ITEM_ID);
      list += await dragDropListImage({
        src: images,
      });
    }

    const el = await dragDropInit({
      showImg: true,
      format: "image",
      list: list,
      multiple: false,
    });
    $("#image-dropzone").append(el);
  } catch (error) {
    console.log(error);
    await utils.errorMessage(error);
  }
}

async function listCustomer() {
  try {
    const customer_list = await getCustomer();
    let customer_html = ``;
    customer_list.map((customer) => {
      customer_html += `<li class="w-full flex gap-3 flex-row mb-3">
        <input type="checkbox" class="checkbox checkbox-primary text-white" value="${customer.CUS_ID}" />${customer.CUS_NAME}
        </li>`;
    });
    $("#customer").html(customer_html);
  } catch (error) {
    console.log(error);
    await utils.errorMessage(error);
  }
}

async function listCategory() {
  try {
    const category = await items.getItemsCategory({});
    category
      .filter((cat) => cat != null)
      .map((cat) => {
        $("#item-category").append(
          `<option class="text-xs" value="${cat.CATE_ID}">${cat.CATE_NAME}</option>`
        );
      });
  } catch (error) {
    console.log(error);
    await utils.errorMessage(error);
  }
}

$(document).on("click", "#save-data", async function () {
  await utils.showLoader();
  let isValid = true;
  $(".field-data.req").each(function () {
    if ($(this).val() == "") {
      isValid = false;
      $(this).addClass("input-error");
    } else {
      $(this).removeClass("input-error");
    }
  });
  if (!isValid) {
    await utils.errorMessage({
      message: "Please fill in all required fields.",
    });
    await utils.showLoader({ show: false });
    return;
  }
  try {
    const action = $(this).attr("data-action");
    let payload = {};
    $(".field-data").each(function () {
      const key = $(this).attr("data-map");
      const value = $(this).val();
      if (key == "ITEM_DWG" || key == "ITEM_VARIABLE")
        payload[key] = value.toUpperCase();
      else payload[key] = value;
    });

    if (action == "add") {
      payload = {
        ...payload,
        ITEM_STATUS: 1,
        CREATE_AT: new Date().toISOString(),
        CREATE_BY: $("#user-login").attr("empname"),
      };
      const newitem = await items.createItems(payload);
      payload.ITEM_ID = newitem.ITEM_ID;
    } else {
      payload = {
        ...payload,
        ITEM_ID: $("#itemid").val(),
        UPDATE_AT: new Date().toISOString(),
        UPDATE_BY: $("#user-login").attr("empname"),
      };
      const updated = await items.updateItems(payload);
    }

    //Save Item Detail
    const files = $("#files")[0].files;
    if (files.length > 0) {
      const photo = new FormData();
      photo.append("files", files[0], files[0].name);
      photo.append("ITEM_ID", payload.ITEM_ID);
      const responsePhoto = await items.uploadItemsPhoto(photo);
    }
    //Save Price
    let maxYear =
      dayjs().format("M") < 4
        ? dayjs().format("YYYY") - 1
        : dayjs().format("YYYY");
    let maxPeriod = dayjs().format("M") < 4 ? 2 : 1;
    const lastest = await getPriceList({ LATEST: 1 });
    if (lastest.length > 0) {
      maxYear = Math.max(...lastest.map((p) => p.FYYEAR));
      maxPeriod = Math.max(...lastest.map((p) => p.PERIOD));
    }
    const prices = {
      FYYEAR: maxYear,
      PERIOD: maxPeriod,
      ITEM: payload.ITEM_ID,
      STATUS: 1,
      STARTIN: dayjs().format("YYYY-MM-DD"),
      INQUIRY: null,
      FCCOST: payload.FCCOST,
      FCBASE: payload.FCBASE,
      TCCOST: payload.TCCOST,
      LATEST: 1,
      CREATE_BY: $("#user-login").attr("empname"),
      CREATE_AT: new Date().toISOString(),
    };
    const responsePrice = await updatePriceList(prices);
    //Save Customer
    // const response = await items.updateItems(payload);
    // console.log(response);
    // await utils.successMessage("บันทึกข้อมูลเรียบร้อย");
  } catch (error) {
    console.log(error);
    await utils.errorMessage(error);
  } finally {
    await utils.showLoader({ show: false });
  }
});

$(document).on("blur", ".price-change", async function (e) {
  e.preventDefault();
  const fccost = parseFloat($("#fccost").val()) || 0;
  const fcrate = parseFloat($("#fcrate").val()) || 0;
  const tccost = Math.ceil(fccost * fcrate);
  $("#tccost").val(tccost);
});

$(document).on("change", 'input[name="files"]', async function (e) {
  handleFiles();
});

$(document).on("click", "#back-to-list", async function (e) {
  e.preventDefault();
  const user = await utils.userInfo();
  if (user.group == "MAR") {
    window.location.href = `${process.env.APP_ENV}/mar/items`;
    return;
  }
  window.location.href = `${process.env.APP_ENV}/fin/price`;
});
