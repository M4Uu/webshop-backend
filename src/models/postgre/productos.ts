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
      console.error('Error en consulta:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  static async catalogo() {
    const client = await pool.connect();
    try {
      const query = `
      select p.id, p.nombre, p.precio, p.descripcion, p.imagen_url, c.nombre as categoria
      from wp_productos p
      join wp_categorias c on c.id = p.categoria_id;`;

      const result = await client.query<any>(query)
      return result.rows;
    } catch (error) {
      console.error('Error en consulta:', error);
      throw error;
    } finally {
      client.release();
    }
  }



  static async getProductoById(id: any) {
    const client = await pool.connect();
    try {
      const query = `
      select p.*, c.nombre as categoria_nombre
      from wp_productos p
      join wp_categorias c on c.id = p.categoria_id
      where p.id = $1;
      `;

      const result = await client.query<any>(query, [id])
      return result.rows;
    } catch (error) {
      console.error('Error en consulta:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  static async create(input: any) {
    const client = await pool.connect();
    try {
      const query = `
      insert into wp_productos
        (nombre, descripcion, precio, existencias, calificacion, imagen_url, categoria_id)
        values ($1, $2, $3, $4, $5, $6, $7);`;

      const result = await client.query<any>(query, [
        input.nombre,
        input.descripcion,
        input.precio,
        input.existencias,
        input.calificacion,
        input.imagen_url,
        input.categoria_id,
      ])
      return result.rows;
    } catch (error) {
      console.error('Error al crear producto:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  static async update(input: any) {
    const client = await pool.connect();
    try {
      const query = `
      update wp_productos
        set
          nombre = $2,
          descripcion = $3,
          precio = $4,
          existencias = $5,
          calificacion = $6,
          imagen_url = $7,
          categoria_id = $8
        where id = $1;`;

      const result = await client.query<any>(query, [
        input.id,
        input.nombre,
        input.descripcion,
        input.precio,
        input.existencias,
        input.calificacion,
        input.imagen_url,
        input.categoria_id,
      ])
      return result.rows;
    } catch (error) {
      console.error('Error en actualizar:', error);
      throw error;
    } finally {
      client.release();
    }
  }
}
