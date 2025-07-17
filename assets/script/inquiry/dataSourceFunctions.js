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
  handleProjectChange: (event) => {
    const selectedProject = event.target.value;
    const data = fn.getProject(selectedProject);
    console.log(data);
  },
  handleInquiryChange: (event) => {},
  handleRatioChange: (event) => {},
};
