---
outline: deep
---

# Issue Quotation

::: info 🎯
Issue Quotation จะแสดงรายการ Inquiry ที่พร้อมสำหรับทำใบเสนอราคาให้กับลูกค้าแล้ว ซึ่งจะประกอบไปด้วย Prive Approved คือรายการที่ Fin Confirm ราคาให้เรียบร้อยแล้ว, Price Approved/Unable to process คือรายการที่ Fin Confirm ราคาแล้ว แต่มีบางรายการใน Inquiry ไม่สามารถทำราคาได้, Old series คือ Inquiry ที่ Supply โดย MELINA และ Other Supplier คือรายการที่ไม่สามารถ Supply โดย AMEC
:::

<ImagePopup src="../images/mar/quotation-issue.png" alt="" caption="SP Program" />

## 1. ส่วนควบคุมและค้นหา (Top Controls)

- Filter records: ช่องสำหรับพิมพ์เพื่อค้นหาหรือกรองข้อมูลในตารางแบบ Real-time
- Rows Selector: เมนู Dropdown (ระบุเลข 25) สำหรับเลือกจำนวนรายการที่จะให้แสดงผลต่อหนึ่งหน้า

## 2. ตารางแสดงรายการ (Main Inquiry Table)

ตารางนี้รวบรวม Inquiry ที่รอทำใบเสนอราคาให้กับลูกค้าและแบ่งออกเป็น 2 กลุ้มหลักๆ คือ

- Issue Quotation ได้: รายการนั้นจะมีปุ่ม "Process" ที่ท้ายรายการ ผู้ใช้สามารถกดเลือกรายการใด ๆ ที่ต้องการ Issue quotation ได้
- รอการ Confirm น้ำหนัก: รายการนั้นจะมีปุ่ม "View" ที่ท้ายรายการ ระบบจะยังไม่อนุญาติให้ Issue Quotation จนกว่า PC จะ Confiirm นำหนักให้

## 3. Quotation Detail

<ImagePopup src="../images/mar/quotation-issue-2.png" alt="" caption="SP Program" />

หลังจากกดปุ่ม Process ที่หน้า Issue Quotation ระบบจะแสดงรายละเอียด Quotation ให้ผู้ใช้สามารถตรวจสอบและแก้ไขข้อมูลที่ต้องการได้ ประกอบไปด้วยส่วนต่างๆ ดังนี้

### 3.1 Quotation Information

- Quotation information: สำหรับระบุขอมูลของ Quotation เช่น Quotation Date, Validity Date เป็นต้น
- Inquiry information: แสดงรายละเอียด Inquiry ที่ใช้สำหรับอ้างอิงกับ Quotation
- Marketing Information: ระบบรายรายละเอียดข้อมูล Inquiry และรายชือผู้รับผิดชอบ Quotation

### 3.2 Quotation List

- ระบบจะแสดงรายการ Part/Drawing ที่ผ่านการ Declare โดย Design มาแล้ว
- แต่ละรายการที่ Supply by AMEC จะแสดงราคาที่ Fin Confirm มาให้
- รายการที่ Supply by MELINA ผู้ใช้สามารถกรอกราคาด้วยตัวเองได้
- ถ้า Inquiry นั้นมี Trader เป็น MTPE ระบบจะแสดงราคา VPC ให้ผู้ใช้เห็น และ Unit price ของรายการนั้นจะเลือกราคาที่สูงกว่าระหว่าง Fin Cost และ VPC Cost

<ImagePopup src="../images/mar/quotation-issue-3.png" alt="" caption="SP Program" />

### 3.3 Action

- Issue Quotation: Confirm รายการ Quotation เพื่อปิดการทำงาน Inquiry นั้นๆ
- Unable Process: ปิดรายการ Quotation โดยระบุว่าจะไม่เสนอราคาแก่ลูกค้า
- More Option (Return to Finance): ส่ง Inquiry กลับไปให้ Finance ตรวจสอบราคาอีกครั้ง
- More Option (Revise Inquiry): ส่ง Inquiry กลับไปให้ Sale/DE declare ใหม่

<ImagePopup src="../images/mar/quotation-issue-4.png" alt="" caption="SP Program" />
