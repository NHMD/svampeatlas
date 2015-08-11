-- phpMyAdmin SQL Dump
-- version 4.2.11
-- http://www.phpmyadmin.net
--
-- Vært: 127.0.0.1
-- Genereringstid: 02. 06 2015 kl. 11:19:29
-- Serverversion: 5.6.21-log
-- PHP-version: 5.5.14

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `svampeatlas`
--

-- --------------------------------------------------------

--
-- Struktur-dump for tabellen `NaturtypeTaxon`
--

CREATE TABLE IF NOT EXISTS `TaxonNaturtype` (
  `naturtype_id` int(11) NOT NULL,
  `taxon_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Begrænsninger for dumpede tabeller
--

--
-- Indeks for tabel `NaturtypeTaxon`
--
ALTER TABLE `TaxonNaturtype`
 ADD PRIMARY KEY (`naturtype_id`,`taxon_id`), ADD KEY `taxon_id` (`taxon_id`);

--
-- Begrænsninger for dumpede tabeller
--

--
-- Begrænsninger for tabel `NaturtypeTaxon`
--

select t.taxon_id from TaxonNaturtype t where t.taxon_id not in (select distinct _id from Taxon);

ALTER TABLE `TaxonNaturtype`
ADD CONSTRAINT `naturtypetaxon_ibfk_1` FOREIGN KEY (`naturtype_id`) REFERENCES `Naturtyper` (`_id`),
ADD CONSTRAINT `naturtypetaxon_ibfk_2` FOREIGN KEY (`taxon_id`) REFERENCES `Taxon` (`_id`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

INSERT INTO TaxonNaturtype SELECT n._id, t.DkIndexNumber FROM Naturtyper n JOIN TaxonBase t ON t.Naturtyper LIKE CONCAT("%",n.verbatimId,"%");

INSERT INTO TaxonNaturtype SELECT n._id, t.DkIndexNumber FROM Naturtyper n JOIN TaxonBase_missing_taxa t ON t.Naturtyper LIKE CONCAT("%",n.verbatimId,"%");

