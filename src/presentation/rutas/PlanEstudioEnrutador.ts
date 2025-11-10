import { FastifyInstance } from "fastify";
import { PlanEstudioControlador } from "../controladores/PlanEstudioControlador";
import { IPlanEstudioRepositorio } from "../../core/dominio/repositorio/IPlanEstudioRepositorio";
import { PlanEstudioRepositorio } from "../../core/infraestructura/postgres/planEstudioRepositorioPostgres";
import { PlanEstudioCasosUso } from "../../core/aplicacion/casos-uso/PlanEstudioCasosUso";

function planEstudioEnrutador(app: FastifyInstance, PlanEstudioControlador: PlanEstudioControlador) {
    app.post("/plan-estudio", PlanEstudioControlador.crearPlanEstudio);
    app.get("/plan-estudio", PlanEstudioControlador.obtenerTodo);
    app.get("/plan-estudio/:id_plan", PlanEstudioControlador.obtenerPorId);
    app.put("/plan-estudio/:id_plan", PlanEstudioControlador.actualizarPlan);
    app.delete("/plan-estudio/:id_plan", PlanEstudioControlador.eliminarPlan);
}


export async function construirPlanEstudioEnrutador(app: FastifyInstance) {
    const planesRepositorio: IPlanEstudioRepositorio = new PlanEstudioRepositorio();
    const planesCasosUso = new PlanEstudioCasosUso(planesRepositorio);
    const planesControlador = new PlanEstudioControlador(planesCasosUso);

    planEstudioEnrutador(app, planesControlador);
}
