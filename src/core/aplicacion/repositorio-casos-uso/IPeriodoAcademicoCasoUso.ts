import { IPeriodoAcademico } from "../../dominio/entidades/IPeriodoAcademico.js";
import { PeriodoAcademicoDTO } from "../../../presentation/esquemas/PeriodoAcademicoEsquema.js";
export interface IPeriodoAcademicoCasoUso{
    crearPeriodo(periodo: PeriodoAcademicoDTO): Promise<string>;
    obtenerPeriodos(limite?: number): Promise<IPeriodoAcademico[]>;
    obtenerPeriodoPorId(id_p: string): Promise<IPeriodoAcademico | null>;
    actualizarPeriodo(id_p: string, periodo: IPeriodoAcademico): Promise<IPeriodoAcademico | null>;
    eliminarPeriodo(id_p: string): Promise<void>;
}