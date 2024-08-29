DROP DATABASE IF EXISTS users_db;

CREATE DATABASE users_db;

USE users_db;

CREATE TABLE users(
	user_id BINARY(16) PRIMARY KEY DEFAULT (UUID_TO_BIN(UUID())),
	user_name VARCHAR(50) NOT NULL UNIQUE,
	email_address VARCHAR(50) NOT NULL UNIQUE,
	first_name VARCHAR(50) NOT NULL,
	last_name VARCHAR(50) NOT NULL,
	pswd VARCHAR(50) NOT NULL,
	created_ad TIMESTAMP NOT NULL DEFAULT (NOW())
);

INSERT INTO users(user_id ,user_name, email_address, first_name, last_name, pswd) VALUES
(UUID_TO_BIN(UUID()), "mariaDB", "maria_antonia@gmail.com", "María", "Antonia", "2233L"),
(UUID_TO_BIN(UUID()) ,"Teresa", "t_mora@gmail.com", "Teresa", "Mora", "11111");

SELECT BIN_TO_UUID(user_id), user_name, email_address, first_name, last_name, pswd, created_ad FROM users;

delete from users
 where users.user_name = "test"