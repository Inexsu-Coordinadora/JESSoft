import pkg from 'pg';
import { configuracion } from '../../../common/configuracion';

const { Pool } = pkg;

export const pool = new Pool({
  host: configuracion.db.host,
  port: configuracion.db.port,
  user: configuracion.db.user,
  password: configuracion.db.password,
  database: configuracion.db.database,
  ssl:
    configuracion.db.ssl ||
    {
      rejectUnauthorized: false, // necesario para conexiones en la nube
    },
});
