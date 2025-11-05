import { FastifyInstance } from "fastify";
import { AsignaturaControlador } from "../controladores/AsignaturaControlador.js";
import { AsignaturaRepositorio } from "../../core/infraestructura/postgres/AsignaturaRepositorio.js";
import { AsignaturaCasosUso } from "../../core/aplicacion/casos-uso/AsignaturaCasosUso.js";
import { IAsignaturaRepositorio } from "../../core/dominio/repositorio/IAsignaturaRepositorio.js";

function asignaturaEnrutador(app: FastifyInstance, asignaturaControlador: AsignaturaControlador) {
  app.post("/asignaturas", asignaturaControlador.crear);
  app.get("/asignaturas", asignaturaControlador.listar);
  app.put("/asignaturas/:id", asignaturaControlador.actualizar);
  app.delete("/asignaturas/:id", asignaturaControlador.eliminar);
}

export async function registrarAsignaturaRutas(app: FastifyInstance) {
    const asignaturaRepositorio: IAsignaturaRepositorio = new AsignaturaRepositorio();
    const asignaturaCasosUso = new AsignaturaCasosUso(asignaturaRepositorio);
    const asignaturaControlador = new AsignaturaControlador(asignaturaCasosUso);
    asignaturaEnrutador(app, asignaturaControlador);
}
    