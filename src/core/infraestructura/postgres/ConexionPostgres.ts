import {Pool} from 'pg';
import { config } from '../../../common/configuracion';

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

<<<<<<< HEAD
 
=======

>>>>>>> 57092ed83eb8caa141f2c1b9181df62e2a509a5b
