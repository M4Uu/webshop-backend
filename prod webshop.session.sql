-- PostgreSQL Schema Conversion from MySQL Dump (FIXED ORDER)

--
-- Type for 'tipo_cuenta' in 'wp_bancario' table
--
DROP TYPE IF EXISTS account_type;
CREATE TYPE account_type AS ENUM ('ahorro', 'corriente');

--
-- Table structure for table `wp_categorias`
--
DROP TABLE IF EXISTS "wp_categorias" CASCADE;
CREATE TABLE "wp_categorias" (
    "id" SERIAL PRIMARY KEY,
    "nombre" VARCHAR(45) NOT NULL
);

--
-- Table structure for table `wp_materiales`
--
DROP TABLE IF EXISTS "wp_materiales" CASCADE;
CREATE TABLE "wp_materiales" (
    "id" SERIAL PRIMARY KEY,
    "nombre" VARCHAR(45) NOT NULL
);

--
-- Table structure for table `wp_prioridad`
--
DROP TABLE IF EXISTS "wp_prioridad" CASCADE;
CREATE TABLE "wp_prioridad" (
    "id" SERIAL PRIMARY KEY,
    "nombre" VARCHAR(50) NOT NULL
);

--
-- Table structure for table `wp_proveedores`
--
DROP TABLE IF EXISTS "wp_proveedores" CASCADE;
CREATE TABLE "wp_proveedores" (
    "id" SERIAL PRIMARY KEY,
    "nombre" VARCHAR(45) NOT NULL
);

--
-- Table structure for table `wp_roles`
--
DROP TABLE IF EXISTS "wp_roles" CASCADE;
CREATE TABLE "wp_roles" (
    "id" SERIAL PRIMARY KEY,
    "nombre" VARCHAR(50) NOT NULL
);

--
-- Table structure for table `wp_usuarios`
--
DROP TABLE IF EXISTS "wp_usuarios" CASCADE;
CREATE TABLE "wp_usuarios" (
    "cedula" INT PRIMARY KEY,
    "nombres" VARCHAR(255) NOT NULL,
    "nombre_usuario" VARCHAR(255) NOT NULL UNIQUE,
    "password" VARCHAR(255) NOT NULL,
    "localidad" VARCHAR(255) NOT NULL,
    "correo" VARCHAR(255) NOT NULL,
    "imagen_url" VARCHAR(512) DEFAULT NULL
);
COMMENT ON TABLE "wp_usuarios" IS 'Imágenes almacenadas en Imgur (URL)';


--
-- Table structure for table `wp_bancario`
-- (Depends on wp_usuarios)
--
DROP TABLE IF EXISTS "wp_bancario" CASCADE;
CREATE TABLE "wp_bancario" (
    "usuario_cedula" INT NOT NULL,
    "n_cuenta" VARCHAR(20) PRIMARY KEY,
    "tipo_cuenta" account_type NOT NULL, -- Using the custom ENUM type
    "banco_codigo" VARCHAR(10) NOT NULL,
    CONSTRAINT "fk_usuario_bancario" FOREIGN KEY ("usuario_cedula") REFERENCES "wp_usuarios" ("cedula")
);


--
-- Table structure for table `wp_carritos`
-- (Depends on wp_usuarios)
--
DROP TABLE IF EXISTS "wp_carritos" CASCADE;
CREATE TABLE "wp_carritos" (
    "id" SERIAL PRIMARY KEY,
    "usuario_cedula" INT NOT NULL,
    "fecha_creacion" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_actualizacion" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "fk_usuario_carrito" FOREIGN KEY ("usuario_cedula") REFERENCES "wp_usuarios" ("cedula")
);

-- Trigger function for 'fecha_actualizacion' in 'wp_carritos'
CREATE OR REPLACE FUNCTION update_fecha_actualizacion_carritos()
RETURNS TRIGGER AS $$
BEGIN
    NEW.fecha_actualizacion = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for 'fecha_actualizacion' in 'wp_carritos'
DROP TRIGGER IF EXISTS trg_wp_carritos_fecha_actualizacion ON "wp_carritos";
CREATE TRIGGER trg_wp_carritos_fecha_actualizacion
BEFORE UPDATE ON "wp_carritos"
FOR EACH ROW
EXECUTE FUNCTION update_fecha_actualizacion_carritos();


--
-- Table structure for table `wp_notificaciones`
-- (Depends on wp_prioridad)
--
DROP TABLE IF EXISTS "wp_notificaciones" CASCADE;
CREATE TABLE "wp_notificaciones" (
    "id" SERIAL PRIMARY KEY,
    "titulo" VARCHAR(255) NOT NULL,
    "descripcion" TEXT NOT NULL,
    "prioridad_id" INT NOT NULL,
    CONSTRAINT "fk_prioridad" FOREIGN KEY ("prioridad_id") REFERENCES "wp_prioridad" ("id")
);


--
-- Table structure for table `wp_productos`
-- (Depends on wp_categorias, wp_materiales, wp_proveedores)
--
DROP TABLE IF EXISTS "wp_productos" CASCADE;
CREATE TABLE "wp_productos" (
    "id" SERIAL PRIMARY KEY,
    "precio" DECIMAL(10,2) NOT NULL,
    "existencias" INT NOT NULL DEFAULT '0',
    "medidas" VARCHAR(100) NOT NULL,
    "imagen_url" VARCHAR(512) DEFAULT NULL,
    "categoria_id" INT NOT NULL,
    "proveedor_id" INT NOT NULL,
    "material_id" INT NOT NULL,
    CONSTRAINT "fk_categoria" FOREIGN KEY ("categoria_id") REFERENCES "wp_categorias" ("id"),
    CONSTRAINT "fk_material" FOREIGN KEY ("material_id") REFERENCES "wp_materiales" ("id"),
    CONSTRAINT "fk_proveedor" FOREIGN KEY ("proveedor_id") REFERENCES "wp_proveedores" ("id")
);
COMMENT ON TABLE "wp_productos" IS 'Imágenes como URLs de Imgur';


--
-- Table structure for table `wp_compras`
-- (Depends on wp_usuarios. Moved UP to be before wp_compra_items)
--
DROP TABLE IF EXISTS "wp_compras" CASCADE;
CREATE TABLE "wp_compras" (
    "id" SERIAL PRIMARY KEY,
    "usuario_cedula" INT NOT NULL,
    "fecha_compra" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "total" DECIMAL(10,2) NOT NULL,
    CONSTRAINT "fk_usuario_compra" FOREIGN KEY ("usuario_cedula") REFERENCES "wp_usuarios" ("cedula")
);


--
-- Table structure for table `wp_compra_items`
-- (Depends on wp_compras, wp_productos)
--
DROP TABLE IF EXISTS "wp_compra_items" CASCADE;
CREATE TABLE "wp_compra_items" (
    "compra_id" INT NOT NULL,
    "producto_id" INT NOT NULL,
    "cantidad" INT NOT NULL,
    "precio_unitario" DECIMAL(10,2) NOT NULL,
    PRIMARY KEY ("compra_id", "producto_id"),
    CONSTRAINT "fk_compra_item" FOREIGN KEY ("compra_id") REFERENCES "wp_compras" ("id"),
    CONSTRAINT "fk_producto_comprado" FOREIGN KEY ("producto_id") REFERENCES "wp_productos" ("id")
);


--
-- Table structure for table `wp_reportes`
-- (Depends on wp_usuarios)
--
DROP TABLE IF EXISTS "wp_reportes" CASCADE;
CREATE TABLE "wp_reportes" (
    "id" SERIAL PRIMARY KEY,
    "usuario_cedula" INT NOT NULL,
    "tipo" VARCHAR(50) NOT NULL,
    "detalles" TEXT NOT NULL,
    "imagen_url" VARCHAR(512) DEFAULT NULL,
    "fecha_reporte" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "fk_usuario_reporte" FOREIGN KEY ("usuario_cedula") REFERENCES "wp_usuarios" ("cedula")
);


--
-- Table structure for table `wp_rol_usuario`
-- (Depends on wp_usuarios, wp_roles)
--
DROP TABLE IF EXISTS "wp_rol_usuario" CASCADE;
CREATE TABLE "wp_rol_usuario" (
    "usuario_cedula" INT NOT NULL,
    "rol_id" INT NOT NULL,
    PRIMARY KEY ("usuario_cedula", "rol_id"),
    CONSTRAINT "fk_rol" FOREIGN KEY ("rol_id") REFERENCES "wp_roles" ("id"),
    CONSTRAINT "fk_usuario_rol" FOREIGN KEY ("usuario_cedula") REFERENCES "wp_usuarios" ("cedula")
);