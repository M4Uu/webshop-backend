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

export class GuardadosModel {

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
          g.fecha_guardado,
          p.nombre,
          p.precio,
          p.descripcion,
          p.imagen_url
        from wp_guardados g
        join wp_productos p on g.producto_id = p.id
        where usuario_cedula = $1
        order by g.fecha_guardado desc;
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
