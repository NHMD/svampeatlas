CREATE TABLE IF NOT EXISTS `DeterminationLog` (
`_id` int(11) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT NULL,
  `logObject` text,
  `observation_id` int(11) NOT NULL,
  `determination_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `eventType` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Begrænsninger for dumpede tabeller
--

--
-- Indeks for tabel `DeterminationLog`
--
ALTER TABLE `DeterminationLog`
 ADD PRIMARY KEY (`_id`), ADD KEY `DeterminationLog_ibfk_2` (`user_id`), ADD KEY `DeterminationLog_ibfk_3` (`determination_id`), ADD KEY `DeterminationLog_ibfk_4` (`createdAt`);

--
-- Brug ikke AUTO_INCREMENT for slettede tabeller
--

--
-- Tilføj AUTO_INCREMENT i tabel `DeterminationLog`
--
ALTER TABLE `DeterminationLog`
MODIFY `_id` int(11) NOT NULL AUTO_INCREMENT;
--
-- Begrænsninger for dumpede tabeller
--

--
-- Begrænsninger for tabel `DeterminationLog`
--
ALTER TABLE `DeterminationLog`
ADD CONSTRAINT `DeterminationLog_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `Users` (`_id`);