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
          u.nombres,
          c.fecha_compra,
          c.total,
          c.total_bolivares,
          COALESCE(
            json_agg(
              json_build_object(
                'nombre', p.nombre,
                'precio', p.precio,
                'cantidad', ci.cantidad
              )
              ORDER BY p.nombre
            ) FILTER (WHERE p.nombre IS NOT NULL),
            '[]'::json
          ) as productos
        from wp_compras c
        join wp_compra_items ci on c.id = ci.compra_id
        join wp_productos p on ci.producto_id = p.id
        join wp_usuarios u on c.usuario_cedula = u.cedula
        group by c.id, u.nombres, c.fecha_compra, c.total
        order by c.fecha_compra desc;
        `;

      const result = await client.query<any>(query)
      return result.rows;
    } catch (error) {
      console.error('Error en getRoles:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  static async getVentasByCedula(input: any) {
    const client = await pool.connect();
    try {
      const query = `
        select
          c.id,
          u.nombres,
          c.fecha_compra,
          c.total,
          c.total_bolivares,
          COALESCE(
            json_agg(
              json_build_object(
                'nombre', p.nombre,
                'precio', p.precio,
                'cantidad', ci.cantidad
              )
              ORDER BY p.nombre
            ) FILTER (WHERE p.nombre IS NOT NULL),
            '[]'::json
          ) as productos
        from wp_compras c
        join wp_compra_items ci on c.id = ci.compra_id
        join wp_productos p on ci.producto_id = p.id
        join wp_usuarios u on c.usuario_cedula = u.cedula
        where u.cedula = $1
        group by c.id, u.nombres, c.fecha_compra, c.total
        order by c.fecha_compra desc;
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

  static async insertar(input: any) {
    const client = await pool.connect();
    try {
      const query = `
      WITH set_compras AS (
        INSERT INTO wp_compras (usuario_cedula, total, total_bolivares, dolar)
        VALUES ($1, $2, $3, $4)
        RETURNING id
      )
      INSERT INTO wp_compra_items (compra_id, producto_id, cantidad)
      SELECT c.id, unnest($5::integer[]), unnest($6::integer[])
      FROM set_compras c;
        `;

      await client.query<any>(query, [
        input.cedula,
        input.total,
        input.total_bolivares,
        input.dolar,
        input.productos.map((p: any) => p.id),
        input.productos.map((p: any) => p.cantidad)
      ])

    } catch (error) {
      console.error('Error en getRoles:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  static async analiticas() {
    const client = await pool.connect();
    try {

      const ventasMes = await client.query<any>(`
      SELECT COUNT(*) AS ventas_este_mes
      FROM wp_compras
      WHERE
        fecha_compra >= DATE_TRUNC('month', CURRENT_DATE)
        AND fecha_compra < DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month';
        `);

      const pedidosSemana = await client.query<any>(`
      SELECT COUNT(*) AS pedidos_ultima_semana
      FROM wp_pedido
      WHERE
        fecha_creacion >= CURRENT_DATE - INTERVAL '7 days'
        AND fecha_creacion < CURRENT_DATE + INTERVAL '1 day';
        `);

    } catch (error) {
      console.error('Error en getRoles:', error);
      throw error;
    } finally {
      client.release();
    }
  }
}