import { Pool } from 'pg';
import { UserData } from '../../interface/users';
import { ThesisHasher } from 'middleware/cryptohash';
// import bcrypt from 'bcryptjs';


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

// async function comparePassword(password: string, storedHash: string): Promise<boolean> {
//   try {
//     const isMatch = await bcrypt.compare(password, storedHash);
//     return isMatch;
//   } catch (error) {
//     console.error("Error al comparar contraseñas:", error);
//     throw new Error("No se pudo comparar la contraseña.");
//   }
// }


export class UserModel {

  static disconnect(connection: any) {
    connection.end(function (err: any) {
      if (err) throw err;
      console.log("Conexión cerrada");
    })
  }


  static async getUser(input: any) {
    console.log(process.env['DB_STRING'])
    const client = await pool.connect();
    try {
      const query = `
        SELECT cedula, password, nombres, nombre_usuario, localidad, correo, imagen_url
        FROM "wp_usuarios"
        WHERE correo = $1;
      `;

      const result = (await client.query<any>(query, [input.correo]))
      const user = result.rows[0];
      // const validatePassword = await comparePassword(input.password, user.password);
      const validatePassword = ThesisHasher.verifyHash(input.password, user.password);
      if (validatePassword) {
        delete user.password;
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
        SELECT cedula, nombres, nombre_usuario, localidad, correo, imagen_url
        FROM users
        WHERE cedula = $1;
      `;

      const result = await client.query<UserData>(query, [input.cedula]);

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
    // const SALT_ROUNDS = 4;
    const client = await pool.connect();
    try {
      const verifyResult = await client.query('SELECT * FROM "wp_usuarios" WHERE cedula = $1', [input.cedula]);
      if (verifyResult.rows.length > 0) { return null; }

      const insertQuery = `
        INSERT INTO "wp_usuarios" (cedula, nombres, nombre_usuario, password, localidad, correo, imagen_url)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING cedula, nombres, nombre_usuario, correo;
      `;

      try {
        // const hashedPassword = await bcrypt.hash(input.password, SALT_ROUNDS);
        const hashedPassword = ThesisHasher.createHash(input.password);

        const insertResult = await client.query<any>(insertQuery, [
          input.cedula,
          input.nombres,
          input.nombre_usuario,
          hashedPassword,
          input.localidad,
          input.correo,
          input.imagen_url
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

  static async upload({ input }: {
    input: {
      user_id: string;
      user_name: string;
      email_address: string;
      first_name: string;
      last_name: string;
      pswd: string;
    }
  }) {
    const client = await pool.connect();

    try {
      const { user_id, user_name, email_address, first_name, last_name, pswd } = input;

      const updateQuery = `
        UPDATE users
        SET user_name = $1,
            email_address = $2,
            first_name = $3,
            last_name = $4,
            pswd = $5
        WHERE id::text = $6
        RETURNING id::text, user_name, email_address, first_name, last_name, pswd, created_ad;
      `;

      const updateResult = await client.query<UserData>(updateQuery, [
        user_name,
        email_address,
        first_name,
        last_name,
        pswd,
        user_id
      ]);

      if (updateResult.rows.length === 0) return null;
      return updateResult.rows[0];
    } catch (error) {
      console.error('Error en upload:', error);
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
}
