CREATE TABLE `chats` (
  `id` varchar(20) NOT NULL,
  `type` varchar(10) NOT NULL,
  `text` varchar(1000) NOT NULL,
  `time` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
