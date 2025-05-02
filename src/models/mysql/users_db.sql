DROP DATABASE IF EXISTS users_db;

CREATE DATABASE users_db;

USE users_db;

CREATE TABLE users(
	id BINARY(16) PRIMARY KEY UNIQUE DEFAULT (UUID_TO_BIN(UUID())),
	user_name VARCHAR(50) NOT NULL UNIQUE,
	email_address VARCHAR(50) NOT NULL UNIQUE,
	first_name VARCHAR(50) NOT NULL,
	last_name VARCHAR(50) NOT NULL,
	pswd VARCHAR(50) NOT NULL,
	created_ad TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE direction(
	id BINARY(16) PRIMARY KEY UNIQUE DEFAULT (UUID_TO_BIN(UUID())),
	country VARCHAR(50),
	state VARCHAR(50),
	city VARCHAR(50)
);

CREATE TABLE providers(
	id BINARY(16) PRIMARY KEY UNIQUE DEFAULT (UUID_TO_BIN(UUID())),
	name VARCHAR(50) NOT NULL,
	description VARCHAR(255),
	phone VARCHAR(17) NOT NULL,
	email VARCHAR(50) NOT NULL,
	direction BINARY(16),
	FOREIGN KEY (direction) REFERENCES direction(id) ON UPDATE CASCADE
);

CREATE TABLE articles(
	id BINARY(16) PRIMARY KEY UNIQUE DEFAULT (UUID_TO_BIN(UUID())),
	name VARCHAR(50) NOT NULL,
	description VARCHAR(50) NOT NULL,
	price DECIMAL(10, 2) NOT NULL,
	stock INT NOT NULL DEFAULT (0),
	created_ad TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Esta tabla de unión identifica de cual proveedor es cada artículo.
CREATE TABLE articles_has_providers(
	id BINARY(16) PRIMARY KEY UNIQUE DEFAULT (UUID_TO_BIN(UUID())),
	provider_id BINARY(16),
	article_id BINARY(16),
	price DECIMAL(10, 2) NOT NULL,
	stock INT NOT NULL,
	supply_date DATE,
	condicions VARCHAR(255),
	created_ad TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	update_ad TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	FOREIGN KEY (article_id) REFERENCES articles(id) ON UPDATE CASCADE,
	FOREIGN KEY (provider_id) REFERENCES providers(id) ON UPDATE CASCADE
);

CREATE TABLE invoice(
	id BINARY(16) PRIMARY KEY UNIQUE DEFAULT (UUID_TO_BIN(UUID())),
	user_name VARCHAR(50),
	user_id BINARY(16),
	quantity INT NOT NULL DEFAULT 1,
	FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE CASCADE,
	created_ad TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Factura artículo UUID, corresponde a la factura 1, del artículo A, comprados X.
CREATE TABLE article_has_invoice(
	id BINARY(16) PRIMARY KEY UNIQUE DEFAULT (UUID_TO_BIN(UUID())),
	invoice_id BINARY(16),
	article_id BINARY(16),
	quantity INT NOT NULL,
	iva INT NOT NULL,
	FOREIGN KEY (invoice_id) REFERENCES invoice(id) ON UPDATE CASCADE,
	FOREIGN KEY (article_id) REFERENCES articles(id) ON UPDATE CASCADE
);

-- Insersión de elementos en las tablas


INSERT INTO users(user_name, email_address, first_name, last_name, pswd) VALUES
	("mariaDB", "maria_antonia@gmail.com", "María", "Antonia", "2233L"),
	("Teresa", "t_mora@gmail.com", "Teresa", "Mora", "11111");

INSERT INTO articles(name, description, price, stock) VALUES
	("zapatos deportivos", "Calzado para hacer deporte",50.23 , 200),
	("Tacos para football", "Para profesionales", 70.48, 130);

INSERT INTO direction(country, state, city) VALUES
	("Alemania","Erlangen-Höchstadt","Herzogenaurach");

INSERT INTO providers (name, description, phone, email, direction)
SELECT
	'Adidas' AS name,
	'Marca deportiva' AS description,
	'9999-999-999' AS phone,
	'adidas@gmail.com' AS email,
	d.id AS direction
FROM direction d
WHERE d.country = 'Alemania'
UNION ALL
SELECT
	'Puma',
	'Marca deportiva',
	'8888-888-8888',
	'puma@gmail.com',
	d.id
FROM direction d
WHERE d.country = 'Alemania';

INSERT INTO invoice (user_name, user_id)
SELECT user_name, id
FROM users WHERE user_name IN ('Teresa', 'mariaDB');

INSERT INTO articles_has_providers (provider_id, article_id, price, stock, supply_date, condicions)
SELECT
	p.id AS provider_id,
	a.id AS article_id,
	a.price AS price,
	a.stock AS stock,
	a.created_ad AS supply_date,
	'Condición estándar' AS condicions
FROM articles a
JOIN providers p ON p.id IS NOT NULL;

INSERT INTO article_has_invoice (invoice_id, article_id, quantity, iva)
SELECT
	i.id AS invoice_id,
	a.id AS article_id,
	i.quantity AS quantity,
	15 AS iva
FROM
	invoice i
JOIN
	articles a ON a.id IS NOT NULL;

-- Visaulización de las tablas

SELECT * FROM users;
SELECT * FROM articles;
SELECT * FROM providers;
SELECT * FROM invoice;
SELECT * FROM articles_has_providers;
SELECT * FROM article_has_invoice;
SELECT * FROM direction

delete from users
 where users.user_name = "test"