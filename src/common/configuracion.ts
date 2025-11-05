import 'dotenv/config';

export const configuracion = {
  db: {
    host: process.env.PGHOST!,
    port: Number(process.env.PGPORT || 3000),
    user: process.env.PGUSER!,
    password: process.env.PGPASSWORD!,
    database: process.env.PGDBNAME!,
    ssl: process.env.PGSSLMODE === 'require'
      ? { rejectUnauthorized: false }
      : false,
  },
  port: Number(process.env.PORT || process.env.PUERTO || 3000)
};