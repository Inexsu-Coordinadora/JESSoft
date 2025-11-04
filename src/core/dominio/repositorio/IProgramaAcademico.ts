import { IProgramaAcademico } from "../entidades/IProgramaAcademico.js";

export interface IProgramaAcademicoRepositorio{
    crearPrograma(datosProgramaAcademico: IProgramaAcademico): Promise<string>;
    listarProgramas(limite?: number): Promise<IProgramaAcademico[]>;
    obtenerProgramaPorId(id: string): Promise<IProgramaAcademico | null>;
    actualizarPrograma(id: string, datosProgramaAcademico: IProgramaAcademico): Promise<IProgramaAcademico>;
    eliminarPrograma(id: string): Promise<void>;
}