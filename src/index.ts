<<<<<<< HEAD
import { startServer } from './presentation/app';
import { config } from './common/configuracion';

async function main() {
  await startServer();
  console.log(`Servidor corriendo en http://localhost:${config.puerto}`);
}

main().catch((err) => {
  console.error('Error al iniciar el servidor:', err);
  process.exit(1);
});
=======
import { startServer } from "./presentation/app.js";

startServer();
>>>>>>> 57092ed83eb8caa141f2c1b9181df62e2a509a5b
