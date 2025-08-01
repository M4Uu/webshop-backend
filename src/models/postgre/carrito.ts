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
          p.id,
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
      console.error('Error en index carrito:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  static async insertar(input: any) {
    const client = await pool.connect();
    try {
      const query = `
      INSERT INTO wp_carritos
        (usuario_cedula, id_producto, cantidad)
      VALUES ($1,$2,1);
      `;

      await client.query<any>(query, [input.cedula, input.id_producto]);
    } catch (error) {
      console.error('Error en insertar carrito:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  static async eliminar(input: any) {
    const client = await pool.connect();
    try {
      const query = `
      delete from wp_carritos where usuario_cedula = $1 and id_producto = $2
      `;

      await client.query<any>(query, [input.cedula, input.id_producto]);
    } catch (error) {
      console.error('Error en eliminar carrito:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  static async disminuirCantidad(input: any) {
    const client = await pool.connect();
    try {
      const query = `
      update wp_carritos set cantidad = cantidad - 1 where usuario_cedula = $1 and id_producto = $2;
      `;

      await client.query<any>(query, [input.cedula, input.id_producto]);
    } catch (error) {
      console.error('Error en disminuir cantidad:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  static async aumentarCantidad(input: any) {
    const client = await pool.connect();
    try {
      const query = `
      update wp_carritos set cantidad = cantidad + 1 where usuario_cedula = $1 and id_producto = $2;
      `;

      await client.query<any>(query, [input.cedula, input.id_producto]);
    } catch (error) {
      console.error('Error en aumentar cantidad:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  static async vendido(input: any) {
    const client = await pool.connect();
    try {
      const query = `
      WITH carrito_delete AS (
        DELETE FROM wp_carritos WHERE usuario_cedula = $1
      )
      UPDATE wp_productos p
      SET existencias = existencias - g.cantidad
      FROM (
        SELECT
          unnest($2::integer[]) AS producto_id,
          unnest($3::integer[]) AS cantidad
      ) g
      WHERE p.id = g.producto_id;
      `;

      await client.query<any>(query, [
        input.cedula,
        input.productos.map((p: any) => p.id),
        input.productos.map((p: any) => p.cantidad)
      ]);
    } catch (error) {
      console.error('Error en aumentar cantidad:', error);
      throw error;
    } finally {
      client.release();
    }
  }


}


