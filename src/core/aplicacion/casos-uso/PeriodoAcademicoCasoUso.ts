import { IPeriodoAcademico } from "../../dominio/entidades/IPeriodoAcademico";
import { IPeriodoAcademicoRepositorio } from "../../dominio/repositorio/IPeriodoAcademico";
import { IPeriodoAcademicoCasoUso } from "../repositorio-casos-uso/IPeriodoAcademicoCasoUso";

export class PeriodoAcademicoCasoUso implements IPeriodoAcademicoCasoUso {
    constructor(private PeriodoAcademicoRepositorio: IPeriodoAcademicoRepositorio) {}

    async crearPeriodo(datosPeriodoAcademico: IPeriodoAcademico): Promise<string> {
        const idNuevoPeriodo = await this.PeriodoAcademicoRepositorio.crearPeriodo(datosPeriodoAcademico);
        return idNuevoPeriodo;
    }

    async obtenerPeriodos(limite?: number): Promise<IPeriodoAcademico[]> {
        return await this.PeriodoAcademicoRepositorio.listarPeriodos(limite);
    }

    async obtenerPeriodoPorId(id_p: string): Promise<IPeriodoAcademico | null> {
        const periodoObtenido = await this.PeriodoAcademicoRepositorio.obtenerPeriodoPorId(id_p);
        console.log(periodoObtenido);
        return periodoObtenido;
    }

    async actualizarPeriodo(id_p: string, periodo: IPeriodoAcademico): Promise<IPeriodoAcademico | null> {
        if (periodo.id_periodo && periodo.id_periodo !== id_p) {
            throw new Error("No se permite modificar el ID del periodo académico.");
        }
        const periodoActualizado = await this.PeriodoAcademicoRepositorio.actualizarPeriodo(
            id_p,
            periodo
        );
        return periodoActualizado || null;
    }

    async eliminarPeriodo(id_p: string): Promise<void> {
        await this.PeriodoAcademicoRepositorio.eliminarPeriodo(id_p);
    }
}