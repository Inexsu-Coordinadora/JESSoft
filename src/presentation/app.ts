import fastify from "fastify";
import { FastifyError } from "fastify";
import { construirPeriodosEnrutador } from "./rutas/PeriodoAcademicoEnrutador";
import { construirProgramasEnrutador } from "./rutas/ProgramaAcademicoEnrutador";
import { registrarAsignaturaRutas } from "./rutas/AsignaturaEnrutador";
import { construirDocenteEnrutador } from "./rutas/DocenteEnrutador";
import { construirAsignacionesEnrutador } from "./rutas/AsignacionDocenteEnrutador"
import { construirOfertaAcademicaEnrutador } from "./rutas/OfertaAcademicaEnrutador";
import { registrarPlanEstudioRutas } from "./rutas/PlanEstudioEnrutador";

export const app = fastify({ logger: true });

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
    await app.listen({ port: Number(process.env.PORT) });
    app.log.info("El servidor está corriendo en el puerto " + process.env.PORT);
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
