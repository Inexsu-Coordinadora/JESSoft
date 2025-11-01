import { FastifyInstance } from 'fastify';
import { DocenteControlador } from '../controladores/DocenteControlador';

export async function DocenteEnrutador(app: FastifyInstance) {
  app.get('/docentes', DocenteControlador.listar);
}
