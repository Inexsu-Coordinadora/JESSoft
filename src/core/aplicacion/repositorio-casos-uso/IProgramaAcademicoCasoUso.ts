import { IProgramaAcademico } from "../../dominio/entidades/IProgramaAcademico";
import { ProgramaAcademicoDTO } from "../../../presentation/esquemas/ProgramaAcademicoEsquema";

export interface IProgramaAcademicoCasoUso{
    crearPrograma(programa: ProgramaAcademicoDTO): Promise<string>;
    obtenerProgramas(limite?: number): Promise<IProgramaAcademico[]>;
    obtenerProgramaPorId(id_pa: string): Promise<IProgramaAcademico | null>;
    actualizarPrograma(id_pa: string, programa: IProgramaAcademico): Promise<IProgramaAcademico | null>;
    eliminarPrograma(id_pa: string): Promise<void>;
}