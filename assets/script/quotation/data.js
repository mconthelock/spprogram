import { showDigits, intVal } from "@amec/webasset/utils";
export const calPrice = (data) => {
	const fccost = intVal(data.INQD_FC_COST);
	const fcbase = intVal(data.INQD_FC_BASE);
	const tccost = Math.ceil(fccost * fcbase);
	const tcbase = data.INQD_TC_BASE;
	const exrate = data.INQD_EXRATE || 1;
	const unitprice = Math.ceil((tccost * tcbase) / exrate);
	const amount = unitprice * intVal(data.INQD_QTY);
	return { tccost, unitprice, amount };
};
