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
      return dwg.slice(0, rule.checkIndex) + " " + dwg.slice(rule.checkIndex);
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

function formatDrawingNo(input) {
  const basePattern = /^([A-Z0-9\-]{8,9})\s*([G\-][0-9]{2})(.*)$/;
  const match = input.match(basePattern);
  if (!match) return input;

  const dwgno = match[1];
  const gno = match[2];
  const lno = match[3] || "";
  const lval = [...lno.matchAll(/L[0-9]{2,3}/g)].map((m) => m[0]);
  return [dwgno, gno, ...lval].join(" ");
}
