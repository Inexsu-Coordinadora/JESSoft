import { FastifyInstance } from "fastify";
import { AsignacionDocenteControlador } from "../controladores/AsignacionDocenteControlador.js";
import { IAsignacionDocenteRepositorio } from "../../core/dominio/repositorio/IAsignacionDocenteRepositorio.js";
import { AsignacionDocenteCasoUso } from "../../core/aplicacion/casos-uso/AsignacionDocenteCasoUso.js";
import { AsignacionDocenteRepositorio } from "../../core/infraestructura/postgres/AsignacionDocenteRepositorioPostgres.js";

function asignacionDocenteEnrutador(
  app: FastifyInstance,
  asignacionControlador: AsignacionDocenteControlador
) {
  app.get("/asignaciones", asignacionControlador.obtenerAsignaciones);
  app.get("/asignaciones/:id_asignacion", asignacionControlador.obtenerAsignacionPorId);
  app.post("/asignaciones", asignacionControlador.crearAsignacion);
  app.put("/asignaciones/:id_asignacion", asignacionControlador.actualizarAsignacion);
  app.delete("/asignaciones/:id_asignacion", asignacionControlador.eliminarAsignacion);
}

export async function construirAsignacionesEnrutador(app: FastifyInstance) {
  const asignacionesRepositorio: IAsignacionDocenteRepositorio = new AsignacionDocenteRepositorio();
  const asignacionesCasosUso = new AsignacionDocenteCasoUso(asignacionesRepositorio);
  const asignacionesController = new AsignacionDocenteControlador(asignacionesCasosUso);

  asignacionDocenteEnrutador(app, asignacionesController);
}
