-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: db
-- Generation Time: Jul 14, 2025 at 10:35 AM
-- Server version: 8.0.42
-- PHP Version: 8.2.27

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `amec`
--

-- --------------------------------------------------------

--
-- Table structure for table `SP_ATTACHED`
--

CREATE TABLE `SP_ATTACHED` (
  `INQ_NO` varchar(50) NOT NULL,
  `FILE_NAME` varchar(100) DEFAULT NULL,
  `FILE_ORIGINAL_NAME` varchar(150) DEFAULT NULL,
  `FILE_SIZE` int DEFAULT NULL,
  `FILE_TYPE` varchar(10) DEFAULT NULL,
  `FILE_CLASS` varchar(50) DEFAULT NULL,
  `FILE_STATUS` int DEFAULT NULL,
  `FILE_OWNER` varchar(5) DEFAULT NULL,
  `FILE_MAR_READ` int DEFAULT NULL,
  `FILE_DES_READ` int DEFAULT NULL,
  `FILE_CREATE_AT` timestamp(6) NULL DEFAULT NULL,
  `FILE_CREATE_BY` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `SP_CURRENCY`
--

CREATE TABLE `SP_CURRENCY` (
  `CURR_YEAR` int DEFAULT NULL,
  `CURR_PERIOD` int DEFAULT NULL,
  `CURR_CODE` varchar(3) DEFAULT NULL,
  `CURR_RATE` int DEFAULT NULL,
  `CURR_LATEST` varchar(1) DEFAULT NULL,
  `CURR_UPDATE_DATE` timestamp(6) NULL DEFAULT NULL,
  `CURR_UPDATE_BY` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `SP_CURRENCY`
--

INSERT INTO `SP_CURRENCY` (`CURR_YEAR`, `CURR_PERIOD`, `CURR_CODE`, `CURR_RATE`, `CURR_LATEST`, `CURR_UPDATE_DATE`, `CURR_UPDATE_BY`) VALUES
(2024, 2, 'USD', 34, '0', NULL, 'System'),
(2024, 2, 'EUR', 37, '0', NULL, 'System'),
(2024, 2, 'GBP', 43, '0', NULL, 'System'),
(2024, 2, 'JPY', 0, '0', NULL, 'System'),
(2024, 2, 'THB', 1, '0', NULL, 'System'),
(2025, 1, 'USD', 35, '1', NULL, 'NUNTIYA  SANSUK'),
(2025, 1, 'EUR', 39, '1', NULL, 'NUNTIYA  SANSUK'),
(2025, 1, 'GBP', 45, '1', NULL, 'NUNTIYA  SANSUK'),
(2025, 1, 'JPY', 0, '1', NULL, 'NUNTIYA  SANSUK'),
(2025, 1, 'THB', 1, '1', NULL, 'NUNTIYA  SANSUK'),
(2024, 1, 'USD', 34, '0', NULL, 'ONAUMA  CHAODON'),
(2024, 1, 'EUR', 37, '0', NULL, NULL),
(2024, 1, 'GBP', 43, '0', NULL, NULL),
(2024, 1, 'JPY', 0, '0', NULL, NULL),
(2024, 1, 'THB', 1, '0', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `SP_DELIVERY_TERM`
--

CREATE TABLE `SP_DELIVERY_TERM` (
  `TERM_ID` int DEFAULT NULL,
  `TERM_DESC` varchar(100) DEFAULT NULL,
  `TERM_STATUS` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `SP_INQUIRY`
--

CREATE TABLE `SP_INQUIRY` (
  `INQ_ID` int NOT NULL,
  `INQ_NO` varchar(50) DEFAULT NULL,
  `INQ_REV` varchar(2) DEFAULT NULL,
  `INQ_STATUS` float(2,0) DEFAULT NULL,
  `INQ_DATE` date DEFAULT NULL,
  `INQ_TRADER` varchar(20) DEFAULT NULL,
  `INQ_AGENT` varchar(5) DEFAULT NULL,
  `INQ_COUNTRY` varchar(100) DEFAULT NULL,
  `INQ_TYPE` varchar(10) DEFAULT NULL,
  `INQ_PRJNO` varchar(50) DEFAULT NULL,
  `INQ_PRJNAME` varchar(250) DEFAULT NULL,
  `INQ_SHOPORDER` varchar(50) DEFAULT NULL,
  `INQ_SERIES` varchar(15) DEFAULT NULL,
  `INQ_OPERATION` varchar(50) DEFAULT NULL,
  `INQ_SPEC` varchar(100) DEFAULT NULL,
  `INQ_PRDSCH` varchar(50) DEFAULT NULL,
  `INQ_QUOTATION_TYPE` float(3,0) DEFAULT NULL,
  `INQ_DELIVERY_TERM` float(3,0) DEFAULT NULL,
  `INQ_DELIVERY_METHOD` float(3,0) DEFAULT NULL,
  `INQ_SHIPMENT` float(3,0) DEFAULT NULL,
  `INQ_MAR_PIC` varchar(5) DEFAULT NULL,
  `INQ_FIN_PIC` varchar(6) DEFAULT NULL,
  `INQ_PKC_PIC` varchar(5) DEFAULT NULL,
  `INQ_MAR_SENT` timestamp(6) NULL DEFAULT NULL,
  `INQ_MRE_RECV` timestamp(6) NULL DEFAULT NULL,
  `INQ_MRE_FINISH` timestamp(6) NULL DEFAULT NULL,
  `INQ_PKC_FINISH` timestamp(6) NULL DEFAULT NULL,
  `INQ_BM_DATE` timestamp(6) NULL DEFAULT NULL,
  `INQ_FIN_RECV` timestamp(6) NULL DEFAULT NULL,
  `INQ_FIN_FINISH` timestamp(6) NULL DEFAULT NULL,
  `INQ_FINISH` timestamp(6) NULL DEFAULT NULL,
  `INQ_MAR_REMARK` varchar(1024) DEFAULT NULL,
  `INQ_DES_REMARK` varchar(500) DEFAULT NULL,
  `INQ_FIN_REMARK` varchar(500) DEFAULT NULL,
  `CREATE_AT` timestamp(6) NULL DEFAULT NULL,
  `UPDATE_AT` timestamp(6) NULL DEFAULT NULL,
  `CREATE_BY` varchar(100) DEFAULT NULL,
  `UPDATE_BY` varchar(100) DEFAULT NULL,
  `INQ_LATEST` float(1,0) DEFAULT NULL,
  `TOTAL_FC` float DEFAULT NULL,
  `TOTAL_TC` float DEFAULT NULL,
  `GRAND_TOTAL` float DEFAULT NULL,
  `TOTAL_UNIT_PRICE` float DEFAULT NULL,
  `INQ_PKC_REQ` float(1,0) DEFAULT NULL,
  `INQ_EXTEND` float(1,0) DEFAULT NULL,
  `INQ_CUR` varchar(3) DEFAULT NULL,
  `INQ_ACTUAL_PO` varchar(50) DEFAULT NULL,
  `INQ_CUSTRQS` date DEFAULT NULL,
  `INQ_FIN_CHK` varchar(5) DEFAULT NULL,
  `INQ_FIN_CONFIRM` timestamp(6) NULL DEFAULT NULL,
  `INQ_FIN_CHECKED` timestamp(6) NULL DEFAULT NULL,
  `INQ_COMPARE_DATE` timestamp(6) NULL DEFAULT NULL,
  `INQ_CUSTOMER` float DEFAULT NULL,
  `INQ_CONTRACTOR` varchar(50) DEFAULT NULL,
  `INQ_ENDUSER` varchar(100) DEFAULT NULL,
  `INQ_PORT` varchar(100) DEFAULT NULL,
  `INQ_USERPART` varchar(100) DEFAULT NULL,
  `INQ_TCCUR` varchar(3) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `SP_INQUIRY_CONTROL`
--

CREATE TABLE `SP_INQUIRY_CONTROL` (
  `CNT_PREFIX` varchar(10) DEFAULT NULL,
  `CNT_AGENT` varchar(3) DEFAULT NULL,
  `CNT_TRADER` varchar(20) DEFAULT NULL,
  `CNT_QUOTATION` int DEFAULT NULL,
  `CNT_TERM` int DEFAULT NULL,
  `CNT_WEIGHT` int DEFAULT NULL,
  `CNT_METHOD` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `SP_INQUIRY_CONTROL`
--

INSERT INTO `SP_INQUIRY_CONTROL` (`CNT_PREFIX`, `CNT_AGENT`, `CNT_TRADER`, `CNT_QUOTATION`, `CNT_TERM`, `CNT_WEIGHT`, `CNT_METHOD`) VALUES
('Any', NULL, 'Direct', 4, 1, 0, 1),
('T-AMF', 'AMF', 'MEBS', 3, 3, 1, 2),
('T-AGM', 'AGM', 'MEBS', 3, 2, 0, 2),
('T-COH', 'COH', 'AMEC', 16, 3, 1, 2),
('T-TME', 'TMC', 'MEBS', 3, 2, 0, 3),
('T-ELM', 'ELM', 'MEBS', 3, 3, 1, 2),
('T-EME', 'EMC', 'MEBS', 3, 3, 1, 2),
('T-FAN', 'FAN', 'MEBS', 3, 3, 1, 2),
('T-HME', 'GDR', 'MEBS', 3, 3, 1, 2),
('T-HME', 'HMC', 'AMEC', 19, 3, 1, 2),
('T-MCL', 'HWA', 'MEBS', 3, 2, 0, 2),
('T-HWC', 'HWC', 'MEBS', 3, 3, 1, 2),
('T-IEE', 'IEE', 'AMEC', 20, 2, 0, 2),
('T-IMC', 'IMC', 'AMEC', 18, 2, 0, 2),
('T-MCT', 'IUP', 'MEBS', 3, 3, 1, 2),
('T-MJE', 'JYT', 'AMEC', 9, 2, 0, 2),
('T-KMC', 'KME', 'MEBS', 3, 3, 1, 2),
('T-MCS', 'MCC', 'MEBS', 3, 3, 1, 2),
('T-MCL', 'MCL', 'AMEC', 14, 3, 1, 2),
('T-MCM', 'MCM', 'MEBS', 3, 3, 1, 2),
('T-MCL', 'MDO', 'MEBS', 3, 3, 1, 2),
('T-MEB', 'MEB', 'MEBS', 3, 3, 1, 2),
('T-MEC', 'MEC', 'MEBS', 3, 3, 1, 2),
('T-MEU', 'MEL', 'AMEC', 21, 3, 1, 2),
('T-MLM', 'MEM', 'AMEC', 10, 2, 0, 2),
('T-MET', 'MET', 'MET', 3, 1, 0, 1),
('T-MEK', 'MEU', 'MEBS', 3, 3, 1, 2),
('T-MLM', 'MLM', 'MEBS', 3, 2, 0, 2),
('T-MLS', 'MLS', 'AMEC', 17, 2, 0, 2),
('T-MCL', 'MPA', 'MEBS', 3, 3, 1, 2),
('T-MCL', 'MPE', 'MEBS', 3, 3, 1, 2),
('T-MSA', 'MSA', 'MEBS', 3, 3, 1, 2),
('T-MIT', 'MSL', 'MEBS', 3, 2, 0, 2),
('T-MSP', 'MSP', 'AMEC', 13, 2, 0, 2),
('T-MCL', 'MVE', 'MEBS', 3, 3, 1, 2),
('T-MLA', 'MLA', 'AMEC', 12, 3, 1, 1),
('T-SYC', 'SYS', 'MEBS', 3, 2, 0, 2),
('T-TLE', 'TLE', 'MEBS', 3, 2, 0, 2),
('T-TME', 'TME', 'MEBS', 3, 2, 0, 2),
('T-UNI', 'UNH', 'MEBS', 3, 3, 1, 2),
('T-VMC', 'VMC', 'AMEC', 11, 2, 1, 2),
('T-MMX', 'XGT', 'AMEC', 15, 3, 1, 2),
('T-MMX', 'XHN', 'AMEC', 15, 3, 1, 2),
('T-MMX', 'XMX', 'AMEC', 22, 3, 1, 2),
('T-MMX', 'XSL', 'AMEC', 15, 3, 1, 2),
('Any', 'AMF', 'MTPE', 1, 1, 1, 1),
('Any', 'AGM', 'MTPE', 1, 1, 0, 1),
('Any', 'BMC', 'MTPE', 1, 1, 1, 1),
('Any', 'COH', 'MTPE', 1, 1, 1, 1),
('Any', 'CR', 'MTPE', 1, 1, 1, 1),
('Any', 'TMC', 'MTPE', 1, 1, 1, 1),
('Any', 'ELM', 'MTPE', 1, 1, 1, 1),
('Any', 'EMC', 'MTPE', 1, 1, 1, 1),
('Any', 'ETA', 'MTPE', 1, 1, 0, 1),
('Any', 'ETT', 'MTPE', 1, 1, 0, 1),
('Any', 'ETI', 'MTPE', 1, 1, 0, 1),
('Any', 'FAN', 'MTPE', 1, 1, 1, 1),
('Any', 'GDR', 'MTPE', 1, 1, 1, 1),
('Any', 'HMC', 'MTPE', 1, 1, 1, 1),
('Any', 'HWA', 'MTPE', 1, 1, 1, 1),
('Any', 'HWC', 'MTPE', 1, 1, 1, 1),
('Any', 'IEE', 'MTPE', 1, 1, 0, 1),
('Any', 'IMC', 'MTPE', 1, 1, 0, 1),
('Any', 'IUP', 'MTPE', 1, 1, 1, 1),
('Any', 'JYT', 'MTPE', 3, 1, 0, 1),
('Any', 'KME', 'MTPE', 1, 1, 1, 1),
('Any', 'KR', 'MTPE', 1, 1, 1, 1),
('Any', 'MCC', 'MTPE', 1, 1, 1, 1),
('Any', 'MCL', 'MTPE', 1, 1, 1, 1),
('Any', 'MCM', 'MTPE', 1, 1, 1, 1),
('Any', 'SPA', 'MTPE', 1, 1, 1, 1),
('Any', 'MDO', 'MTPE', 1, 1, 1, 1),
('Any', 'MEB', 'MTPE', 1, 1, 1, 1),
('Any', 'MEC', 'MTPE', 1, 1, 1, 1),
('Any', 'MEL', 'MTPE', 1, 1, 1, 1),
('Any', 'MEM', 'MTPE', 1, 1, 0, 1),
('Any', 'RM', 'AMEC', 1, 1, 0, 1),
('Any', 'MET', 'MTPE', 1, 1, 0, 1),
('Any', 'MEU', 'MTPE', 1, 1, 1, 1),
('Any', 'MLA', 'MTPE', 1, 1, 0, 1),
('Any', 'MLM', 'MTPE', 1, 1, 0, 1),
('Any', 'MLS', 'MTPE', 1, 1, 0, 1),
('Any', 'MPA', 'MTPE', 1, 1, 1, 1),
('Any', 'MPE', 'MTPE', 1, 1, 1, 1),
('Any', 'MSA', 'MTPE', 1, 1, 1, 1),
('Any', 'MSL', 'MTPE', 1, 1, 0, 1),
('Any', 'MSG', 'MTPE', 1, 1, 0, 1),
('Any', 'MSP', 'MTPE', 1, 1, 0, 1),
('Any', 'RS', 'MTPE', 1, 1, 0, 1),
('Any', 'MVE', 'MTPE', 1, 1, 1, 1),
('Any', 'SVN', 'MTPE', 1, 1, 1, 1),
('Any', 'SYS', 'MTPE', 1, 1, 0, 1),
('Any', 'TLE', 'MTPE', 1, 1, 0, 1),
('Any', 'TME', 'MTPE', 1, 1, 1, 1),
('Any', 'UNH', 'MTPE', 1, 1, 1, 1),
('Any', 'VMC', 'MTPE', 1, 1, 0, 1),
('Any', 'WIC', 'MTPE', 1, 1, 0, 1),
('Any', 'XGT', 'MTPE', 1, 1, 1, 1),
('Any', 'XHN', 'MTPE', 1, 1, 1, 1),
('Any', 'XMX', 'MTPE', 1, 1, 1, 1),
('Any', 'XSL', 'MTPE', 1, 1, 1, 1),
('T-VME', 'VMC', 'AMEC', 11, 2, 1, 2),
('T-SVN', 'SVN', 'AMEC', 12, 1, 1, 1),
('T-RS', 'RS', 'AMEC', 13, 1, 1, 1),
('T-TTE', 'TTE', 'AMEC', 11, 2, 1, 2);

-- --------------------------------------------------------

--
-- Table structure for table `SP_INQUIRY_DETAIL`
--

CREATE TABLE `SP_INQUIRY_DETAIL` (
  `INQD_ID` int NOT NULL,
  `INQG_GROUP` int DEFAULT NULL,
  `INQD_SEQ` float(5,2) DEFAULT NULL,
  `INQD_RUNNO` int DEFAULT NULL,
  `INQD_MFGORDER` varchar(50) DEFAULT NULL,
  `INQD_ITEM` varchar(10) DEFAULT NULL,
  `INQD_CAR` varchar(50) DEFAULT NULL,
  `INQD_PARTNAME` varchar(200) DEFAULT NULL,
  `INQD_DRAWING` varchar(200) DEFAULT NULL,
  `INQD_VARIABLE` varchar(255) DEFAULT NULL,
  `INQD_QTY` float(10,3) DEFAULT NULL,
  `INQD_UM` varchar(10) DEFAULT NULL,
  `INQD_SUPPLIER` varchar(25) DEFAULT NULL,
  `INQD_SENDPART` float(1,0) DEFAULT NULL,
  `INQD_UNREPLY` float(2,0) DEFAULT NULL,
  `INQD_FC_COST` float(11,4) DEFAULT NULL,
  `INQD_TC_COST` float(11,4) DEFAULT NULL,
  `INQD_UNIT_PRICE` float(11,4) DEFAULT NULL,
  `INQD_FC_BASE` float(7,4) DEFAULT NULL,
  `INQD_TC_BASE` float(7,4) DEFAULT NULL,
  `INQD_MAR_REMARK` varchar(3000) DEFAULT NULL,
  `INQD_DES_REMARK` varchar(1000) DEFAULT NULL,
  `INQD_FIN_REMARK` varchar(1000) DEFAULT NULL,
  `INQD_LATEST` float(1,0) DEFAULT NULL,
  `INQD_OWNER` varchar(5) DEFAULT NULL,
  `CREATE_AT` timestamp(6) NULL DEFAULT NULL,
  `CREATE_BY` varchar(100) DEFAULT NULL,
  `UPDATE_AT` timestamp(6) NULL DEFAULT NULL,
  `UPDATE_BY` varchar(100) DEFAULT NULL,
  `INQD_COMPARE` varchar(1) DEFAULT NULL,
  `INQD_COMPARE_DATE` timestamp(6) NULL DEFAULT NULL,
  `INQD_OWNER_GROUP` varchar(10) DEFAULT NULL,
  `ITEMID` float DEFAULT NULL,
  `INQID` float DEFAULT NULL,
  `TEST_FLAG` char(1) DEFAULT NULL,
  `TEST_MESSAGE` varchar(50) DEFAULT NULL,
  `AUTO_ADD` varchar(1) DEFAULT NULL,
  `INQD_PREV` float DEFAULT NULL,
  `UPDATE_CODE` varchar(5) DEFAULT NULL,
  `INQD_EXRATE` float DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `SP_INQUIRY_GROUP`
--

CREATE TABLE `SP_INQUIRY_GROUP` (
  `INQG_ID` int NOT NULL,
  `INQ_ID` float(10,0) DEFAULT NULL,
  `INQG_GROUP` float(3,0) DEFAULT NULL,
  `INQG_REV` varchar(3) DEFAULT NULL,
  `INQG_ASG` varchar(5) DEFAULT NULL,
  `INQG_DES` varchar(5) DEFAULT NULL,
  `INQG_CHK` varchar(5) DEFAULT NULL,
  `INQG_CLASS` varchar(3) DEFAULT NULL,
  `INQG_ASG_DATE` timestamp(6) NULL DEFAULT NULL,
  `INQG_DES_DATE` timestamp(6) NULL DEFAULT NULL,
  `INQG_CHK_DATE` timestamp(6) NULL DEFAULT NULL,
  `INQG_DES_REASON` varchar(250) DEFAULT NULL,
  `INQG_STATUS` float(2,0) DEFAULT NULL,
  `INQG_LATEST` float(1,0) DEFAULT NULL,
  `IS_MAIL` char(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `SP_INQUIRY_REASON`
--

CREATE TABLE `SP_INQUIRY_REASON` (
  `REASON_ID` int NOT NULL,
  `REASON_CODE` varchar(100) DEFAULT NULL,
  `REASON_DESC` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `SP_PRICE_RATIO`
--

CREATE TABLE `SP_PRICE_RATIO` (
  `ID` int DEFAULT NULL,
  `TRADER` varchar(10) DEFAULT NULL,
  `SUPPLIER` varchar(10) DEFAULT NULL,
  `QUOTATION` int DEFAULT NULL,
  `FORMULA` float(7,3) DEFAULT NULL,
  `FREIGHT_SEA` float(7,4) DEFAULT NULL,
  `FREIGHT_AIR` float(7,4) DEFAULT NULL,
  `FREIGHT_COURIER` float(7,4) DEFAULT NULL,
  `UPDATE_BY` varchar(100) DEFAULT NULL,
  `UPDATE_AT` varchar(20) DEFAULT NULL,
  `CURRENCY` varchar(3) DEFAULT NULL,
  `STATUS` char(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `SP_PRICE_RATIO`
--

INSERT INTO `SP_PRICE_RATIO` (`ID`, `TRADER`, `SUPPLIER`, `QUOTATION`, `FORMULA`, `FREIGHT_SEA`, `FREIGHT_AIR`, `FREIGHT_COURIER`, `UPDATE_BY`, `UPDATE_AT`, `CURRENCY`, `STATUS`) VALUES
(22, 'AMEC', 'AMEC', 9, 1.330, NULL, NULL, NULL, NULL, '2020-10-20 02:53:12', 'THB', '1'),
(23, 'AMEC', 'MELINA', 9, 1.730, NULL, NULL, NULL, NULL, '2020-10-20 02:53:12', 'THB', '1'),
(24, 'AMEC', 'AMEC', 10, 1.330, NULL, NULL, NULL, NULL, '2020-10-20 02:53:12', 'THB', '1'),
(25, 'AMEC', 'MELINA', 10, 1.730, NULL, NULL, NULL, NULL, '2020-10-20 02:53:12', 'THB', '1'),
(53, 'AMEC', 'MELINA', 23, 0.050, NULL, NULL, NULL, 'CHALORMSAK  SAWANAM', '2021-10-04 18:45:58', 'USD', '1'),
(1, 'MTPE', 'AMEC', 1, 1.400, 1.0500, 1.0500, 1.0500, 'THEERAPATH  JITTAWATTANA', '2024-01-15 08:33:52', 'THB', '1'),
(2, 'MTPE', 'MELINA', 1, 1.400, NULL, NULL, NULL, 'THEERAPATH  JITTAWATTANA', '2024-01-15 08:34:05', 'THB', '1'),
(3, 'MTPE', 'AMEC', 2, 1.400, 1.1100, 1.0250, 1.0275, 'THEERAPATH  JITTAWATTANA', '2024-01-15 08:34:01', 'THB', '1'),
(4, 'MTPE', 'MELINA', 2, 1.400, NULL, NULL, NULL, 'THEERAPATH  JITTAWATTANA', '2024-01-15 08:34:11', 'THB', '1'),
(5, 'MELCO', 'AMEC', 3, 1.080, NULL, NULL, NULL, 'BHURIDA  LANYAME', '2020-05-20 09:23:53', 'THB', '1'),
(6, 'MELCO', 'MELINA', 3, 1.400, NULL, NULL, NULL, 'BHURIDA  LANYAME', '2020-05-20 09:24:02', 'THB', '1'),
(7, 'MET', 'AMEC', 3, 1.160, NULL, NULL, NULL, 'BHURIDA  LANYAME', '2023-05-16 09:40:14', 'THB', '1'),
(8, 'MET', 'MELINA', 3, 1.510, NULL, NULL, NULL, 'Poomipat Chaothai', '2018-07-13 09:47:17', 'THB', '1'),
(54, 'MEBS', 'AMEC', 3, 1.080, NULL, NULL, NULL, NULL, NULL, 'THB', '1'),
(55, 'MEBS', 'MELINA', 3, 1.400, NULL, NULL, NULL, NULL, NULL, 'THB', '1'),
(56, 'MEBS', 'AMEC', 9, 1.330, NULL, NULL, NULL, 'CHALORMSAK  SAWANAM', '2022-09-22 11:45:29', 'THB', '0'),
(57, 'MEBS', 'MELINA', 9, 1.730, NULL, NULL, NULL, 'CHALORMSAK  SAWANAM', '2022-09-22 11:45:39', 'THB', '0'),
(58, 'MEBS', 'AMEC', 10, 1.330, NULL, NULL, NULL, 'CHALORMSAK  SAWANAM', '2022-09-22 11:45:50', 'THB', '0'),
(59, 'MEBS', 'MELINA', 10, 1.730, NULL, NULL, NULL, 'CHALORMSAK  SAWANAM', '2022-09-22 11:45:58', 'THB', '0'),
(60, 'MEBS', 'AMEC', 11, 0.043, NULL, NULL, NULL, 'CHALORMSAK  SAWANAM', '2022-09-22 11:46:05', 'USD', '0'),
(61, 'MEBS', 'MELINA', 11, 0.056, NULL, NULL, NULL, 'CHALORMSAK  SAWANAM', '2022-09-22 11:46:12', 'USD', '0'),
(155, 'AMEC', 'AMEC', 27, 0.040, NULL, NULL, NULL, NULL, NULL, 'USD', '1'),
(156, 'AMEC', 'MELINA', 27, 0.060, NULL, NULL, NULL, NULL, NULL, 'USD', '1'),
(20, 'AMEC', 'MELINA', 11, 0.056, NULL, NULL, NULL, 'CHALORMSAK  SAWANAM', '2022-09-22 11:57:45', 'USD', '1'),
(21, 'AMEC', 'AMEC', 11, 0.043, NULL, NULL, NULL, 'THEERAPATH  JITTAWATTANA', '2020-10-16 13:37:00', 'USD', '1'),
(32, 'AMEC', 'AMEC', 15, 0.040, NULL, NULL, NULL, NULL, NULL, 'USD', '1'),
(33, 'AMEC', 'MELINA', 15, 0.050, NULL, NULL, NULL, NULL, NULL, 'USD', '1'),
(34, 'AMEC', 'AMEC', 16, 0.040, NULL, NULL, NULL, 'CHALORMSAK  SAWANAM', '2022-09-22 11:20:01', 'USD', '1'),
(35, 'AMEC', 'MELINA', 16, 0.050, NULL, NULL, NULL, NULL, NULL, 'USD', '1'),
(14, 'MELCO', 'AMEC', 9, 1.330, NULL, NULL, NULL, 'THOTSAPOL  PONGOUGSORNPUGDEE', '2020-05-20 09:19:41', 'THB', '1'),
(15, 'MELCO', 'MELINA', 9, 1.730, NULL, NULL, NULL, 'THOTSAPOL  PONGOUGSORNPUGDEE', '2020-05-20 09:20:36', 'THB', '1'),
(16, 'MELCO', 'AMEC', 10, 1.330, NULL, NULL, NULL, 'THOTSAPOL  PONGOUGSORNPUGDEE', '2020-05-20 09:19:53', 'THB', '1'),
(17, 'MELCO', 'MELINA', 10, 1.730, NULL, NULL, NULL, 'THOTSAPOL  PONGOUGSORNPUGDEE', '2020-05-20 09:20:43', 'THB', '1'),
(36, 'AMEC', 'AMEC', 17, 0.040, NULL, NULL, NULL, NULL, NULL, 'USD', '1'),
(37, 'AMEC', 'MELINA', 17, 0.060, NULL, NULL, NULL, NULL, NULL, 'USD', '1'),
(38, 'AMEC', 'AMEC', 18, 0.040, NULL, NULL, NULL, NULL, NULL, 'USD', '1'),
(39, 'AMEC', 'MELINA', 18, 0.050, NULL, NULL, NULL, NULL, NULL, 'USD', '1'),
(40, 'AMEC', 'AMEC', 19, 0.040, NULL, NULL, NULL, NULL, NULL, 'USD', '1'),
(41, 'AMEC', 'MELINA', 19, 0.060, NULL, NULL, NULL, NULL, NULL, 'USD', '1'),
(42, 'AMEC', 'AMEC', 20, 1.290, NULL, NULL, NULL, 'THEERAPATH  JITTAWATTANA', '2023-04-03 10:26:01', 'THB', '1'),
(43, 'AMEC', 'MELINA', 20, 1.680, NULL, NULL, NULL, 'THEERAPATH  JITTAWATTANA', '2023-04-03 10:26:12', 'THB', '1'),
(44, 'AMEC', 'AMEC', 21, 0.040, NULL, NULL, NULL, NULL, NULL, 'USD', '1'),
(45, 'AMEC', 'MELINA', 21, 0.050, NULL, NULL, NULL, NULL, NULL, 'USD', '1'),
(46, 'AMEC', 'AMEC', 22, 0.051, NULL, NULL, NULL, 'CHALORMSAK  SAWANAM', '2021-05-19 16:46:55', 'USD', '1'),
(47, 'AMEC', 'MELINA', 22, 0.050, NULL, NULL, NULL, NULL, NULL, 'USD', '1'),
(52, 'AMEC', 'AMEC', 23, 0.040, NULL, NULL, NULL, 'CHALORMSAK  SAWANAM', '2021-10-04 18:42:47', 'USD', '1'),
(62, 'Direct', 'AMEC', 24, 1.000, NULL, NULL, NULL, NULL, NULL, NULL, '1'),
(9, 'Direct', 'AMEC', 4, 0.036, NULL, NULL, NULL, 'BHURIDA  LANYAME', '2023-09-29 11:42:56', 'USD', '1'),
(10, 'Direct', 'AMEC', 5, 1.110, NULL, NULL, NULL, 'BHURIDA  LANYAME', '2023-05-19 10:43:30', 'THB', '1'),
(12, 'Direct', 'AMEC', 7, 1.110, NULL, NULL, NULL, 'BHURIDA  LANYAME', '2023-05-19 10:44:31', 'THB', '1'),
(13, 'Direct', 'AMEC', 8, 1.160, NULL, NULL, NULL, 'BHURIDA  LANYAME', '2023-05-19 10:43:58', 'THB', '1'),
(26, 'AMEC', 'AMEC', 12, 1.130, NULL, NULL, NULL, 'THEERAPATH  JITTAWATTANA', '2021-01-04 14:15:39', 'THB', '1'),
(27, 'AMEC', 'MELINA', 12, 1.470, NULL, NULL, NULL, 'THEERAPATH  JITTAWATTANA', '2021-01-04 14:15:40', 'THB', '1'),
(28, 'AMEC', 'AMEC', 13, 1.290, NULL, NULL, NULL, 'THEERAPATH  JITTAWATTANA', '2021-01-04 14:15:41', 'THB', '1'),
(29, 'AMEC', 'MELINA', 13, 1.680, NULL, NULL, NULL, 'THEERAPATH  JITTAWATTANA', '2021-01-04 14:15:43', 'THB', '1'),
(30, 'AMEC', 'AMEC', 14, 0.044, NULL, NULL, NULL, 'THEERAPATH  JITTAWATTANA', '2021-01-04 14:29:06', 'USD', '1'),
(31, 'AMEC', 'MELINA', 14, 0.060, NULL, NULL, NULL, NULL, NULL, 'USD', '1'),
(153, 'MET', 'AMEC', 26, 1.070, NULL, NULL, NULL, NULL, NULL, 'THB', '1'),
(11, 'Direct', 'AMEC', 6, 1.080, NULL, NULL, NULL, 'BHURIDA  LANYAME', '2023-05-19 10:43:46', 'THB', '1'),
(18, 'MELCO', 'AMEC', 11, 0.043, NULL, NULL, NULL, 'THEERAPATH  JITTAWATTANA', '2020-10-16 13:35:57', 'USD', '1'),
(19, 'MELCO', 'MELINA', 11, 0.056, NULL, NULL, NULL, 'THEERAPATH  JITTAWATTANA', '2020-10-16 13:35:58', 'USD', '1'),
(63, 'MEBS', 'TOKAN', 25, 1.320, NULL, NULL, NULL, NULL, NULL, 'JPY', '1'),
(64, 'AMF', 'TOKAN', 25, 1.400, NULL, NULL, NULL, NULL, NULL, 'EUR', '1'),
(65, 'BMEC', 'TOKAN', 25, 1.664, NULL, NULL, NULL, NULL, NULL, 'USD', '1'),
(66, 'CAVENAS', 'TOKAN', 25, 1.400, NULL, NULL, NULL, NULL, NULL, 'USD', '1'),
(67, 'COHECO', 'TOKAN', 25, 1.400, NULL, NULL, NULL, NULL, NULL, 'USD', '1'),
(68, 'ELMAS', 'TOKAN', 25, 1.400, NULL, NULL, NULL, NULL, NULL, 'EUR', '1'),
(69, 'EMEC', 'TOKAN', 25, 1.400, NULL, NULL, NULL, NULL, NULL, 'EUR', '1'),
(70, 'AG-MELCO', 'TOKAN', 25, 1.400, NULL, NULL, NULL, NULL, NULL, 'USD', '1'),
(71, 'FAIN', 'TOKAN', 25, 1.400, NULL, NULL, NULL, NULL, NULL, 'EUR', '1'),
(72, 'GDRLE', 'TOKAN', 25, 1.400, NULL, NULL, NULL, NULL, NULL, 'JPY', '1'),
(73, 'HMEC', 'TOKAN', 25, 1.400, NULL, NULL, NULL, NULL, NULL, 'USD', '1'),
(74, 'HW', 'TOKAN', 25, 1.400, NULL, NULL, NULL, NULL, NULL, 'USD', '1'),
(75, 'HWAA', 'TOKAN', 25, 1.400, NULL, NULL, NULL, NULL, NULL, 'USD', '1'),
(76, 'IEE', 'TOKAN', 25, 1.400, NULL, NULL, NULL, NULL, NULL, 'THB', '1'),
(77, 'IMEC', 'TOKAN', 25, 1.400, NULL, NULL, NULL, NULL, NULL, 'USD', '1'),
(78, 'INEMESA', 'TOKAN', 25, 1.400, NULL, NULL, NULL, NULL, NULL, 'USD', '1'),
(79, 'KMEC', 'TOKAN', 25, 1.400, NULL, NULL, NULL, NULL, NULL, 'THB', '1'),
(80, 'IU', 'TOKAN', 25, 1.400, NULL, NULL, NULL, NULL, NULL, 'USD', '1'),
(81, 'YECL', 'TOKAN', 25, 1.400, NULL, NULL, NULL, NULL, NULL, 'USD', '1'),
(82, 'MCLS', 'TOKAN', 25, 1.400, NULL, NULL, NULL, NULL, NULL, 'USD', '1'),
(83, 'MEGPT', 'TOKAN', 25, 1.400, NULL, NULL, NULL, NULL, NULL, 'USD', '1'),
(84, 'MELCOL', 'TOKAN', 25, 1.400, NULL, NULL, NULL, NULL, NULL, 'USD', '1'),
(85, 'MELM', 'TOKAN', 25, 1.400, NULL, NULL, NULL, NULL, NULL, 'THB', '1'),
(86, 'MELMEX', 'TOKAN', 25, 1.400, NULL, NULL, NULL, NULL, NULL, 'USD', '1'),
(87, 'MELSA', 'TOKAN', 25, 1.400, NULL, NULL, NULL, NULL, NULL, 'USD', '1'),
(88, 'MESP', 'TOKAN', 25, 1.400, NULL, NULL, NULL, NULL, NULL, 'THB', '1'),
(89, 'MET', 'TOKAN', 25, 1.160, NULL, NULL, NULL, NULL, NULL, 'THB', '1'),
(90, 'MEUK', 'TOKAN', 25, 1.400, NULL, NULL, NULL, NULL, NULL, 'GBP', '1'),
(91, 'MEUS', 'TOKAN', 25, 1.400, NULL, NULL, NULL, NULL, NULL, 'USD', '1'),
(92, 'MITS', 'TOKAN', 25, 1.400, NULL, NULL, NULL, NULL, NULL, 'USD', '1'),
(93, 'MITSULIFT', 'TOKAN', 25, 1.400, NULL, NULL, NULL, NULL, NULL, 'USD', '1'),
(94, 'MJEE', 'TOKAN', 25, 1.400, NULL, NULL, NULL, NULL, NULL, 'THB', '1'),
(95, 'MLAO', 'TOKAN', 25, 1.400, NULL, NULL, NULL, NULL, NULL, 'USD', '1'),
(96, 'MSAF', 'TOKAN', 25, 1.400, NULL, NULL, NULL, NULL, NULL, 'USD', '1'),
(97, 'SAN_MIGUEL', 'TOKAN', 25, 1.400, NULL, NULL, NULL, NULL, NULL, 'USD', '1'),
(98, 'SMEC', 'TOKAN', 25, 1.400, NULL, NULL, NULL, NULL, NULL, 'USD', '1'),
(99, 'SYSCON', 'TOKAN', 25, 1.400, NULL, NULL, NULL, NULL, NULL, 'USD', '1'),
(100, 'TLE', 'TOKAN', 25, 1.400, NULL, NULL, NULL, NULL, NULL, 'USD', '1'),
(101, 'TMEC', 'TOKAN', 25, 1.400, NULL, NULL, NULL, NULL, NULL, 'USD', '1'),
(102, 'TRIANON', 'TOKAN', 25, 1.400, NULL, NULL, NULL, NULL, NULL, 'USD', '1'),
(103, 'TTE', 'TOKAN', 25, 1.400, NULL, NULL, NULL, NULL, NULL, 'USD', '1'),
(104, 'UNIHEIS', 'TOKAN', 25, 1.400, NULL, NULL, NULL, NULL, NULL, 'USD', '1'),
(105, 'VMEC', 'TOKAN', 25, 1.400, NULL, NULL, NULL, NULL, NULL, 'USD', '1'),
(106, 'INFINITY', 'TOKAN', 25, 1.400, NULL, NULL, NULL, NULL, NULL, 'EUR', '1'),
(107, 'MOTUM', 'TOKAN', 25, 1.400, NULL, NULL, NULL, NULL, NULL, 'USD', '1'),
(108, 'MEBS', 'TOKYO ROPE', 25, 1.320, NULL, NULL, NULL, NULL, NULL, 'JPY', '1'),
(109, 'AMF', 'TOKYO ROPE', 25, 1.360, NULL, NULL, NULL, NULL, NULL, 'EUR', '1'),
(110, 'BMEC', 'TOKYO ROPE', 25, 1.664, NULL, NULL, NULL, NULL, NULL, 'USD', '1'),
(111, 'CAVENAS', 'TOKYO ROPE', 25, 1.360, NULL, NULL, NULL, NULL, NULL, 'USD', '1'),
(112, 'COHECO', 'TOKYO ROPE', 25, 1.360, NULL, NULL, NULL, NULL, NULL, 'USD', '1'),
(113, 'ELMAS', 'TOKYO ROPE', 25, 1.360, NULL, NULL, NULL, NULL, NULL, 'EUR', '1'),
(114, 'EMEC', 'TOKYO ROPE', 25, 1.360, NULL, NULL, NULL, NULL, NULL, 'EUR', '1'),
(115, 'AG-MELCO', 'TOKYO ROPE', 25, 1.360, NULL, NULL, NULL, NULL, NULL, 'USD', '1'),
(116, 'FAIN', 'TOKYO ROPE', 25, 1.360, NULL, NULL, NULL, NULL, NULL, 'EUR', '1'),
(117, 'GDRLE', 'TOKYO ROPE', 25, 1.360, NULL, NULL, NULL, NULL, NULL, 'JPY', '1'),
(118, 'HMEC', 'TOKYO ROPE', 25, 1.360, NULL, NULL, NULL, NULL, NULL, 'USD', '1'),
(119, 'HW', 'TOKYO ROPE', 25, 1.360, NULL, NULL, NULL, NULL, NULL, 'USD', '1'),
(120, 'HWAA', 'TOKYO ROPE', 25, 1.360, NULL, NULL, NULL, NULL, NULL, 'USD', '1'),
(121, 'IEE', 'TOKYO ROPE', 25, 1.360, NULL, NULL, NULL, NULL, NULL, 'THB', '1'),
(122, 'IMEC', 'TOKYO ROPE', 25, 1.360, NULL, NULL, NULL, NULL, NULL, 'USD', '1'),
(123, 'INEMESA', 'TOKYO ROPE', 25, 1.360, NULL, NULL, NULL, NULL, NULL, 'USD', '1'),
(124, 'KMEC', 'TOKYO ROPE', 25, 1.360, NULL, NULL, NULL, NULL, NULL, 'THB', '1'),
(125, 'IU', 'TOKYO ROPE', 25, 1.360, NULL, NULL, NULL, NULL, NULL, 'USD', '1'),
(126, 'YECL', 'TOKYO ROPE', 25, 1.360, NULL, NULL, NULL, NULL, NULL, 'USD', '1'),
(127, 'MCLS', 'TOKYO ROPE', 25, 1.360, NULL, NULL, NULL, NULL, NULL, 'USD', '1'),
(128, 'MEGPT', 'TOKYO ROPE', 25, 1.360, NULL, NULL, NULL, NULL, NULL, 'USD', '1'),
(129, 'MELCOL', 'TOKYO ROPE', 25, 1.360, NULL, NULL, NULL, NULL, NULL, 'USD', '1'),
(130, 'MELM', 'TOKYO ROPE', 25, 1.360, NULL, NULL, NULL, NULL, NULL, 'THB', '1'),
(131, 'MELMEX', 'TOKYO ROPE', 25, 1.360, NULL, NULL, NULL, NULL, NULL, 'USD', '1'),
(132, 'MELSA', 'TOKYO ROPE', 25, 1.360, NULL, NULL, NULL, NULL, NULL, 'USD', '1'),
(133, 'MESP', 'TOKYO ROPE', 25, 1.360, NULL, NULL, NULL, NULL, NULL, 'THB', '1'),
(134, 'MET', 'TOKYO ROPE', 25, 1.160, NULL, NULL, NULL, NULL, NULL, 'THB', '1'),
(135, 'MEUK', 'TOKYO ROPE', 25, 1.360, NULL, NULL, NULL, NULL, NULL, 'GBP', '1'),
(136, 'MEUS', 'TOKYO ROPE', 25, 1.360, NULL, NULL, NULL, NULL, NULL, 'USD', '1'),
(137, 'MITS', 'TOKYO ROPE', 25, 1.360, NULL, NULL, NULL, NULL, NULL, 'USD', '1'),
(138, 'MITSULIFT', 'TOKYO ROPE', 25, 1.360, NULL, NULL, NULL, NULL, NULL, 'USD', '1'),
(139, 'MJEE', 'TOKYO ROPE', 25, 1.360, NULL, NULL, NULL, NULL, NULL, 'THB', '1'),
(140, 'MLAO', 'TOKYO ROPE', 25, 1.360, NULL, NULL, NULL, NULL, NULL, 'USD', '1'),
(141, 'MSAF', 'TOKYO ROPE', 25, 1.360, NULL, NULL, NULL, NULL, NULL, 'USD', '1'),
(142, 'SAN_MIGUEL', 'TOKYO ROPE', 25, 1.360, NULL, NULL, NULL, NULL, NULL, 'USD', '1'),
(143, 'SMEC', 'TOKYO ROPE', 25, 1.360, NULL, NULL, NULL, NULL, NULL, 'USD', '1'),
(144, 'SYSCON', 'TOKYO ROPE', 25, 1.360, NULL, NULL, NULL, NULL, NULL, 'USD', '1'),
(145, 'TLE', 'TOKYO ROPE', 25, 1.360, NULL, NULL, NULL, NULL, NULL, 'USD', '1'),
(146, 'TMEC', 'TOKYO ROPE', 25, 1.360, NULL, NULL, NULL, NULL, NULL, 'USD', '1'),
(147, 'TRIANON', 'TOKYO ROPE', 25, 1.360, NULL, NULL, NULL, NULL, NULL, 'USD', '1'),
(148, 'TTE', 'TOKYO ROPE', 25, 1.360, NULL, NULL, NULL, NULL, NULL, 'USD', '1'),
(149, 'UNIHEIS', 'TOKYO ROPE', 25, 1.360, NULL, NULL, NULL, NULL, NULL, 'USD', '1'),
(150, 'VMEC', 'TOKYO ROPE', 25, 1.360, NULL, NULL, NULL, NULL, NULL, 'USD', '1'),
(151, 'INFINITY', 'TOKYO ROPE', 25, 1.360, NULL, NULL, NULL, NULL, NULL, 'EUR', '1'),
(152, 'MOTUM', 'TOKYO ROPE', 25, 1.360, NULL, NULL, NULL, NULL, NULL, 'USD', '1'),
(153, 'MELPA', 'TOKYO ROPE', 25, 1.400, NULL, NULL, NULL, NULL, NULL, 'USD', '1'),
(154, 'MELPA', 'TOKAN', 25, 1.400, NULL, NULL, NULL, NULL, NULL, 'USD', '1');

-- --------------------------------------------------------

--
-- Table structure for table `SP_QUOTATION_TYPE`
--

CREATE TABLE `SP_QUOTATION_TYPE` (
  `QUOTYPE_ID` int DEFAULT NULL,
  `QUOTYPE_DESC` varchar(100) DEFAULT NULL,
  `QUOTYPE_STATUS` int DEFAULT NULL,
  `QUOTYPE_CUR` varchar(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `SP_QUOTATION_TYPE`
--

INSERT INTO `SP_QUOTATION_TYPE` (`QUOTYPE_ID`, `QUOTYPE_DESC`, `QUOTYPE_STATUS`, `QUOTYPE_CUR`) VALUES
(1, 'Order Part Supply', 1, 'THB'),
(2, 'Stock Part Supply', 1, 'THB'),
(3, 'Order Part Supply & Reconstruction', 1, 'THB'),
(4, 'EXPORT J/V(USD)', 1, 'USD'),
(5, 'EXPORT J/V(THB)', 1, 'THB'),
(15, 'Order Part Supply & Reconstruction (Only XGT, XHN,  XSL)', 1, 'THB'),
(16, 'Order Part Supply & Reconstruction (Only COH)', 1, 'USD'),
(17, 'Order Part Supply & Reconstruction (Only MLS)', 1, 'THB'),
(18, 'Order Part Supply & Reconstruction (Only IMC)', 1, 'THB'),
(19, 'Order Part Supply & Reconstruction (Only HMC)', 1, 'THB'),
(20, 'Order Part Supply & Reconstruction (Only IEE)', 1, 'THB'),
(21, 'Order Part Supply & Reconstruction (Only MEL)', 1, 'THB'),
(27, 'Order Part Supply & Reconstruction (Only MKH, MCC)', 1, 'USD'),
(23, 'Order Part Supply & Reconstruction (Only CR, TME)', 1, NULL),
(22, 'Order Part Supply & Reconstruction (Only XMX)', 1, 'USD'),
(24, 'Virtual Parts Center', 1, NULL),
(25, 'OUT TO OUT', 1, NULL),
(7, 'Stock Part Supply(FOR MTPE Direct)', 1, 'THB'),
(8, 'Stock Part Supply(FOR MET Direct)', 1, 'THB'),
(9, 'Order Part Supply & Reconstruction (Only JYT)', 1, 'THB'),
(10, 'Order Part Supply & Reconstruction (Only MEM and RM)', 1, 'THB'),
(12, 'Order Part Supply & Reconstruction (Only SVN, MLA)', 1, 'THB'),
(13, 'Order Part Supply & Reconstruction (Only MSP and RS)', 1, 'THB'),
(14, 'Order Part Supply & Reconstruction (Only MCL)', 1, 'USD'),
(26, 'Order Part Bracket', 1, 'THB'),
(6, 'EXPORT OTHER(THB)', 1, 'THB'),
(11, 'Order Part Supply & Reconstruction (Only VMC and TTE)', 1, 'USD');

-- --------------------------------------------------------

--
-- Table structure for table `SP_SHIPMENT`
--

CREATE TABLE `SP_SHIPMENT` (
  `SHIPMENT_ID` int DEFAULT NULL,
  `SHIPMENT_VALUE` int DEFAULT NULL,
  `SHIPMENT_DESC` varchar(100) DEFAULT NULL,
  `SHIPMENT_STATUS` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `SP_SHIPMENT`
--

INSERT INTO `SP_SHIPMENT` (`SHIPMENT_ID`, `SHIPMENT_VALUE`, `SHIPMENT_DESC`, `SHIPMENT_STATUS`) VALUES
(1, 90, '90 Days after receiving P/O', 1),
(2, 120, '120 Days after receiving P/O', 1),
(3, 150, '150 Days after receiving P/O', 1),
(4, 180, '180 Days after receiving P/O', 1),
(5, 60, '60 Days after receiving P/O', 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `SP_ATTACHED`
--
ALTER TABLE `SP_ATTACHED`
  ADD PRIMARY KEY (`INQ_NO`);

--
-- Indexes for table `SP_INQUIRY`
--
ALTER TABLE `SP_INQUIRY`
  ADD PRIMARY KEY (`INQ_ID`);

--
-- Indexes for table `SP_INQUIRY_DETAIL`
--
ALTER TABLE `SP_INQUIRY_DETAIL`
  ADD PRIMARY KEY (`INQD_ID`);

--
-- Indexes for table `SP_INQUIRY_GROUP`
--
ALTER TABLE `SP_INQUIRY_GROUP`
  ADD PRIMARY KEY (`INQG_ID`);

--
-- Indexes for table `SP_INQUIRY_REASON`
--
ALTER TABLE `SP_INQUIRY_REASON`
  ADD PRIMARY KEY (`REASON_ID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `SP_INQUIRY`
--
ALTER TABLE `SP_INQUIRY`
  MODIFY `INQ_ID` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `SP_INQUIRY_DETAIL`
--
ALTER TABLE `SP_INQUIRY_DETAIL`
  MODIFY `INQD_ID` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `SP_INQUIRY_GROUP`
--
ALTER TABLE `SP_INQUIRY_GROUP`
  MODIFY `INQG_ID` int NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
