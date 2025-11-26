import { FastifyInstance } from "fastify";
import { AsignaturaControlador } from "../controladores/AsignaturaControlador";
import { AsignaturaRepositorio } from "../../core/infraestructura/postgres/AsignaturaRepositorio";
import { AsignaturaCasosUso } from "../../core/aplicacion/casos-uso/AsignaturaCasoUso";
import { IAsignaturaRepositorio } from "../../core/dominio/repositorio/IAsignaturaRepositorio";

function asignaturaEnrutador(app: FastifyInstance, asignaturaControlador: AsignaturaControlador) {
  app.post("/asignaturas", asignaturaControlador.crear.bind(asignaturaControlador));
  app.get("/asignaturas", asignaturaControlador.listar.bind(asignaturaControlador));
  app.put("/asignaturas/:id", asignaturaControlador.actualizar.bind(asignaturaControlador));
  app.delete("/asignaturas/:id", asignaturaControlador.eliminar.bind(asignaturaControlador));
}


export async function registrarAsignaturaRutas(app: FastifyInstance) {
    const asignaturaRepositorio: IAsignaturaRepositorio = new AsignaturaRepositorio();
    const asignaturaCasosUso = new AsignaturaCasosUso(asignaturaRepositorio);
    const asignaturaControlador = new AsignaturaControlador(asignaturaCasosUso);
    asignaturaEnrutador(app, asignaturaControlador);
}
    