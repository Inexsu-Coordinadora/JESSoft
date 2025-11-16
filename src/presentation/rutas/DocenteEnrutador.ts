import { FastifyInstance } from "fastify";
import { DocenteControlador } from "../controladores/DocenteControlador.js";
import { IDocenteRepositorio } from "../../core/dominio/repositorio/IDocenteRepositorio.js";
import { DocenteRepositorioPostgres } from "../../core/infraestructura/postgres/DocenteRepositorioPostgres.js";
import { DocenteCasoUso } from "../../core/aplicacion/casos-uso/DocenteCasoUso.js";

function docenteEnrutador(
  app: FastifyInstance,
  docenteControlador: DocenteControlador
) {
  app.get("/docentes", docenteControlador.obtenerDocentes);
  app.get("/docentes/:id_docente", docenteControlador.obtenerDocentePorId);
  app.post("/docentes", docenteControlador.crearDocente);
  app.put("/docentes/:id_docente", docenteControlador.actualizarDocente);
  app.delete("/docentes/:id_docente", docenteControlador.eliminarDocente);
}

export async function construirDocenteEnrutador(app: FastifyInstance) {
  const docenteRepositorio: IDocenteRepositorio = new DocenteRepositorioPostgres();
  const docenteCasoUso = new DocenteCasoUso(docenteRepositorio);
  const docenteControlador = new DocenteControlador(docenteCasoUso);

  docenteEnrutador(app, docenteControlador);
}
