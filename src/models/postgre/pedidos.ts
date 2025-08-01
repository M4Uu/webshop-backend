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
      SELECT
        p.id,
        p.nombre,
        pr.nombre as prioridad,
        COALESCE(TO_CHAR(p.fecha_cita, 'YYYY-MM-DD'), 'Sin asignar') AS fecha_cita,
        p.fecha_creacion
        from wp_pedido p
        join wp_prioridad pr on p.prioridad_id = pr.id;`;

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
        p.id,
        p.nombre,
        pr.id as prioridad_id,
        pr.nombre as prioridad,
        p.categoria_id,
        COALESCE(TO_CHAR(p.fecha_cita, 'YYYY-MM-DD'), 'Sin asignar') AS fecha_cita,
        p.fecha_creacion
      from wp_pedido p
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

  static async getPrioridad() {
    const client = await pool.connect();
    try {
      const query = `
      select
        id as code,
        nombre as name
      from wp_prioridad;
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


  static async getById(input: any) {
    const client = await pool.connect();
    try {
      const query = `
      select
        p.nombre,
        p.cantidad,
        p.descripcion,
        pr.id as prioridad_id,
        p.categoria_id,
        p.fecha_cita,
        p.fecha_creacion
      from wp_pedido p
      join wp_prioridad pr on p.prioridad_id = pr.id
      where p.id = $1;
      `;

      const result = await client.query<any>(query, [input.pedido_id])
      return result.rows[0];
    } catch (error) {
      console.error('Error en getRoles:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  static async create(input: any) {
    const client = await pool.connect();
    try {
      const query = `
      INSERT INTO wp_pedido (
        usuario_cedula,
        nombre,
        descripcion,
        cantidad,
        prioridad_id,
        fecha_cita,
        categoria_id
      ) VALUES ($1, $2, $3, $4, 6, null, $5)
      RETURNING
        id,
        nombre,
        'En espera' as prioridad,
        COALESCE(TO_CHAR(fecha_cita, 'YYYY-MM-DD'), 'Sin asignar') AS fecha_cita,
        fecha_creacion;
      `;

      const result = await client.query<any>(query, [
        input.cedula,
        input.nombre,
        input.descripcion,
        input.cantidad,
        input.categoria_id
      ]);
      return result.rows[0]

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
      const query = `
      update wp_pedido set
        nombre = $2,
        descripcion = $3,
        cantidad = $4,
        categoria_id = $5
        where id = $1;
      `;

      await client.query<any>(query, [
        input.id,
        input.nombre,
        input.descripcion,
        input.cantidad,
        input.categoria_id
      ]);

    } catch (error) {
      console.error('Error en getRoles:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  static async updateAdmin(input: any) {
    const client = await pool.connect();
    try {
      const query = `
      UPDATE wp_pedido
      SET
        prioridad_id = $2,
        fecha_cita = $3
      WHERE
        id = $1
      RETURNING
        id,
        nombre,
        (SELECT p.nombre FROM wp_prioridad p WHERE p.id = wp_pedido.prioridad_id) AS prioridad,
        COALESCE(TO_CHAR(fecha_cita, 'YYYY-MM-DD'), 'Sin asignar') AS fecha_cita,
        fecha_creacion;
      `;

      const result = await client.query<any>(query, [
        input.pedido_id,
        input.prioridad.code,
        input.fecha_cita,
      ]);

      return result.rows[0];

    } catch (error) {
      console.error('Error en getRoles:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  static async delete(input: any) {
    const client = await pool.connect();
    try {
      const query = `
      delete from wp_pedido where id = $1
      `;

      await client.query<any>(query, [input.pedido_id]);

    } catch (error) {
      console.error('Error en getRoles:', error);
      throw error;
    } finally {
      client.release();
    }
  }
}
