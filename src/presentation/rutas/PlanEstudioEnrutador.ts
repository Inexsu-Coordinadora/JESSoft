import { FastifyInstance } from "fastify";
import { PlanEstudioControlador } from "../controladores/PlanEstudioControlador";
import { PlanEstudioRepositorio } from "../../core/infraestructura/postgres/PlanEstudioRepositorio";
import { PlanEstudioCasosUso } from "../../core/aplicacion/casos-uso/PlanEstudioCasosUso";
import { IPlanEstudioRepositorio } from "../../core/dominio/repositorio/IPlanEstudioRepositorio";

function planEstudioEnrutador(app: FastifyInstance, planEstudioControlador: PlanEstudioControlador) {
    app.post("/planes-estudio", planEstudioControlador.crear);
    app.get("/planes-estudio", planEstudioControlador.listar);
    app.put("/planes-estudio/:id", planEstudioControlador.actualizar);
    app.delete("/planes-estudio/:id", planEstudioControlador.eliminar);
}

export async function registrarPlanEstudioRutas(app: FastifyInstance) {
    const planEstudioRepositorio: IPlanEstudioRepositorio = new PlanEstudioRepositorio();
    const planEstudioCasosUso = new PlanEstudioCasosUso(planEstudioRepositorio);
    const planEstudioControlador = new PlanEstudioControlador(planEstudioCasosUso);
    planEstudioEnrutador(app, planEstudioControlador);
}
