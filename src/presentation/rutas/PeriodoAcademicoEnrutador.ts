import { FastifyInstance } from "fastify";
import { PeriodoAcademicoControlador } from "../controladores/PeriodoAcademicoControlador";
import { IPeriodoAcademicoRepositorio } from "../../core/dominio/repositorio/IPeriodoAcademico";
import { PeriodoAcademicoCasoUso } from "../../core/aplicacion/casos-uso/PeriodoAcademicoCasoUso";
import { PeriodoAcademicoRepositorio } from "../../core/infraestructura/postgres/PeriodoAcademicoRepositorioPostgres";
function periodoAcademicoEnrutador(
    app: FastifyInstance,
    periodoControlador: PeriodoAcademicoControlador
) {
    app.get("/periodos", periodoControlador.obtenerPeriodos);
    app.get("/periodos/:id_p", periodoControlador.obtenerPeriodoPorId);
    app.post("/periodos", periodoControlador.crearPeriodo);
    app.put("/periodos/:id_p", periodoControlador.actualizarPeriodo);
    app.delete("/periodos/:id_p", periodoControlador.eliminarPeriodo);
}

export async function construirPeriodosEnrutador(app: FastifyInstance) {
    const periodosRepositorio: IPeriodoAcademicoRepositorio = new PeriodoAcademicoRepositorio();
    const periodosCasosUso = new PeriodoAcademicoCasoUso(periodosRepositorio);
    const periodosController = new PeriodoAcademicoControlador(periodosCasosUso);

    periodoAcademicoEnrutador(app, periodosController);
}
