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

export class VentasModel {

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
        select
          c.id,
          c.usuario_cedula,
          c.fecha_compra,
          c.total,
          COALESCE(
            json_agg(
              json_build_object(
                'nombre', p.nombre,
                'precio', p.precio,
                'cantidad', ci.cantidad
                )
            ),
            '[]'::json
          ) productos
        from wp_compras c
        join wp_compra_items ci on c.id = ci.compra_id
        join wp_productos p on ci.producto_id = p.id
        group by c.id, c.usuario_cedula, c.fecha_compra, c.total;`;

      const result = await client.query<any>(query)
      return result.rows;
    } catch (error) {
      console.error('Error en getRoles:', error);
      throw error;
    } finally {
      client.release();
    }
  }
}
