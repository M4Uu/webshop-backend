import { Pool } from 'pg';
import { dbConfig } from '../../interface/db';

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
          u.localidad,
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
        group by c.id, u.nombres, u.localidad, c.fecha_compra, c.total
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
          u.localidad,
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
        group by c.id, u.nombres, u.localidad, c.fecha_compra, c.total
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

      const result = await client.query<any>(`
      SELECT
        -- Ventas por mes en todo el año actual (array de meses y array de conteos)
        (
            SELECT array_agg(TO_CHAR(mes, 'YYYY-MM')) 
            FROM generate_series(
                DATE_TRUNC('year', CURRENT_DATE),
                DATE_TRUNC('year', CURRENT_DATE) + INTERVAL '1 year' - INTERVAL '1 month',
                INTERVAL '1 month'
            ) AS mes
        ) AS meses_del_anio,
        
        (
            SELECT array_agg(COALESCE(ventas_count, 0))
            FROM generate_series(
                DATE_TRUNC('year', CURRENT_DATE),
                DATE_TRUNC('year', CURRENT_DATE) + INTERVAL '1 year' - INTERVAL '1 month',
                INTERVAL '1 month'
            ) AS mes
            LEFT JOIN (
                SELECT 
                    DATE_TRUNC('month', fecha_compra) AS mes_venta,
                    COUNT(*) AS ventas_count
                FROM wp_compras
                WHERE fecha_compra >= DATE_TRUNC('year', CURRENT_DATE)
                GROUP BY mes_venta
            ) v ON mes = v.mes_venta
        ) AS ventas_por_mes,
        
        -- Pedidos por mes en todo el año actual
        (
            SELECT array_agg(COALESCE(pedidos_count, 0))
            FROM generate_series(
                DATE_TRUNC('year', CURRENT_DATE),
                DATE_TRUNC('year', CURRENT_DATE) + INTERVAL '1 year' - INTERVAL '1 month',
                INTERVAL '1 month'
            ) AS mes
            LEFT JOIN (
                SELECT 
                    DATE_TRUNC('month', fecha_creacion) AS mes_pedido,
                    COUNT(*) AS pedidos_count
                FROM wp_pedido
                WHERE fecha_creacion >= DATE_TRUNC('year', CURRENT_DATE)
                GROUP BY mes_pedido
            ) p ON mes = p.mes_pedido
        ) AS pedidos_por_mes,
        
        -- Pedidos de esta semana
        (
          SELECT COUNT(*)
          FROM wp_pedido
          WHERE fecha_creacion >= CURRENT_DATE - INTERVAL '7 days'
          AND fecha_creacion < CURRENT_DATE + INTERVAL '1 day'
        ) AS pedidos_ultima_semana,
        
        -- Ventas de este mes
        (
          SELECT COUNT(*) AS ventas_este_mes
          FROM wp_compras
          WHERE
            fecha_compra >= DATE_TRUNC('month', CURRENT_DATE)
            AND fecha_compra < DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month'
        ) as ventas_ultimo_mes;
        `);

      return result.rows[0];
    } catch (error) {
      console.error('Error en getRoles:', error);
      throw error;
    } finally {
      client.release();
    }
  }
}