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

export class PedidoModel {

  static disconnect(connection: any) {
    connection.end(function (err: any) {
      if (err) throw err;
      console.log("Conexión cerrada");
    })
  }

  static async index() {
    const client = await pool.connect();
    try {
      const query = `
      SELECT;`;

      const result = await client.query<any>(query)
      return result.rows;
    } catch (error) {
      console.error('Error en getRoles:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  static async getByCedula(input: any) {
    const client = await pool.connect();
    try {
      const query = `
      select
        p.usuario_cedula,
        p.nombre,
        p.descripcion,
        p.cantidad,
        pr.nombre,
        ca.nombre,
        p.fecha_cita,
        p.fecha_creacion
      from wp_pedido p
      join wp_categorias ca on p.categoria_id = ca.id
      join wp_prioridad pr on p.prioridad_id = pr.id
      where p.usuario_cedula = $1;
      `;

      const result = await client.query<any>(query, [input.cedula])
      return result.rows;
    } catch (error) {
      console.error('Error en getRoles:', error);
      throw error;
    } finally {
      client.release();
    }
  }

}
