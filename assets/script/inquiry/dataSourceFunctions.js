import * as fn from "./data.js";
export const dataSourceFunctions = {
  getTraders: async function () {
    return ["", "Dynamic Trader A", "Dynamic Trader B", "Mitsubishi Corp"];
  },

  getCountries: async function () {
    return ["", "Thailand (DB)", "Japan (DB)", "USA (DB)", "Germany (DB)"];
  },
};

export const eventHandlers = {
  handleProjectChange: async (e) => {
    const obj = e.target;
    const loader = $(obj).closest(".input").find(".loading");
    loader.removeClass("hidden");
    const data = await fn.getProject(obj.value);
    console.log(data, `handleProjectChange`);
    loader.addClass("hidden");
  },
  handleInquiryChange: (event) => {},
  handleRatioChange: (event) => {},
};
