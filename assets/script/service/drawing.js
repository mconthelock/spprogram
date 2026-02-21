export function validateDrawingNo(input) {
	if (!input || typeof input !== "string") return null;
	// ลบช่องว่างทั้งหมดก่อน
	let dwg = input.replace(/\s+/g, "");
	// 1. กรณีขึ้นต้นด้วย X และตัวที่ 6 เป็น G หรือ -
	if (dwg.startsWith("X") && dwg.length > 6 && /[G\-]/.test(dwg[5])) {
		return dwg.slice(0, 5) + " " + dwg.slice(5);
	}

	// 2. กรณีความยาวตรงเงื่อนไข และตำแหน่งที่กำหนดมี G หรือ -
	const lengthBasedRules = [
		{ length: 8, checkIndex: 5 },
		{ length: 9, checkIndex: 6 },
		{ length: 10, checkIndex: 7 },
		{ length: 11, checkIndex: 8 },
	];
	for (const rule of lengthBasedRules) {
		if (dwg.length === rule.length && /[G\-]/.test(dwg[rule.checkIndex])) {
			return (
				dwg.slice(0, rule.checkIndex) + " " + dwg.slice(rule.checkIndex)
			);
		}
	}

	dwg = formatDrawingNo(input);
	const fullPattern = /^([A-Z0-9]{8,9}) ([G\-][0-9]{2})((?: L[0-9]{2,3})*)$/;
	if (fullPattern.test(dwg)) {
		const spaceMatch = dwg.match(/ /g);
		const firstSpaceIndex = dwg.indexOf(" ");
		if (spaceMatch && spaceMatch.length > 1 && firstSpaceIndex !== -1) {
			dwg =
				dwg.slice(0, firstSpaceIndex) +
				" " +
				dwg.slice(firstSpaceIndex + 1).replace(/\s+/g, "");
		}
		return dwg;
	}

	if (dwg.length >= 5 && dwg.length <= 13) {
		return dwg;
	}
	return null; // ไม่ผ่านทุกเงื่อนไข
}

export function formatDrawingNo(input) {
	const basePattern = /^([A-Z0-9\-]{8,9})\s*([G\-][0-9]{2})(.*)$/;
	const match = input.match(basePattern);
	if (!match) return input;

	const dwgno = match[1];
	const gno = match[2];
	const lno = match[3] || "";
	const lval = [...lno.matchAll(/L[0-9]{2,3}/g)].map((m) => m[0]);
	return [dwgno, gno, ...lval].join(" ");
}

export function validateVariable(inputString) {
	if (inputString.endsWith(",")) {
		inputString = inputString.slice(0, -1);
	}
	let cleanedString = inputString.replace(/\s/g, "");
	const pairRegex = /([^=,]{1,3})=((?:[^,]+|,(?![^=,]{1,3}=))+)/g;
	let isValid = true;
	const errors = [];
	const parsedData = {};
	let lastIndex = 0;
	const matches = [...cleanedString.matchAll(pairRegex)];
	if (matches.length === 0 && cleanedString.length > 0) {
		isValid = false;
		errors.push("รูปแบบสตริงไม่ถูกต้อง: ไม่พบรูปแบบ KEY=VALUE ที่ถูกต้อง.");
		return { isValid, errors, parsedData };
	}

	for (const match of matches) {
		const fullMatch = match[0];
		const key = match[1];
		const value = match[2];

		if (match.index > lastIndex) {
			const unparsedSegment = cleanedString.substring(
				lastIndex,
				match.index,
			);
			if (unparsedSegment !== ",") {
				isValid = false;
				errors.push(
					`รูปแบบสตริงไม่ถูกต้อง: พบส่วนที่ไม่สามารถแยกวิเคราะห์ได้ '${unparsedSegment}' ก่อน '${fullMatch}'`,
				);
				break;
			}
		}
		lastIndex = match.index + fullMatch.length;
		if (key.length < 1 || key.length > 3) {
			isValid = false;
			errors.push(
				`ชื่อตัวแปร '${key}' มีความยาวไม่ถูกต้อง (ต้อง 1-3 ตัวอักษร).`,
			);
		}

		if (!value) {
			isValid = false;
			errors.push(`ค่าของตัวแปร '${key}' ว่างเปล่า.`);
		} else {
			if (!value.includes(",")) {
				if (value.length > 9) {
					isValid = false;
					errors.push(
						`ค่าตัวแปรทั่วไป '${key}=${value}' มีความยาวเกิน 9 ตัวอักษร.`,
					);
				}
			}
		}
		parsedData[key] = value;
	}
	if (lastIndex < cleanedString.length) {
		const remaining = cleanedString.substring(lastIndex);
		isValid = false;
		errors.push(
			`รูปแบบสตริงไม่ถูกต้อง: มีส่วนที่เหลือไม่สามารถแยกวิเคราะห์ได้ '${remaining}'.`,
		);
	}

	return { isValid, errors, parsedData };
}
