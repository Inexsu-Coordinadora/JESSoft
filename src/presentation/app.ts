import fastify from "fastify";
import { FastifyError } from "fastify";
import { construirPeriodosEnrutador } from "./rutas/PeriodoAcademicoEnrutador.js";
import { construirProgramasEnrutador } from "./rutas/ProgramaAcademicoEnrutador.js";
import { registrarAsignaturaRutas } from "./rutas/AsignaturaEnrutador.js";
import { construirDocenteEnrutador } from "./rutas/DocenteEnrutador.js";
import { construirAsignacionesEnrutador } from "./rutas/AsignacionDocenteEnrutador.js"
import { construirOfertaAcademicaEnrutador } from "./rutas/OfertaAcademicaEnrutador.js";
import { registrarPlanEstudioRutas } from "./rutas/PlanEstudioEnrutador.js";

const app = fastify({ logger: true });

app.register(
  async (appInstance) => {
    construirPeriodosEnrutador(appInstance);
    construirProgramasEnrutador(appInstance);
    registrarAsignaturaRutas(appInstance);
    construirDocenteEnrutador(appInstance);
    construirAsignacionesEnrutador(appInstance);
    construirOfertaAcademicaEnrutador(appInstance);  
    registrarPlanEstudioRutas(appInstance);
  },
  { prefix: "/api" }
);

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
};
