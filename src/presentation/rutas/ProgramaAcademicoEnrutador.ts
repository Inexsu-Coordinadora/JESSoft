import { FastifyInstance } from "fastify";
import { ProgramaAcademicoControlador } from "../controladores/ProgramaAcademicoControlador.js";
import { IProgramaAcademicoRepositorio } from "../../core/dominio/repositorio/IProgramaAcademico.js";
import { ProgramaAcademicoCasoUso } from "../../core/aplicacion/casos-uso/ProgramaAcademicoCasoUso.js";
import { ProgramaAcademicoRepositorio } from "../../core/infraestructura/postgres/ProgramaAcademicoRepositorioPostgres.js";

function programaAcademicoEnrutador(
  app: FastifyInstance,
  programaControlador: ProgramaAcademicoControlador
) {
  app.get("/programas", programaControlador.obtenerProgramas);
  app.get("/programas/:id_pa", programaControlador.obtenerProgramaPorId);
  app.post("/programas", programaControlador.crearPrograma);
  app.put("/programas/:id_pa", programaControlador.actualizarPrograma);
  app.delete("/programas/:id_pa", programaControlador.eliminarPrograma);
}

export async function construirProgramasEnrutador(app: FastifyInstance) {
  const programasRepositorio: IProgramaAcademicoRepositorio = new ProgramaAcademicoRepositorio();
  const programasCasosUso = new ProgramaAcademicoCasoUso(programasRepositorio);
  const programasController = new ProgramaAcademicoControlador(programasCasosUso);

  programaAcademicoEnrutador(app, programasController);
}
