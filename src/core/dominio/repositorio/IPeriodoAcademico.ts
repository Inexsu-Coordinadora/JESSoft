import { IPeriodoAcademico } from "../entidades/IPeriodoAcademico.js";

export interface IPeriodoAcademicoRepositorio {
    crearPeriodo(datosPeriodoAcademico: IPeriodoAcademico): Promise<string>;
    listarPeriodos(limite?: number): Promise<IPeriodoAcademico[]>;
    obtenerPeriodoPorId(id: string): Promise<IPeriodoAcademico | null>;
    actualizarPeriodo(id: string, datosPeriodoAcademico: IPeriodoAcademico): Promise<IPeriodoAcademico>;
    eliminarPeriodo(id: string): Promise<void>;
}