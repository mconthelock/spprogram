---
outline: deep
---

# Declare inquiry

::: info 🎯
Declare Part เป็นหน้าจอสำหรับ Sale Engineer เข้ามา Confirm Part
:::

## Inquiry List

### 1. ส่วนควบคุมและค้นหา (Top Controls)

- Filter records: ช่องสำหรับพิมพ์เพื่อค้นหาหรือกรองข้อมูลในตารางแบบ Real-time

- Rows Selector: เมนู Dropdown (ระบุเลข 25) สำหรับเลือกจำนวนรายการที่จะให้แสดงผลต่อหนึ่งหน้า

- New Inquiry Button: ปุ่มลัดสำหรับกดเพื่อสร้างรายการสอบถามใหม่โดยตรงจากหน้านี้

### 2. ตารางแสดงรายการ (Main Inquiry Table)

ตารางนี้รวบรวมข้อมูลสำคัญของทุก Inquiry ไว้ในที่เดียว โดยมีคอลัมน์ที่น่าสนใจดังนี้:

- Status (สถานะ): แสดงขั้นตอนปัจจุบันด้วยแถบสีที่ต่างกันเพื่อให้สังเกตง่าย เช่น:
- Concern Item: แสดงรายการ Item ที่อยู่ภายใน Inquiry
    - ถ้าเป็นสีส้ม คือกำลังอยู่ระหว่างการ Declare
    - ถ้าเป็นสีเขียว คือ Item นั้น Declare เสร็จแล้ว
- Export Inquiry: นำข้อมูล Inquiry ในตารางออกมาเป็น Excel file

<ImagePopup src="../images/sale/list-2.png" alt="" caption="SP Program" />

## Inquiry Detail

### Inquiry Information

- **Original Project:** แสดงข้อมูล Original Project ของ Inquiry
- **Inquiry data:** แสดงรายละเอียด Inquiry
- **Sale information:** แสดง/เลือกข้อมูลเกี่ยวกับแผนก Sale

### Inquiry Detail

ตารางแสดงรายละเอียด Part/Drawing ที่ลูกค้าสอบถามราคา ประกอบไปด้วย Column ดังนี้ว

- Seq No.
- Car No
- Original MFO No.
- Item
- Part Name
- Drawing
- Variable
- Qty
- UM
- Supplier
- 2nd Part List function
- Unreply
- Skip to D/E
- Remark

### Inquiry History

ตารางแสดงประวัติการทำงานของแต่ละแผนกใน Inquiry โดยจะแสดงวัน/เวลา ชื่อผู้ใช่ และ Action ที่กระทำต่อ Inquiry

### Attachment

ตารางแสดงแสดงรายการไฟล์แนบ เช่น ไฟล์ 2nd part list, รูปภาพประกอบ เป็นตัน

- สามารถ Download ไฟล์โดยคลิกที่ชื่อไฟล์
- สามารถลบไฟล์ได้โดยเลือกที่สัญลักษณ์ "ถังขยะ" ด้านหลังไฟล์ที่ต้องการลบ
- สามารถเพิ่มไฟล์โดยเลือกที่สัญลักษณ์ "📎" ที่มุมขวาบนของตาราง

<ImagePopup src="../images/sale/detail-2.png" alt="" caption="SP Program" />
