import { Pool } from 'pg';
import { dbConfig } from '../../interface/db';
import bcrypt from 'bcryptjs';

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


  static async login(input: any) {
    const client = await pool.connect();
    try {
      const query = `
        SELECT cedula, credencial, nombres, nombre_usuario, localidad, correo, imagen_url, estado
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

  static async getUsers() {
    const client = await pool.connect();
    try {
      const query =
        `SELECT
          u.cedula,
          u.nombres,
          u.fecha_creacion,
          u.imagen_url,
          u.estado,
          COALESCE(
            json_agg(
              json_build_object('nombre', r.nombre)
            ) FILTER (WHERE r.nombre IS NOT NULL),
            '[]'::json
          ) AS roles
        FROM
          wp_usuarios u
        LEFT JOIN wp_rol_usuario ru ON u.cedula = ru.usuario_cedula
        LEFT JOIN wp_roles r ON ru.rol_id = r.id
        GROUP BY u.cedula, u.nombres, u.fecha_creacion, u.imagen_url;`;

      const result = await client.query<any>(query)
      const user = result.rows;

      if (!user) return null;
      return user;
    } catch (error) {
      console.error('Error en getUserByCedula:', error);
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
        try {
          const verifyResult = await client.query('insert into "wp_rol_usuario" (usuario_cedula, rol_id) values ($1, $2); ', [input.cedula, 1]);
          console.log('Error al insertar roles al usuario:', verifyResult);
        } catch (reason) {
          console.log('Error en query "Insertar roles": ', reason);
          return;
        }

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
            correo = $4,
            imagen_url = $5
        WHERE cedula = $6
        RETURNING cedula, nombres, nombre_usuario, localidad, correo;
      `;

      const updateResult = await client.query<any>(updateQuery, [
        input.nombres,
        input.nombre_usuario,
        input.localidad,
        input.correo,
        input.imagen_url,
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

  static async getRoles(cedula: string) {
    const client = await pool.connect();
    try {
      const query = `
        SELECT
          r.id AS rol_id,
          r.nombre AS rol_nombre
        FROM
          wp_rol_usuario ru
          JOIN wp_roles r ON ru.rol_id = r.id
        WHERE
          ru.usuario_cedula = $1;`;

      const result = await client.query<any>(query, [cedula])
      return result.rows;
    } catch (error) {
      console.error('Error en getRoles:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  static async toggleAdmin(cedula: string) {
    const client = await pool.connect();
    try {
      const isAdmin = await client.query<any>(
        'select count(*) as count from wp_rol_usuario where usuario_cedula = $1 and rol_id = 2',
        [cedula]
      );
      const count = parseInt(isAdmin.rows[0].count, 10);

      if (count > 0) {
        await client.query('DELETE FROM wp_rol_usuario WHERE usuario_cedula = $1 AND rol_id = 2', [cedula]);
      } else {
        await client.query('INSERT INTO wp_rol_usuario (usuario_cedula, rol_id) VALUES ($1, 2)', [cedula]);
      }

      return {
        message: count > 0 ? 'Rol de administrador eliminado' : 'Rol de administrador agregado',
        status: count > 0
      };
    } catch (error) {
      console.error('Error en getRoles:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  static async toggleStatus(cedula: string) {
    const client = await pool.connect();
    try {
      const statusUser = await client.query<any>(
        'select count(*) as count from wp_usuarios where cedula = $1 and estado = true',
        [cedula]
      );
      const count = parseInt(statusUser.rows[0].count, 10);

      if (count > 0) {
        await client.query('update wp_usuarios set estado = false where cedula = $1', [cedula]);
      } else {
        await client.query('update wp_usuarios set estado = true where cedula = $1', [cedula]);
      }

      return {
        message: count > 0 ? 'Usuario desactivado' : 'Usuario activado',
        status: count <= 0
      };
    } catch (error) {
      console.error('Error en getRoles:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  static async isActive(cedula: string) {
    const client = await pool.connect();
    try {
      const statusUser = await client.query<any>(
        'select count(*) as count from wp_usuarios where cedula = $1 and estado = true',
        [cedula]
      );
      const count = parseInt(statusUser.rows[0].count, 10);
      if (count > 0) {
        return {
          message: 'Usuario activo',
          status: true
        }
      } else {
        return {
          message: 'Usuario inactivo',
          status: false
        }
      }
    } catch (error) {
      console.error('Error en getRoles:', error);
      throw error;
    } finally {
      client.release();
    }
  }



}
