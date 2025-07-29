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
          p.id,
          p.nombre,
          p.precio,
          p.descripcion,
          p.imagen_url,
          p.calificacion,
          p.veces_valorado,
          c.nombre as categoria
        from wp_guardados g
        join wp_productos p on g.producto_id = p.id
        join wp_categorias c on p.categoria_id = c.id
        where usuario_cedula = $1;
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

  static async insertar(input: any) {
    const client = await pool.connect();
    try {
      const query = `
        INSERT INTO wp_guardados (usuario_cedula, producto_id)
        VALUES ($1, $2);
        `;

      await client.query<any>(query, [input.cedula, input.producto_id]);
    } catch (error) {
      console.error('Error en getRoles:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  static async eliminar(input: any) {
    const client = await pool.connect();
    try {
      const query = `
        delete from wp_guardados where usuario_cedula = $1 and producto_id = $2;
        `;

      await client.query<any>(query, [input.cedula, input.producto_id]);
    } catch (error) {
      console.error('Error en getRoles:', error);
      throw error;
    } finally {
      client.release();
    }
  }
}
