import { currentUser } from "@amec/webasset/api/amec";
import { formatDrawingNo, validateVariable } from "./drawing.js";
/*
Table: RTNLIBF.Q601KP1
Q6K101            Inquiry No.                                    20
Q6K102            Original Order                                  8
Q6K103            Original Proj                                  15
Q6K104            Original PRND Schd                              7
Q6K105            Series                                          7
Q6K106            Original Spec                                  20
Q6K107            WS-ID                                          10
Q6K108            User-ID                                        10
Q6K109            Revision                                        1
Q6K110            Last Tran Date                                  8    0
Q6K111            Last Tran Time                                  6    0
*/
export async function setAS400Header(header, MFGNO) {
	const user = await currentUser();
	const strc = [
		{ Q6K101: header.INQ_NO },
		{ Q6K102: MFGNO.trim().substring(0, 8) },
		{ Q6K103: header.INQ_PRJNO.trim().substring(0, 15) },
		{ Q6K104: header.INQ_PRDSCH.trim().substring(0, 7) },
		{ Q6K105: header.INQ_SERIES },
		{ Q6K106: header.INQ_SPEC.trim().substring(0, 20) },
		{ Q6K108: user.empno },
		{ Q6K109: header.INQ_REV },
	];
	let row = [];
	strc.map((item) => {
		const key = Object.keys(item)[0];
		const value = item[key];
		const data = {
			field: key,
			value: value,
			op: "eq",
			type: "string",
		};
		row.push(data);
	});
	return row;
}
/*
Table: RTNLIBF.Q601KP2
Q6K201            Inquiry No.                                    20
Q6K202            S/N                                             3    0
Q6K203            Car No.                                         2
Q6K204            Item No.                                        3
Q6K205            Description                                    30
Q6K206            Drawing No.                                     9
Q6K207            G/NO                                            4
Q6K208            L/NO                                            3
Q6K209            L/NO1                                           2
Q6K210            L/NO2                                           2
Q6K211            L/NO3                                           2
Q6K212            L/NO4                                           2
Q6K213            L/NO5                                           2
Q6K214            L/NO6                                           2
Q6K215            L/NO7                                           2
Q6K216            L/NO8                                           2
Q6K217            Qty                                             3    0
Q6K218            Remark                                         30
Q6K219            " " = NORMAL,"N"= NO B/M,"Y"=B/M,"R"= REVI      1
Q6K220            Common                                          1
Q6K221            Status Mail                                     1
Q6K222            WS-ID                                          10
Q6K223            US-ID                                          10
Q6K224            Last Tran Date                                  8    0
Q6K225            Last Tran Time                                  6    0
Q6K226            A= AMEC ,M = MELINA                             1
*/
export async function setAS400Detail(INQ_NO, details) {
	const user = await currentUser();
	const rows = [];
	details.map(async (el, i) => {
		if (el.INQD_LATEST == 1) {
			const strc = [
				{ Q6K201: INQ_NO },
				{ Q6K202: el.INQD_RUNNO },
				{ Q6K203: el.INQD_CAR },
				{ Q6K204: el.INQD_ITEM },
				{ Q6K205: el.INQD_PARTNAME.trim().substring(0, 30) },
				{ Q6K217: el.INQD_QTY },
				{ Q6K223: user.empno },
				{ Q6K226: "A" },
			];

			let dwg = el.INQD_DRAWING.replace(/\s+/g, "");
			const dwgval = await formatDrawingNo(dwg);
			const dwgarr = dwgval.split(" ");
			let prefix = 206;
			dwgarr.map((part, index) => {
				const key = `Q6K${prefix + index}`;
				if (index > 2) {
					part = part.replace(/L/g, "");
				}
				strc.push({ [key]: part });
			});

			let row = [];
			strc.map((item) => {
				const key = Object.keys(item)[0];
				const value = item[key];
				const data = {
					field: key,
					value: value,
					op: "eq",
					type:
						key === "Q6K202" || key === "Q6K217"
							? "number"
							: "string",
				};
				row.push(data);
			});
			rows.push(row);
		}
	});
	return rows;
}
/*
Table: RTNLIBF.Q601KP4
Q6K401            Inquiry No.                                    20
Q6K402            S/N                                             3    0
Q6K403            Variable                                        3
Q6K404            Valus                                           9
*/
export async function setAS400Variable(INQ_NO, details) {
	const rows = [];
	details.map(async (el, i) => {
		if (!(el.INQD_VARIABLE == "" || el.INQD_VARIABLE == null)) {
			let str = el.INQD_VARIABLE.replace(/\s+/g, "");
			const varval = await validateVariable(str);
			if (varval.isValid) {
				let row = [];
				Object.keys(varval.parsedData).forEach((key) => {
					if (varval.parsedData[key].length > 9) {
						const acctxt = (input) => {
							const words = input.split(",");
							return words.reduce((acc, word) => {
								if (
									acc.length === 0 ||
									acc[acc.length - 1].length +
										word.length +
										1 >
										9
								) {
									acc.push(word);
								} else {
									acc[acc.length - 1] += `,${word}`;
								}
								return acc;
							}, []);
						};
						const result = acctxt(varval.parsedData[key]);
						result.map((part, index) => {
							const strc = [
								{ Q6K401: INQ_NO },
								{ Q6K402: el.INQD_RUNNO },
								{ Q6K403: key },
								{ Q6K404: part },
							];
							row.push(strc);
						});
					} else {
						const strc = [
							{ Q6K401: INQ_NO },
							{ Q6K402: el.INQD_RUNNO },
							{ Q6K403: key },
							{ Q6K404: varval.parsedData[key] },
						];
						row.push(strc);
					}
				});
				let lines = [];
				row.map((item) => {
					let line = [];
					item.map((its) => {
						const data = {
							field: Object.keys(its)[0],
							value: Object.values(its)[0],
							op: "eq",
							type:
								Object.keys(its)[0] === "Q6K402"
									? "number"
									: "string",
						};
						line.push(data);
					});
					lines.push(line);
				});
				rows.push(lines);
			}
		}
	});

	return rows;
}

export async function addAS400Data(data) {
	console.log("Oh hi, Do you call me? I am here");
	return new Promise((resolve, reject) => {
		$.ajax({
			url: `${process.env.APP_API}/sp/prebm/create/`,
			type: "POST",
			dataType: "json",
			data: data,
			success: function (response) {
				resolve(response);
			},
			error: function (error) {
				reject(error);
			},
		});
	});
}
