import { IProgramaAcademico } from "../../dominio/entidades/IProgramaAcademico.js";
import { ProgramaAcademicoDTO } from "../../../presentation/esquemas/ProgramaAcademicoEsquema.js";

export interface IProgramaAcademicoCasoUso{
    crearPrograma(programa: ProgramaAcademicoDTO): Promise<string>;
    obtenerProgramas(limite?: number): Promise<IProgramaAcademico[]>;
    obtenerProgramaPorId(id_plan: string): Promise<IProgramaAcademico | null>;
    actualizarPrograma(id_plan: string, programa: IProgramaAcademico): Promise<IProgramaAcademico | null>;
    eliminarPrograma(id_plan: string): Promise<void>;
}