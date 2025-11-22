import { startServer } from './presentation/app';
import { configuracion } from './common/configuracion';
async function main() {
  await startServer();
  console.log(`Servidor corriendo en http://localhost:${configuracion.port}`);
}

main().catch((err) => {
  console.error('Error al iniciar el servidor:', err);
  process.exit(1);
});

