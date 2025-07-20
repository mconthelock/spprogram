import * as base from "../service/inquiry.js";
import {
  getPriceRatio,
  getQuotationType,
  getShipments,
  getDeliveryTerm,
  getAgent,
  getCountries,
} from "../service/priceratio.js";
import { getCurrency } from "../service/currency.js";

export const dataSourceFunctions = {
  getTraders: async function () {
    const data = await getPriceRatio();
    const traders = data.map((item) => item.TRADER);
    const uniqueTraders = [...new Set(traders)];
    let options = uniqueTraders.map((trader) => {
      return {
        id: trader,
        text: trader,
      };
    });
    options.unshift({ id: "", text: "" });
    return options;
  },

  getQuoType: async function () {
    const data = await getQuotationType();
    let options = data.map((type) => {
      return {
        id: type.QUOTYPE_ID,
        text: type.QUOTYPE_DESC,
      };
    });
    options.unshift({ id: "", text: "" });
    return options;
  },

  getShipment: async function () {
    const data = await getShipments();
    let options = data.map((shp) => {
      return {
        id: shp.SHIPMENT_ID,
        text: shp.SHIPMENT_DESC,
      };
    });
    options.unshift({ id: "", text: "" });
    return options;
  },

  getCurrency: async function () {
    const data = await getCurrency();
    const currency = data.filter((item) => item.CURR_LATEST == "1");
    let options = currency.map((cur) => {
      return {
        id: cur.CURR_CODE,
        text: cur.CURR_CODE,
      };
    });
    options.unshift({ id: "", text: "" });
    return options;
  },

  getDeliveryTerm: async function () {
    const data = await getDeliveryTerm();
    let options = data.map((term) => {
      return {
        id: term.TERM_ID,
        text: term.TERM_DESC,
      };
    });
    options.unshift({ id: "", text: "" });
    return options;
  },

  getAgent: async function () {
    const data = await getAgent();
    let options = data.map((term) => {
      return {
        id: term.TERM_ID,
        text: term.TERM_DESC,
      };
    });
    options.unshift({ id: "", text: "" });
    return options;
  },

  getCountries: async function () {
    const data = await getCountries();
    let options = data.map((term) => {
      return {
        id: term.TERM_ID,
        text: term.TERM_DESC,
      };
    });
    options.unshift({ id: "", text: "" });
    return options;
  },
};

export const eventHandlers = {
  handleProjectChange: async (e) => {
    const obj = e.target;
    const loader = $(obj).closest(".input").find(".loading");
    loader.removeClass("hidden");
    const data = await base.getProject(obj.value);
    console.log(data, `handleProjectChange`);
    loader.addClass("hidden");
  },

  handleInquiryChange: (event) => {},
  handleRatioChange: (event) => {},
};
