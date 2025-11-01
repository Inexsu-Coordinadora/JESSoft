import 'dotenv/config';

export const configuracion = {
  db: {
    host: process.env.PGHOST!,
    port: Number(process.env.PGPORT!),
    user: process.env.PGUSER!,
    password: process.env.PGPASSWORD!,
    database: process.env.PGDBNAME!,
  },
  port: Number(process.env.PORT ?? 3000),
};