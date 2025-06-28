-- PostgreSQL version
-- https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg

-- En PostgreSQL no se usa USE, debes conectarte directamente a la DB
-- \c users_db (esto se ejecutaría en la terminal psql)

update users
   set img='https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg'

-- Consultas finales
SELECT * FROM wp_usuarios;
SELECT cedula, password, nombres, nombre_usuario, localidad, correo, imagen_url
        FROM "wp_usuarios"
        WHERE correo = 'test@gmail.com'