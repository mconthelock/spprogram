import { showDigits, intVal } from "@amec/webasset/utils";
export const calPrice = (data, type) => {
	const fccost = intVal(data.INQD_FC_COST);
	const fcbase = intVal(data.INQD_FC_BASE);
	const tccost =
		type == 1 ? intVal(data.INQD_TC_COST) : Math.ceil(fccost * fcbase);
	const tcbase = data.INQD_TC_BASE;
	const exrate = data.INQD_EXRATE || 1;
	const unitprice = Math.ceil((tccost * tcbase) / exrate);
	const amount = unitprice * intVal(data.INQD_QTY);
	return { tccost, unitprice, amount };
};
