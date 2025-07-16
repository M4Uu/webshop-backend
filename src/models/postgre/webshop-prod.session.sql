-- PostgreSQL version
-- https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg
-- En PostgreSQL no se usa USE, debes conectarte directamente a la DB
-- \c users_db (esto se ejecutaría en la terminal psql)
update wp_usuarios
set
   imagen_url = 'https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg'
   -- Consultas finales
SELECT
   *
FROM
   wp_usuarios;

--
delete from wp_usuarios
where
   cedula = 29643469
   --
alter table wp_usuarios alter column imagen_url type varchar(255),
alter column imagen_url
set
   not null,
   alter column imagen_url
set
   default 'https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg';

--
ALTER TABLE wp_usuarios ALTER COLUMN localidad TYPE VARCHAR(255);

-- Permitir valores nulos en la columna
ALTER TABLE wp_usuarios ALTER COLUMN localidad DROP NOT NULL;