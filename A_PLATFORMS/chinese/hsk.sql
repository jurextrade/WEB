-- phpMyAdmin SQL Dump
-- version 4.9.7
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Feb 02, 2023 at 02:12 PM
-- Server version: 5.7.34-cll-lve
-- PHP Version: 7.4.29

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `uk4ibca5_jurexdb`
--

-- --------------------------------------------------------

--
-- Table structure for table `hsk`
--

CREATE TABLE `hsk` (
  `hsk_id` varchar(50) COLLATE utf8mb4_unicode_520_ci DEFAULT NULL,
  `hsk_type` varchar(25) COLLATE utf8mb4_unicode_520_ci DEFAULT NULL,
  `hsk_ch` varchar(50) COLLATE utf8mb4_unicode_520_ci DEFAULT NULL,
  `hsk_pin` varchar(50) COLLATE utf8mb4_unicode_520_ci DEFAULT NULL,
  `hsk_eng` varchar(50) COLLATE utf8mb4_unicode_520_ci DEFAULT NULL,
  `hsk_pin_s` varchar(255) COLLATE utf8mb4_unicode_520_ci DEFAULT NULL,
  `hsk_eng_s` varchar(255) COLLATE utf8mb4_unicode_520_ci DEFAULT NULL,
  `hsk_ch_s` varchar(255) COLLATE utf8mb4_unicode_520_ci DEFAULT NULL,
  `hsk_gr` varchar(255) COLLATE utf8mb4_unicode_520_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
