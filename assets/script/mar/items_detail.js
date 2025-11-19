import { getCustomer } from "../service/customers.js";
import * as items from "../service/items.js";
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
  try {
    const data = await items.getItems({ ITEM_ID: $("#itemid").val() });
    for (const [key, value] of Object.entries(data[0])) {
      console.log(key);

      $(`.field-data[data-map="${key}"]`).val(value);
    }
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
        <input type="checkbox" class="checkbox checkbox-primary text-white" />${customer.CUS_NAME}
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
