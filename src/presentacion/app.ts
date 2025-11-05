import fastify from 'fastify';
import { DocenteEnrutador } from './rutas/DocenteEnrutador';

export async function buildApp() {
  const app = fastify({ logger: true });

  // Registrar rutas del módulo Docente
  await app.register(DocenteEnrutador);

  // Ruta de prueba (opcional)
  app.get('/', async () => ({ mensaje: 'Servidor activo ' }));

  return app;
}
