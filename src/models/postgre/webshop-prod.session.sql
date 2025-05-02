-- PostgreSQL version
DROP DATABASE IF EXISTS users_db;

CREATE DATABASE users_db;

-- En PostgreSQL no se usa USE, debes conectarte directamente a la DB
-- \c users_db (esto se ejecutaría en la terminal psql)

CREATE TABLE users(
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_name VARCHAR(50) NOT NULL UNIQUE,
    email_address VARCHAR(50) NOT NULL UNIQUE,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    pswd VARCHAR(50) NOT NULL,
    created_ad TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE direction(
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    country VARCHAR(50),
    state VARCHAR(50),
    city VARCHAR(50)
);

CREATE TABLE providers(
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) NOT NULL,
    description VARCHAR(255),
    phone VARCHAR(17) NOT NULL,
    email VARCHAR(50) NOT NULL,
    direction UUID,
    FOREIGN KEY (direction) REFERENCES direction(id) ON UPDATE CASCADE
);

CREATE TABLE articles(
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) NOT NULL,
    description VARCHAR(50) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    stock INT NOT NULL DEFAULT 0,
    created_ad TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE articles_has_providers(
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider_id UUID,
    article_id UUID,
    price DECIMAL(10, 2) NOT NULL,
    stock INT NOT NULL,
    supply_date DATE,
    condicions VARCHAR(255),
    created_ad TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_ad TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (article_id) REFERENCES articles(id) ON UPDATE CASCADE,
    FOREIGN KEY (provider_id) REFERENCES providers(id) ON UPDATE CASCADE
);

-- Trigger para actualizar update_ad automáticamente
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.update_ad = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_articles_has_providers_timestamp
BEFORE UPDATE ON articles_has_providers
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

CREATE TABLE invoice(
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_name VARCHAR(50),
    user_id UUID,
    quantity INT NOT NULL DEFAULT 1,
    FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE CASCADE,
    created_ad TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE article_has_invoice(
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_id UUID,
    article_id UUID,
    quantity INT NOT NULL,
    iva INT NOT NULL,
    FOREIGN KEY (invoice_id) REFERENCES invoice(id) ON UPDATE CASCADE,
    FOREIGN KEY (article_id) REFERENCES articles(id) ON UPDATE CASCADE
);

-- Inserciones
INSERT INTO users(user_name, email_address, first_name, last_name, pswd) VALUES
    ('mariaDB', 'maria_antonia@gmail.com', 'María', 'Antonia', '2233L'),
    ('Teresa', 't_mora@gmail.com', 'Teresa', 'Mora', '11111');

INSERT INTO articles(name, description, price, stock) VALUES
    ('zapatos deportivos', 'Calzado para hacer deporte', 50.23, 200),
    ('Tacos para football', 'Para profesionales', 70.48, 130);

INSERT INTO direction(country, state, city) VALUES
    ('Alemania', 'Erlangen-Höchstadt', 'Herzogenaurach');

-- Para PostgreSQL necesitamos una sintaxis diferente para las inserciones con subconsultas
WITH provider_data AS (
    SELECT
        'Adidas' AS name,
        'Marca deportiva' AS description,
        '9999-999-999' AS phone,
        'adidas@gmail.com' AS email,
        d.id AS direction_id
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
    WHERE d.country = 'Alemania'
)
INSERT INTO providers (name, description, phone, email, direction)
SELECT name, description, phone, email, direction_id
FROM provider_data;

-- Insertar facturas
INSERT INTO invoice (user_name, user_id)
SELECT user_name, id
FROM users WHERE user_name IN ('Teresa', 'mariaDB');

-- Insertar artículos-proveedores
INSERT INTO articles_has_providers (provider_id, article_id, price, stock, supply_date, condicions)
SELECT
    p.id AS provider_id,
    a.id AS article_id,
    a.price AS price,
    a.stock AS stock,
    a.created_ad AS supply_date,
    'Condición estándar' AS condicions
FROM articles a
CROSS JOIN providers p;

-- Insertar artículos-factura
INSERT INTO article_has_invoice (invoice_id, article_id, quantity, iva)
SELECT
    i.id AS invoice_id,
    a.id AS article_id,
    i.quantity AS quantity,
    15 AS iva
FROM
    invoice i
CROSS JOIN
    articles a;

-- Consultas finales
SELECT * FROM users;
SELECT * FROM articles;
SELECT * FROM providers;
SELECT * FROM invoice;
SELECT * FROM articles_has_providers;
SELECT * FROM article_has_invoice;
SELECT * FROM direction;

-- Eliminar usuario (sintaxis corregida)
DELETE FROM users
WHERE user_name = 'test';
