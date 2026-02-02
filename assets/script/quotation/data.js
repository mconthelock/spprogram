import { showDigits, intVal } from "@amec/webasset/utils";
export const calPrice = (data) => {
	const cost = intVal(data.INQD_FC_COST);
	const curr1 = intVal(data.INQD_FC_BASE);
	const tccost = cost * curr1;
	const profit = intVal(data.INQD_TC_BASE);
	const curr2 = intVal(data.INQD_EXRATE);
	const unitprice =
		curr2 == 0
			? 0
			: Math.ceil(intVal(showDigits((tccost * profit) / curr2), 3));
	const amount = unitprice * intVal(data.INQD_QTY);
	return { tccost, unitprice, amount };
};
