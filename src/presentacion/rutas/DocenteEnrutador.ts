import { FastifyInstance } from 'fastify';
import { DocenteControlador } from '../controladores/DocenteControlador';

export async function DocenteEnrutador(app: FastifyInstance) {
  app.get('/docentes', DocenteControlador.listar);
  app.get('/docentes/:id', DocenteControlador.obtenerPorId);
  app.post('/docentes', DocenteControlador.crear);
  app.put('/docentes/:id', DocenteControlador.actualizar);
  app.delete('/docentes/:id', DocenteControlador.eliminar);
}
