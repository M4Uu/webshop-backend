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
      const query = `select id, nombre, precio, existencias, calificacion from wp_productos;`;

      const result = await client.query<any>(query)
      return result.rows;
    } catch (error) {
      console.error('Error en getRoles:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  static async getProductoById(id: any) {
    const client = await pool.connect();
    try {
      const query = `select * from wp_productos where id = $1;`;

      const result = await client.query<any>(query, [id])
      return result.rows;
    } catch (error) {
      console.error('Error en getRoles:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  static async update(input: any) {
    const client = await pool.connect();
    try {
      const query = `update wp_productos set image_url = $1 where id = $2;`;

      const result = await client.query<any>(query, [
        input.image_url,
        input.id
      ])
      return result.rows;
    } catch (error) {
      console.error('Error en getRoles:', error);
      throw error;
    } finally {
      client.release();
    }
  }
}
