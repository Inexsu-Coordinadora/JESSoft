import { buildApp } from './presentacion/app';
import { configuracion } from './common/configuracion';

async function main() {
  try {
    const app = await buildApp();
    await app.listen({ port: configuracion.port, host: '0.0.0.0' });
    console.log(`Servidor corriendo en http://localhost:${configuracion.port}`);
  } catch (err) {
    console.error('Error al iniciar el servidor:', err);
    process.exit(1);
  }
}

main();
