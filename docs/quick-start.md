---
outline: deep
---

# Get Started

## กระบวนการทำงานของระบบ SP Program ถูกแบ่งออกเป็น 5 ระยะหลัก ดังนี้:

### ระยะที่ 1: การรับเรื่องและบันทึกข้อมูลเบื้องต้น (Initiation by MAR)

แผนก MAR ได้รับความต้องการทางเทคนิค (Technical Inquiry - T/I) จากลูกค้า บันทึกข้อมูล T/I เข้าสู่ระบบ SP Program และระบบจะส่งข้อมูลไปยังแผนก Sale โดยอัตโนมัติ

### ระยะที่ 2: การตรวจสอบและยืนยันแบบ (Drawing Declaration)

ระยะนี้จะมีการประเมินแบบ (Drawing) เพื่อยืนยันความสามารถในการผลิต โดยแบ่งเงื่อนไขการทำงานดังนี้:

- **ส่วนของแผนก Sale:**
    - Sale Leader ทำการพิจารณารายการ Drawing ใน T/I เบื้องต้น

    **กรณีที่ 1:** หากพิจารณาแล้วว่าแผนก Sale สามารถตรวจสอบได้ จะทำการมอบหมายงาน (Assign) ให้ Sale Engineer เป็นผู้ดำเนินการ Declare Drawing เพื่อยืนยันว่าสามารถสั่งผลิตได้และข้อมูลถูกต้องตามโปรเจกต์ต้นฉบับ

    **กรณีที่ 2:** หากพิจารณาแล้วว่าเกินขอบเขตที่ Sale Engineer จะตรวจสอบได้ ระบบจะให้สิทธิ์ Sale Leader ในการส่งรายการ T/I นั้นข้ามไปยัง แผนก Design ทันที

    ในระหว่างที่ Sale Engineer ดำเนินการ หากพบว่ามีบางรายการ Drawing ที่ไม่สามารถ Declare ได้ด้วยตนเอง สามารถทำการส่งต่อเฉพาะรายการนั้นไปยัง แผนก Design ได้

- **ส่วนของแผนก Design (กรณีได้รับมอบหมายงานจาก Sale):**
    - Design Leader ได้รับรายการ T/I จากนั้นจะทำการมอบหมายงานให้ Designer (ผู้รับผิดชอบหลัก) และ Checker (ผู้ตรวจสอบ)

    - Designer ทำการตรวจสอบและ Declare Drawing ในรายการที่ถูกส่งมา จากนั้นส่งข้อมูลต่อให้ Checker

    - Checker ทำการตรวจสอบความถูกต้องขั้นสุดท้ายและยืนยัน (Confirm) ข้อมูลในระบบ

### ระยะที่ 3: การประมวลผลข้อมูล Material (Pre-B/M Integration)

- เมื่อรายการ T/I ทั้งหมดได้รับการยืนยัน (Confirm) สำเร็จแล้ว (ไม่ว่าจะจบที่แผนก Sale หรือแผนก Design)

- ระบบ SP Program จะส่งข้อมูลไปเชื่อมต่อกับ ระบบ AS400 เพื่อทำกระบวนการ Pre-B/M เป็นการยืนยันข้อมูลรายการวัสดุ

- หลังจาก AS400 ประมวลผลเสร็จสิ้น ข้อมูลจะถูกส่งต่อไปยังส่วนงาน Finance โดยอัตโนมัติ

### ระยะที่ 4: การจัดทำและอนุมัติราคา (Costing & Pricing by Finance)

- Finance (ผู้จัดทำ) ได้รับข้อมูลจากระบบ AS400 ทำการตรวจสอบต้นทุนและประเมินราคางาน จากนั้นบันทึกยืนยันราคาในระบบเพื่อส่งต่อให้ผู้ตรวจสอบ

- Finance Checker ทำการตรวจสอบความถูกต้องของราคาที่คำนวณไว้ และกดส่งเรื่องเพื่อขออนุมัติ

- Finance Manager ทำการพิจารณาอนุมัติ (Approve) ราคา เมื่ออนุมัติแล้ว ระบบจะส่งข้อมูลผลลัพธ์กลับไปยังแผนก MAR

### ระยะที่ 5: การออกใบเสนอราคาและปิดกระบวนการ (Quotation & Closure)

แผนก MAR ได้รับข้อมูลราคาที่ผ่านการอนุมัติเรียบร้อยแล้ว ดำเนินการออกใบเสนอราคา (Quotation) และบันทึกข้อมูลในระบบเพื่อเป็นหลักฐานว่าสถานะของ T/I ฉบับนี้เสร็จสมบูรณ์ (Completed)

<ImagePopup src="./images/Flow.png" alt="Work flow" caption="SP Program workflow" />

## User Interface

### Inquiry List

User แต่ละกลุ่มจะมีหน้าจอหลักหลักสำหรับทำงานเป็นหน้าจอแสดงรายการ Inquiry ซึ่งจำหน้าที่ List รายการ Inquiry ที่ผู้ใช้กลุ่มนั้น หรือคนนั้นจะต้อง Action ด้วย และ Function ที่ปรากฏก็จะขึ้นอยู่กับ User นั้นด้วย

ส่วนประกอบหลักของ Inquiry List จะแบ่งออกเป็น 4 ส่นดังนี้

**1. Inquiry Info** จะแสดงข้อมูลเบื้องต้นของ Inquiry นั้น

**2. Status** แสดงสถานะของ Inquiry

**3. Concern Designer** บ่งบอกว่า Inquiry นั้น เกียวกับ Item กลุ่มใดบ้าง และแต่ละกลุ่ม Confirm แล้วหรือยัง

- **สีส้ม** หมายถึง กำลังทำงานอยู่ 🔃
- **สีเขียว** หมายถึง Declare แล้ว ✅

**4.Action** Action ที่ User คนนั้นสามารถดำเนินการได้

<ImagePopup src="./images/iqlist.png" alt="Work flow" caption="SP Program interface" />

## Inquiry Status

| Status                           | Detail                                                      |
| -------------------------------- | ----------------------------------------------------------- |
| New                              | MAR สร้างและกด Send to D/E                                  |
| Revised                          | MAR แก้ไขข้อมูลหลังจาก Declare แล้ว                         |
| FIN Return                       | Finance reject/return กลับมาให้ MAR แก้ไน                   |
| Sale Processing (Assign)         | อยู่ระหว่างแผนก Sale กำลังทำงาน                             |
| Sale Confirmed                   | Sale Confirm บางส่วน และส่งต่อไปยัง D/E                     |
| Skipped sale's process           | Sale ส่งต่อไปยัง D/E ทุกรายการ                              |
| Design Processing                | Design กำลังทำงาน                                           |
| Pending Pre-BM                   | ถูกส่งให้ AS400 แล้ว แต่ยังไม่รัน Pre-B/M                   |
| BM Complete                      | รัน Pre-B/M แล้ว                                            |
| MAR Return                       | MAR Reject/Return ราคากลับไปที่ Finance                     |
| Finance Processing               | Finance กำลังทำงาน                                          |
| Price Approved                   | Finance ยืนยันราคาแล้ว และทุกรายการ Supply โดย AMEC         |
| Price Approved/Unable to process | Finance ยืนยันราคาแล้ว มีบางรายการที่ไม่ได้ Supply โดย AMEC |
| Other Supplier                   | รายการที่ไม่ได้ Supply โดย AMEC                             |
| Old series                       | ทุกรายการ Supply โดย MELINA                                 |
| Unable Issue Quotation           | ยกเลิก/ไม่เสนอราคา                                          |
| Issue Quotation                  | Issue Quotation แล้ว                                        |
