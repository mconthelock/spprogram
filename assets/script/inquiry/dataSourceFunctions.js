export const dataSourceFunctions = {
  /**
   * จำลองการดึงรายชื่อ Traders จากฐานข้อมูล
   * @returns {Promise<string[]>} - Array ของรายชื่อ Traders
   */
  getTraders: async function () {
    console.log("Fetching traders...");
    //await new Promise((resolve) => setTimeout(resolve, 500));
    return ["", "Dynamic Trader A", "Dynamic Trader B", "Mitsubishi Corp"];
  },

  /**
   * จำลองการดึงรายชื่อประเทศจากฐานข้อมูล
   * @returns {Promise<string[]>} - Array ของรายชื่อประเทศ
   */
  getCountries: async function () {
    console.log("Fetching countries...");
    //await new Promise((resolve) => setTimeout(resolve, 300));
    return ["", "Thailand (DB)", "Japan (DB)", "USA (DB)", "Germany (DB)"];
  },
};
