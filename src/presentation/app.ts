import fastify from "fastify";
import { FastifyError } from "fastify";
import { pool } from "../core/infraestructura/postgres/ConexionPostgres.js";

const app = fastify({logger: true});

export const startServer = async (): Promise<void> => {
  try {
    await app.listen({ port: 3000 });
    app.log.info("El servidor esta corriendo...");
  } catch (err) {
    app.log.error(`Error al ejecutar el servidor\n ${err}`);

    const serverError: FastifyError = {
      code: "FST_ERR_INIT_SERVER",
      name: "ServidorError",
      statusCode: 500,
      message: `El servidor no se pudo iniciar: ${(err as Error).message}`,
    };

    throw serverError;
  }
}

app.get("/test", async (req, reply) => {
  const result = await pool.query("SELECT * FROM docente");
  return result.rows;
});
