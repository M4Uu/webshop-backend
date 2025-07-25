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

export class CarritoModel {

  static disconnect(connection: any) {
    connection.end(function (err: any) {
      if (err) throw err;
      console.log("Conexión cerrada");
    })
  }


  static async index(input: any) {
    const client = await pool.connect();
    try {
      const query = `
        select
          p.nombre,
          p.precio,
          p.existencias,
          p.imagen_url,
          c.cantidad,
          c.fecha_creacion
        from
          wp_productos p
          join wp_carritos c on p.id = c.id_producto
        where
          c.usuario_cedula = $1;
        `;

      const result = await client.query<any>(query, [input.cedula]);
      return result.rows;
    } catch (error) {
      console.error('Error en getRoles:', error);
      throw error;
    } finally {
      client.release();
    }
  }
}
