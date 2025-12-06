import "datatables.net-responsive-dt/css/responsive.dataTables.min.css";
import "@styles/select2.min.css";
import "@styles/datatable.min.css";

import * as utils from "../utils.js";
import { createTable } from "@public/_dataTable.js";
import { setSelect2 } from "@public/_select2.js";
import { getItems, currentPeriod } from "../service/items.js";
import { findPriceRatio } from "../service/master.js";
import { getCustomer } from "../service/customers.js";

var table;
$(async function () {
  try {
    await utils.initApp({ submenu: ".navmenu-price" });
    const data = await setData();
    const opt = await tableOpt(data);
    table = await createTable(opt);
    // const customers = await cus.getCustomer();
    // const selected = $("#selected-customer").val();
    // const customer = customers.find((cus) => cus.CUS_ID == selected);
    // $("#page-title").html(`Price List for ${customer.CUS_DISPLAY}`);
    // const pricelistdata = await service.getPriceList();
    // const tbopt = await tableOpt(pricelistdata, customers, selected);
    // table = await createTable(tbopt);
  } catch (error) {
    console.log(error);
    await utils.errorMessage(error);
  } finally {
    await utils.showLoader({ show: false });
  }
});

async function setData() {
  const items = await getItems();
  const customers = await getCustomer();
  const customer = customers.find(
    (cus) => cus.CUS_ID == $("#selected-customer").val()
  );
  const selected = $("#selected-customer").val();
  const ratio = await findPriceRatio({
    SUPPLIER: "AMEC",
    TRADER: "Direct",
    QUOTATION: customer.CUS_QUOTATION,
  });
  const data = items
    .filter((item) => {
      return item.itemscustomer.some((cus) => cus.CUSTOMER_ID == selected);
    })
    .map((item) => ({
      ...item,
      ratio: ratio,
    }));
  return data;
}

async function tableOpt(data) {
  const period = await currentPeriod();
  $("#current-period").text(`${period.current.year}-${period.current.period}H`);
  $("#last-period").text(`${period.last.year}-${period.last.period}H`);
  const opt = { ...utils.tableOpt };
  opt.dom = `<"flex items-center mb-3"<"table-search flex flex-1 gap-5"f><"flex items-center table-option"l>><"bg-white border border-slate-300 rounded-2xl overflow-hidden"t><"flex mt-5 mb-3"<"table-info flex flex-col flex-1 gap-5"i><"table-page flex-none"p>>`;
  opt.data = data;
  opt.order = [[0, "asc"]];
  opt.pageLength = 25;
  opt.columns = [
    { data: "ITEM_NO" },
    { data: "ITEM_NAME", className: "max-w-[175px]" },
    { data: "ITEM_DWG", className: "max-w-[175px]" },
    {
      data: "ITEM_VARIABLE",
      className: "max-w-[175px] break-all",
    },
    { data: "ITEM_CLASS" },
    { data: "ITEM_UNIT" },
    {
      data: "ITEM_ID",
      render: (data, type, row) => {
        return row.ratio !== null ? row.ratio[0].CURRENCY : "-";
      },
    },
    //Current pepiod
    {
      data: "ITEM_ID",
      className: "border-l bg-primary/10",
      render: (data, type, row) => {
        //FC Cost
        const current = period.current;
        const price = row.prices.find(
          (p) =>
            p.FYYEAR == current.year && parseInt(p.PERIOD) == current.period
        );
        let pricePeriod = "-";
        if (price !== undefined) {
          pricePeriod = utils.digits(price.FCCOST);
        }
        return pricePeriod;
      },
    },
    {
      data: "ITEM_ID",
      className: "border-l bg-primary/10",
      render: (data, type, row) => {
        //FC Base
        const current = period.current;
        const price = row.prices.find(
          (p) =>
            p.FYYEAR == current.year && parseInt(p.PERIOD) == current.period
        );
        let pricePeriod = "-";
        if (price !== undefined) {
          pricePeriod = utils.digits(price.FCBASE, 2);
        }
        return pricePeriod;
      },
    },
    {
      data: "ITEM_ID",
      className: "border-l bg-primary/10",
      render: (data, type, row) => {
        //TC Cost
        const current = period.current;
        const price = row.prices.find(
          (p) =>
            p.FYYEAR == current.year && parseInt(p.PERIOD) == current.period
        );
        let pricePeriod = "-";
        if (price !== undefined) {
          pricePeriod = utils.digits(price.TCCOST);
        }
        return pricePeriod;
      },
    },
    {
      data: "ITEM_ID",
      className: "border-l bg-primary/10",
      render: (data, type, row) => {
        //Ratio
        return row.ratio !== null ? utils.digits(row.ratio[0].FORMULA, 2) : "-";
      },
    },

    {
      data: "ITEM_ID",
      className: "border-l bg-primary/10",
      render: (data, type, row) => {
        //TC Cost
        const current = period.current;
        const price = row.prices.find(
          (p) =>
            p.FYYEAR == current.year && parseInt(p.PERIOD) == current.period
        );
        let pricePeriod = "-";
        if (price !== undefined) {
          const ratio = row.ratio !== null ? row.ratio[0].FORMULA : 1;
          const tccost = Math.ceil(price.TCCOST * ratio);
          pricePeriod = utils.digits(tccost);
        }
        return pricePeriod;
      },
    },

    //Last pepiod
    {
      data: "ITEM_ID",
      className: "border-l bg-accent/10",
      render: (data, type, row) => {
        const current = period.last;
        const price = row.prices.find(
          (p) =>
            p.FYYEAR == current.year && parseInt(p.PERIOD) == current.period
        );
        let pricePeriod = "-";
        if (price !== undefined) {
          pricePeriod = utils.digits(price.FCCOST);
        }
        return pricePeriod;
      },
    },
    {
      data: "ITEM_ID",
      className: "border-l bg-accent/10",
      render: (data, type, row) => {
        const current = period.last;
        const price = row.prices.find(
          (p) =>
            p.FYYEAR == current.year && parseInt(p.PERIOD) == current.period
        );
        let pricePeriod = "-";
        if (price !== undefined) {
          pricePeriod = utils.digits(price.FCBASE, 2);
        }
        return pricePeriod;
      },
    },
    {
      data: "ITEM_ID",
      className: "border-l bg-accent/10",
      render: (data, type, row) => {
        const current = period.last;
        const price = row.prices.find(
          (p) =>
            p.FYYEAR == current.year && parseInt(p.PERIOD) == current.period
        );
        let pricePeriod = "-";
        if (price !== undefined) {
          pricePeriod = utils.digits(price.TCCOST);
        }
        return pricePeriod;
      },
    },
    {
      data: "ITEM_ID",
      className: "border-l bg-accent/10",
    },

    {
      data: "ITEM_ID",
      className: "border-l bg-accent/10",
    },
  ];

  opt.initComplete = async function () {
    //Table Right Options
    const customers = await getCustomer();
    const selected = $("#selected-customer").val();
    let cusSelect = ``;
    customers.map((cus) => {
      return (cusSelect += `<option value="${cus.CUS_ID}" ${
        cus.CUS_ID == selected ? "selected" : ""
      }>${cus.CUS_DISPLAY}</option>`);
    });
    $(".table-option").html(`
      <div class="flex items-center gap-3">
        <label for="selected-customer" class="whitespace-nowrap font-semibold">Customer:</label>
        <select id="customer-option" class="s2 select select2-sm">${cusSelect}</select>
      </div>
    `);
    //await setSelect2();
    // $("#customer-option").on("change", function () {
    //   alert($(this).val());
    // });
    // Table Footer Buttons
    const export1 = await utils.creatBtn({
      id: "export1",
      title: "Export",
      icon: "fi fi-tr-file-excel text-xl",
      className: `bg-accent text-white hover:shadow-lg`,
    });
    const importprice = await utils.creatBtn({
      id: "importprice",
      title: "Import Price",
      icon: "fi fi-rr-add text-xl",
      className: `bg-primary text-white hover:shadow-lg`,
    });

    $(".table-info").append(`<div class="flex gap-2">
        ${export1}
     </div>`);
  };
  return opt;
}

$(document).on("change", "#customer-option", function () {
  const cus = $(this).val();
  window.location.href = `${process.env.APP_ENV}/mar/price/index/${cus}`;
});
