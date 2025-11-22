import { FastifyInstance } from "fastify";
import { ProgramaAcademicoControlador } from "../controladores/ProgramaAcademicoControlador";
import { IProgramaAcademicoRepositorio } from "../../core/dominio/repositorio/IProgramaAcademico";
import { ProgramaAcademicoCasoUso } from "../../core/aplicacion/casos-uso/ProgramaAcademicoCasoUso";
import { ProgramaAcademicoRepositorio } from "../../core/infraestructura/postgres/ProgramaAcademicoRepositorioPostgres";

function programaAcademicoEnrutador(
  app: FastifyInstance,
  programaControlador: ProgramaAcademicoControlador
) {
  app.get("/programas", programaControlador.obtenerProgramas);
  app.get("/programas/:id_plan", programaControlador.obtenerProgramaPorId);
  app.post("/programas", programaControlador.crearPrograma);
  app.put("/programas/:id_plan", programaControlador.actualizarPrograma);
  app.delete("/programas/:id_plan", programaControlador.eliminarPrograma);
}

export async function construirProgramasEnrutador(app: FastifyInstance) {
  const programasRepositorio: IProgramaAcademicoRepositorio = new ProgramaAcademicoRepositorio();
  const programasCasosUso = new ProgramaAcademicoCasoUso(programasRepositorio);
  const programasController = new ProgramaAcademicoControlador(programasCasosUso);

  programaAcademicoEnrutador(app, programasController);
}
