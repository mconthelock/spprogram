import * as mst from "../service/master.js";
import * as mkt from "../service/mkt.js";
import * as inq from "../service/inquiry.js";
import { amecschdule, showMessage } from "../utils.js";

export const dataSourceFunctions = {
  getTraders: async function () {
    const data = await mst.getPriceRatio();
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
    const data = await mst.getQuotationType();
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
    const data = await mst.getShipments();
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
    const data = await mst.getCurrency();
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
    const data = await mst.getDeliveryTerm();
    let options = data.map((term) => {
      return {
        id: term.TERM_ID,
        text: term.TERM_DESC,
      };
    });
    options.unshift({ id: "", text: "" });
    return options;
  },

  getMethod: async function () {
    const data = await mst.getMethod();
    let options = data.map((method) => {
      return {
        id: method.METHOD_ID,
        text: method.METHOD_DESC,
      };
    });
    options.unshift({ id: "", text: "" });
    return options;
  },

  getAgent: async function () {
    const data = await mkt.getAgent();
    const agents = data.filter((item) => item.STATUS == "Enabled");
    let options = agents.map((agent) => {
      return {
        id: `${agent.AGENT} (${agent.country.CTNAME})`,
        text: `${agent.AGENT} (${agent.country.CTNAME})`,
      };
    });
    options.unshift({ id: "", text: "" });
    return options;
  },

  getCountries: async function () {
    const data = await mkt.getCountries();
    let options = data.map((country) => {
      return {
        id: country.CTNAME,
        text: country.CTNAME,
      };
    });
    options.unshift({ id: "", text: "" });
    return options;
  },

  getSeries: async function () {
    const data = await mkt.getSeries();
    let options = data.map((series) => {
      return {
        id: series.ABBREVIATION,
        text: series.ABBREVIATION,
      };
    });
    options.unshift({ id: "", text: "" });
    return options;
  },
};

export const eventHandlers = {
  //Original Project
  handleProjectChange: async (e) => {
    const obj = e.target;
    const loader = $(obj).closest(".input").find(".loading");
    loader.removeClass("hidden");

    const q = { PRJ_NO: obj.value };
    const data = await mkt.getMainProject(q);
    if (data.length > 0) {
      const values = data[0];
      Object.keys(values).forEach(async (key) => {
        if ($('input[data-mapping="' + key + '"]').length > 0) {
          const input = $('input[data-mapping="' + key + '"]');
          if (input.attr("id") == "schedule") {
            const val = await amecschdule(values[key]);
            input.val(val);
          } else {
            input.val(values[key]);
          }
        }

        if ($('select[data-mapping="' + key + '"]').length > 0) {
          let val = values[key];
          const selected = $('select[data-mapping="' + key + '"]');
          if (selected.attr("id") == "agent") {
            val = `${values.AGENT} (${values.DSTN})`;
          }

          $('select[data-mapping="' + key + '"]').val(val);
          $('select[data-mapping="' + key + '"]').trigger("change");
        }
      });
    }

    $("#inquiry-no").focus().select();
    loader.addClass("hidden");
  },

  handleInquiryChange: async (e) => {
    const settting = (val) => {
      console.log(val);
    };

    const obj = e.target;
    const loader = $(obj).closest(".input").find(".loading");
    loader.removeClass("hidden");

    const values = obj.value
      .trim()
      .replace(/(\r\n|\n|\r)/g, "")
      .replaceAll(" ", "")
      .toUpperCase();

    const inquiry = await inq.getInquiry({ INQ_NO: values });
    if (inquiry.length > 0) {
      showMessage(`Inquiry ${values} is already exist!`);
      $("#inquiry-no").focus().select();
      loader.addClass("hidden");
      return;
    }

    const controller = await mst.getControl();
    const prefix = controller.find(
      (clt) => clt.CNT_PREFIX == values.substring(0, 5)
    );
    if (prefix !== undefined) {
    } else {
      const agent = $("#agent").val().split("(")[0].trim();
      const anyprefix = controller.find(
        (clt) => clt.CNT_AGENT == agent && clt.CNT_PREFIX == "Any"
      );

      settting(anyprefix);
    }

    loader.addClass("hidden");
  },
  handleRatioChange: (event) => {},
};
