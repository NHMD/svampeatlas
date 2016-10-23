-- phpMyAdmin SQL Dump
-- version 4.2.11
-- http://www.phpmyadmin.net
--
-- Vært: 127.0.0.1
-- Genereringstid: 14. 10 2016 kl. 07:15:13
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
-- Struktur-dump for tabellen `Substrate`
--

CREATE TABLE IF NOT EXISTS `Substrate` (
`_id` int(11) NOT NULL,
  `name` varchar(45) CHARACTER SET utf8 DEFAULT NULL,
  `name_uk` varchar(255) COLLATE utf8_bin DEFAULT NULL,
  `hide` tinyint(2) NOT NULL DEFAULT '0',
  `group_dk` varchar(255) COLLATE utf8_bin DEFAULT NULL,
  `group_uk` varchar(255) COLLATE utf8_bin DEFAULT NULL
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Data dump for tabellen `Substrate`
--

INSERT INTO `Substrate` (`_id`, `name`, `name_uk`, `hide`, `group_dk`, `group_uk`) VALUES
(1, 'jord eller humus', 'soil', 0, 'jord', 'jord'),
(2, 'løv- eller nåledække, løse blade og nåle', 'leaf or needle litter', 0, 'plantemateriale', 'plant material'),
(3, 'urtestængler, græsstrå mv.', 'stems of herbs, grass etc', 0, 'plantemateriale', 'plant material'),
(4, 'ved', 'wood', 1, 'ved', 'wood'),
(5, 'bark', 'bark', 1, 'ved', 'wood'),
(6, 'træ- og barkflis', 'wood chips or mulch', 0, 'ved', 'wood'),
(7, 'kogler af nåletræer', 'cones', 0, 'plantemateriale', 'plant material'),
(8, 'rakler', 'catkins', 0, 'plantemateriale', 'plant  material'),
(9, 'mos', 'mosses', 0, 'mosser', 'mosses'),
(10, 'svampe', 'fungi', 0, 'svampe og svampedyr', 'fungi and mycetozoans'),
(11, 'svampedyr', 'mycetozoans', 0, 'svampe og svampedyr', 'svampe og svampedyr'),
(12, 'ekskrementer', 'faeces', 0, 'dyr', 'animals'),
(13, 'rester af hvirveldyr (fx fjer og pels)', 'remains of vertebrates (e.g. feathers and fur)', 0, 'dyr', 'animals'),
(14, 'insekter', 'insects', 0, 'dyr', 'animals'),
(15, 'edderkopper', 'spiders', 0, 'dyr', 'animals'),
(16, 'brandplet', 'fire spot', 0, 'brandplet', 'brandplet'),
(17, 'andet substrat', 'other substrate', 0, 'andet substrat', 'other substrate'),
(18, 'sten', 'stone', 0, 'sten', 'stone'),
(19, 'sur sten', 'siliceous stone', 0, 'sten', 'stone'),
(20, 'kalksten', 'calcareous stone', 0, 'sten', 'stone'),
(21, 'bygningssten (tegl, mursten)', 'building stone (e.g. bricks)', 0, 'sten', 'stone'),
(22, 'levermos', 'liverworts', 0, 'mosser', 'mosses'),
(23, 'tørvemos', 'peat mosses', 0, 'mosser', 'mosses'),
(24, 'levenede urtestængler, græsstrå mv.', 'living stems of herbs, grass etc', 0, 'plantemateriale', 'plant material'),
(25, 'døde urtestængler, græsstrå mv.', 'dead stems of herbs, grass etc', 0, 'plantemateriale', 'plant material'),
(26, 'levende blade', 'living leaves', 0, 'plantemateriale', 'plant material'),
(27, 'levende blomster', 'living flowers', 0, 'plantemateriale', 'plant material'),
(28, 'bark af levende træer', 'bark of living trees', 0, 'ved', 'wood'),
(29, 'dødt ved (inklusiv bark)', 'dead wood (including bark)', 0, 'ved', 'wood'),
(30, 'ved og rødder af levende træer', 'wood and roots of living trees', 0, 'ved', 'wood'),
(31, 'frugter', 'fruits', 0, 'plantemateriale', 'plant material');

--
-- Begrænsninger for dumpede tabeller
--

--
-- Indeks for tabel `Substrate`
--
ALTER TABLE `Substrate`
 ADD PRIMARY KEY (`_id`);

--
-- Brug ikke AUTO_INCREMENT for slettede tabeller
--

--
-- Tilføj AUTO_INCREMENT i tabel `Substrate`
--
ALTER TABLE `Substrate`
MODIFY `_id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=31;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
