import { FastifyInstance } from 'fastify';
import { DocenteEnrutador } from './rutas/DocenteEnrutador';

export async function registrarRutas(app: FastifyInstance) {
  await app.register(DocenteEnrutador);
}
