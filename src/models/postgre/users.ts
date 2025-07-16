import { Pool } from 'pg';
import bcrypt from 'bcryptjs';

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

async function comparePassword(password: string, storedHash: string): Promise<boolean> {
  try {
    const isMatch = await bcrypt.compare(password, storedHash);
    return isMatch;
  } catch (error) {
    return false;
  }
}

export class UserModel {

  static disconnect(connection: any) {
    connection.end(function (err: any) {
      if (err) throw err;
      console.log("Conexión cerrada");
    })
  }


  static async getUser(input: any) {
    const client = await pool.connect();
    try {
      const query = `
        SELECT cedula, credencial, nombres, nombre_usuario, localidad, correo, imagen_url
        FROM wp_usuarios
        WHERE correo = TRIM($1);
      `;

      const result = await client.query<any>(query, [input.correo])
      const user = result.rows[0];
      const validatePassword = await comparePassword(input.credencial, user.credencial);
      if (validatePassword) {
        delete user.credencial;
        return user;
      }
      return null
    } catch (error) {
      console.error('Error en getUser:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  static async refreshUser(input: any) {
    const client = await pool.connect();

    try {
      const query = `
        SELECT nombres, nombre_usuario, localidad, correo, imagen_url
        FROM users
        WHERE cedula = $1;
      `;

      const result = await client.query<any>(query, [input.cedula]);

      if (result.rows.length === 0) return null;
      return result.rows[0];
    } catch (error) {
      console.error('Error en refreshUser:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  static async register(input: any) {
    const SALT_ROUNDS = 5;
    const client = await pool.connect();
    try {
      const verifyResult = await client.query('SELECT * FROM "wp_usuarios" WHERE cedula = $1', [input.cedula]);
      if (verifyResult.rows.length > 0) { return null; }

      const insertQuery = `
        INSERT INTO "wp_usuarios" (cedula, nombres, nombre_usuario, credencial, correo)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING cedula, nombres, nombre_usuario, correo;
      `;

      try {
        const hashedPassword = await bcrypt.hash(input.credencial, SALT_ROUNDS);
        const insertResult = await client.query<any>(insertQuery, [
          input.cedula,
          input.nombres,
          input.nombre_usuario,
          hashedPassword,
          input.correo
        ]);

        return insertResult.rows[0];
      } catch (hashError) {
        console.error('Error hashing password:', hashError);
        throw new Error('Password hashing failed');
      }

    } catch (error) {
      console.error('Error en register:', error);
      throw new Error('Error creating user');
    } finally {
      client.release();
    }
  }

  static async update(input: any) {
    const client = await pool.connect();

    try {
      const updateQuery = `
        UPDATE "wp_usuarios"
        SET nombres = $1,
            nombre_usuario = $2,
            localidad = $3,
            correo = $4
        WHERE cedula = $5
        RETURNING cedula, nombres, nombre_usuario, localidad, correo;
      `;

      const updateResult = await client.query<any>(updateQuery, [
        input.nombres,
        input.nombre_usuario,
        input.localidad,
        input.correo,
        input.cedula
      ]);

      if (updateResult.rows.length === 0) return null;
      return updateResult.rows[0];
    } catch (error) {
      console.error('Error en update:', error);
      throw new Error('Error updating user');
    } finally {
      client.release();
    }
  }

  static async updateMovil(input: any) {
    const client = await pool.connect();

    try {
      const updateQuery = `
        UPDATE "wp_usuarios"
        SET telefono = $1,
            cedula = $2,
            banco_num = $3
        WHERE cedula = $2
        RETURNING cedula, telefono, banco_num;
      `;

      const updateResult = await client.query<any>(updateQuery, [
        input.telefono,
        input.cedula,
        input.banco_num
      ]);

      if (updateResult.rows.length === 0) return null;
      return updateResult.rows[0];
    } catch (error) {
      console.error('Error en update:', error);
      throw new Error('Error updating user');
    } finally {
      client.release();
    }
  }

  static async delete({ id }: { id: string }) {
    const client = await pool.connect();

    try {
      const deleteQuery = 'DELETE FROM users WHERE id::text = $1 RETURNING id::text;';
      const deleteResult = await client.query(deleteQuery, [id]);

      if (deleteResult.rows.length === 0) return false;
      return true;
    } catch (error) {
      console.error('Error en delete:', error);
      throw new Error('Error deleting user');
    } finally {
      client.release();
    }
  }

  static async getMovil(cedula: string) {
    const client = await pool.connect();
    try {
      const query = `
        SELECT telefono, banco_num
        FROM wp_usuarios
        WHERE cedula = $1;`;

      const result = await client.query<any>(query, [cedula])
      return result.rows[0];
    } catch (error) {
      console.error('Error en getUser:', error);
      throw error;
    } finally {
      client.release();
    }
  }
}
