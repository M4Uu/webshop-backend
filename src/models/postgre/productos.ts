import { Pool } from 'pg';

export const dbConfig = {
  connectionString: process.env['DB_STRING'],
  ssl: { rejectUnauthorized: false }
};

const pool = new Pool(dbConfig);

export async function testConnection() {
  try {
    const client = await pool.connect();
    console.log('Conexión exitosa a PostgreSQL');
    client.release();
    return true;
  } catch (error) {
    console.error('Error de conexión:', error);
    return false;
  }
}

export class ProductosModel {

  static disconnect(connection: any) {
    connection.end(function (err: any) {
      if (err) throw err;
      console.log("Conexión cerrada");
    })
  }


  static async index() {
    const client = await pool.connect();
    try {
      const query = `select
        p.id,
        p.nombre,
        p.precio,
        p.existencias,
        p.calificacion,
        p.veces_valorado
      from wp_productos p;`;

      const result = await client.query<any>(query)
      return result.rows;
    } catch (error) {
      console.error('Error en consulta:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  static async catalogo(input: any) {
    const client = await pool.connect();
    try {
      const query = `
      SELECT
        p.id,
        p.nombre,
        p.precio,
        p.descripcion,
        p.calificacion,
        p.veces_valorado,
        p.imagen_url,
        c.nombre AS categoria,
        EXISTS (
          SELECT 1
          FROM wp_carritos ca
          WHERE ca.id_producto = p.id and ca.usuario_cedula = $1
        ) AS en_carrito,
        EXISTS (
          SELECT 1
          FROM wp_guardados g
          WHERE g.producto_id = p.id and g.usuario_cedula = $1
        ) AS en_guardados
      FROM wp_productos p
      JOIN wp_categorias c ON c.id = p.categoria_id
      WHERE p.existencias > 0;
      `;

      const result = await client.query<any>(query, [input.cedula])
      return result.rows;
    } catch (error) {
      console.error('Error en consulta:', error);
      throw error;
    } finally {
      client.release();
    }
  }



  static async getProductoById(input: any) {
    const client = await pool.connect();
    try {
      const query = `
      select p.*, c.nombre as categoria_nombre,
      EXISTS (
          SELECT 1
          FROM wp_carritos ca
          WHERE ca.id_producto = p.id and ca.usuario_cedula = $1
        ) AS en_carrito,
        EXISTS (
          SELECT 1
          FROM wp_guardados g
          WHERE g.producto_id = p.id and g.usuario_cedula = $1
        ) AS en_guardados
      from wp_productos p
      join wp_categorias c on c.id = p.categoria_id
      where p.id = $2;
      `;

      const result = await client.query<any>(query, [input.cedula, input.producto_id])
      return result.rows[0];
    } catch (error) {
      console.error('Error en consulta:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  static async create(input: any) {
    const client = await pool.connect();
    try {
      const query = `
      insert into wp_productos
        (nombre, descripcion, precio, existencias, calificacion, imagen_url, categoria_id)
        values ($1, $2, $3, $4, $5, $6, $7);`;

      const result = await client.query<any>(query, [
        input.nombre,
        input.descripcion,
        input.precio,
        input.existencias,
        input.calificacion,
        input.imagen_url,
        input.categoria_id,
      ])
      return result.rows;
    } catch (error) {
      console.error('Error al crear producto:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  static async update(input: any) {
    const client = await pool.connect();
    try {
      const query = `
      update wp_productos
        set
          nombre = $2,
          descripcion = $3,
          precio = $4,
          existencias = $5,
          imagen_url = $7,
          categoria_id = $8
        where id = $1;`;

      const result = await client.query<any>(query, [
        input.id,
        input.nombre,
        input.descripcion,
        input.precio,
        input.existencias,
        input.imagen_url,
        input.categoria_id,
      ])
      return result.rows;
    } catch (error) {
      console.error('Error en actualizar:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  static async calificacion(input: any) {
    const client = await pool.connect();
    try {
      const query = `
      update wp_productos
        set
          calificacion = calificacion +$2,
          veces_valorado = veces_valorado +1
        where id = $1;`;

      await client.query<any>(query, [input.calificacion])
    } catch (error) {
      console.error('Error en actualizar:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  // TODO: Crear Endpoint "inhabilitar", el cual consistirá en colocar el stock/existencias del producto en 0
}
