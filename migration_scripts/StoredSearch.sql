 

CREATE TABLE IF NOT EXISTS Storedsearch (
  _id int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT ,
  user_id int(11) NOT NULL,
  createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt datetime DEFAULT NULL,
  name VARCHAR(255) NOT NULL,
  search TEXT NOT NULL
  
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

ALTER TABLE Storedsearch ADD FOREIGN KEY (user_id) REFERENCES Users(_id);



