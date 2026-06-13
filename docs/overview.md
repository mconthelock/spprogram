---
outline: deep
---

# Overview

::: info 🎯 ภาพรวมระบบ
SP PROGRAM เป็นระบบบริหารกระบวนการตั้งแต่รับความต้องการจากลูกค้า ไปจนถึงการเตรียมราคาและออกใบเสนอราคา โดยเชื่อมการทำงานของหลายฝ่ายเข้าด้วยกันใน workflow เดียว ทำให้แต่ละทีมเห็นสถานะงานของตนเองชัดเจน ลดการส่งต่อข้อมูลแบบกระจัดกระจาย และช่วยให้การคำนวณราคาเป็นมาตรฐานมากขึ้น
:::

<ImagePopup src="./images/home.png" alt="Home Page" caption="SP Program" />

## วัตถุประสงค์ของระบบ

ระบบนี้ถูกออกแบบมาเพื่อเป็นศูนย์กลางของงานเชิงพาณิชย์ของโครงการ ช่วยให้ทีม Sale, Design, Finance และ MAR ทำงานต่อเนื่องกันตั้งแต่การสร้าง Inquiry การตรวจสอบข้อมูลทางเทคนิค การคำนวณต้นทุน การอนุมัติราคา ไปจนถึงการออก Quotation ให้ลูกค้า

## กระบวนการหลักของธุรกิจ

1. รับความต้องการของลูกค้าเข้าระบบเป็น Inquiry
2. ส่งต่อให้ทีมที่เกี่ยวข้องตรวจสอบแบบ รายการสินค้า และข้อมูลประกอบ
3. ให้ฝ่ายการเงินคำนวณต้นทุนและกำหนดราคาขาย
4. ตรวจสอบและอนุมัติราคาให้พร้อมใช้งานเชิงพาณิชย์
5. ส่งต่อให้ทีมการตลาดหรือฝ่ายขายนำไปออกใบเสนอราคาและติดตามงานต่อ

## บทบาทของผู้ใช้งาน

- MAR เป็นผู้เริ่มต้นข้อมูลและรวบรวมความต้องการจากลูกค้า
- SE/SALE รับผิดชอบในการตรวจสอบรายการ Drawing ที่ลูกค้าต้องการ โดยอ้างอิงจาก Original Order เป็นหลัก
- D/E หรือทีมเทคนิคช่วยยืนยันข้อมูลด้านแบบ รายการ และความถูกต้องของข้อมูลผลิตภัณฑ์ต่อจากแผนก SE ในกรณีที่แผนก SE ไม่สามารถยืนยันรายการเหล่านั้นได้
- Finance คำนวณต้นทุน กำไร และราคาต่อหน่วยก่อนส่งต่อ
- MAR รับช่วงงานเพื่อจัดการใบเสนอราคา ติดตามสถานะ และสื่อสารกับลูกค้า

## Change log

### Update 2026-06-03

- ปรับโครงสร้าง Front end มาใช้ Tailwind
- เปลี่ยนระบบ Authentication มาเป็น New Webflow base
- เพิ่ม SE เป็นผู้ใช้กลุ่มหลักที่มาทำงานแทน D/E
- เปลี่ยนให้ DE ทำงานเฉพาะรายการที่ Sale Foreward ไป
- ดึงรายการ Secoundary Part List จาก Elmes มาใส่ใน Inquiry List ในกรณีที SE หรือ DE ระบุว่า Drawing นั้นมี Secound
- ทุกรายการที่ส่งไป Fin จะมีการ Matching ราคาก่อน
- เปลี่ยน Template **Out to out** ([IS-DEV26-000143](http://webflow.mitsubishielevatorasia.co.th/form/is/swDev/index.asp?no=5&orgNo=050601&y=14&y2=2026&runNo=143))
- เปลี่ยน Template import tsv file จาก Sparq เพือนำข้อมูลเข้ารบบ SP Program ([IS-DEV26-000114](http://webflow.mitsubishielevatorasia.co.th/form/is/swDev/index.asp?no=5&orgNo=050601&y=14&y2=2026&runNo=114&empno=12069&bp=%2Fform%2Fworkflow%2FwaitApv%2Easp&menu=2))
- ระบบจะแจ้งเตือน FIN User ในกรณ๊ที่ Confirm ราคาเป็น 0 หรือ "" แล้วไม่มี Remark ([IS-DEV26-000088](http://webflow.mitsubishielevatorasia.co.th/form/is/swDev/index.asp?no=5&orgNo=050601&y=14&y2=2026&runNo=88&empno=12069&bp=%2Fform%2Fworkflow%2FwaitApv%2Easp&menu=2))
- Inquiry Report สำหรับ MAR User เพิ่ม Currency, Exchange Rate และ Column ที่เป็นวันที่ Format Excel จะเป็น "Date" ([IS-DEV25-000497](http://webflow.mitsubishielevatorasia.co.th/form/is/swDev/view-form.asp?no=5&orgNo=050601&y=14&empNo=12069&y2=2025&runNo=497&m=&menu=2&bp=%2Fform%2Fworkflow%2FwaitApv%2Easp))
- Auto Export excel เพื่อให้ User นำไปใช้ทำ Power BI ทุกวันศุกร์ ([IS-DEV25-000407](http://webflow.mitsubishielevatorasia.co.th/form/is/swDev/view-form.asp?no=5&orgNo=050601&y=14&empNo=12069&y2=2025&runNo=407&m=&menu=2&bp=%2Fform%2Fworkflow%2FwaitApv%2Easp))
