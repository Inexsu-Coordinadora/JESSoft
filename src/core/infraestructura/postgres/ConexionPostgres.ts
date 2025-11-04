import {Pool} from 'pg';
import { config } from '../../../common/configuracion.js';
export const pool = new Pool(config.pg)
pool.connect()
  .then(() => console.log('Conectado a la base de datos:', config.pg.database))
  .catch(err => console.error(' Error de conexión:', err.message));

export async function ejecutarConsulta(
  consulta: string,
  parametros?: Array<number | string>
) {
  return await pool.query(consulta, parametros);
}

 
