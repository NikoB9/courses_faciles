CREATE DATABASE /*!32312 IF NOT EXISTS*/ eazy_shopping;

USE eazy_shopping;

CREATE TABLE IF NOT EXISTS users (
id int NOT NULL AUTO_INCREMENT,
login varchar(255) NOT NULL,
password varchar(255) NOT NULL,
primary key (id)
)ENGINE=INNODB;


CREATE TABLE IF NOT EXISTS shoppinglists (
id  int NOT NULL AUTO_INCREMENT,
idUser int,

name varchar(255) DEFAULT NULL,
money_unit varchar(10) DEFAULT NULL,

primary key (id),
CONSTRAINT FK_shoppinglists_users FOREIGN KEY (idUser) 
REFERENCES users (id) ON UPDATE CASCADE ON DELETE CASCADE
)ENGINE=INNODB;


CREATE TABLE IF NOT EXISTS categories (
id  int NOT NULL AUTO_INCREMENT,
idSL int,

name varchar(255) DEFAULT NULL,

primary key (id),
CONSTRAINT FK_shoppinglists_categories FOREIGN KEY (idSL) 
REFERENCES shoppinglists (id) ON UPDATE CASCADE ON DELETE CASCADE
)ENGINE=INNODB;

CREATE TABLE IF NOT EXISTS aliments (
id  int NOT NULL AUTO_INCREMENT,
idCat int,

name varchar(255),
quantity DECIMAL(5,5),
unit varchar(255),
max_price DECIMAL(5,5),

primary key (id),
CONSTRAINT FK_aliments_categories FOREIGN KEY (idCat) 
REFERENCES categories (id) ON UPDATE CASCADE ON DELETE CASCADE
)ENGINE=INNODB;

