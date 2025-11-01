import { Pool } from 'pg';
import { configuracion } from '../../../common/configuracion';

export const pool = new Pool({
  host: configuracion.db.host,
  port: configuracion.db.port,
  user: configuracion.db.user,
  password: configuracion.db.password,
  database: configuracion.db.database,
  ssl: { rejectUnauthorized: false },
});