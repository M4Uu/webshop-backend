// Config Producción
export const dbConfig = {
  connectionString: process.env['DB_STRING'],
  ssl: { rejectUnauthorized: false }
};

// Config Local
// export const dbConfig = {
//   user: 'postgres',
//   host: 'localhost',
//   database: 'local_webshop_db',
//   password: '1234',
//   port: 5432,
//   ssl: false,
// }
