import {Pool} from 'pg';
import { configuracion } from '../../../common/configuracion';
export const pool = new Pool(configuracion.db);
pool.connect()
  .then(() => console.log('Conectado a la base de datos:', configuracion.db.database))
  .catch(err => console.error(' Error de conexión:', err.message));

export async function ejecutarConsulta(
  consulta: string,
  parametros?: Array<number | string>
) {
  return await pool.query(consulta, parametros);
}
