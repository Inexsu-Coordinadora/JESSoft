import { IProgramaAcademico } from "../../dominio/entidades/IProgramaAcademico";
import { IProgramaAcademicoRepositorio } from "../../dominio/repositorio/IProgramaAcademico";

export class ProgramaAcademicoCasoUso {
    constructor(private ProgramaAcademicoRepositorio: IProgramaAcademicoRepositorio) {}

    async crearPrograma(datosProgramaAcademico: IProgramaAcademico): Promise<string> {
        const idNuevoPrograma = await this.ProgramaAcademicoRepositorio.crearPrograma(datosProgramaAcademico);
        return idNuevoPrograma;
    }

    async obtenerProgramas(limite?: number): Promise<IProgramaAcademico[]> {
        return await this.ProgramaAcademicoRepositorio.listarProgramas(limite);
    }

    async obtenerProgramaPorId(id_plan: string): Promise<IProgramaAcademico | null> {
        const programaObtenido = await this.ProgramaAcademicoRepositorio.obtenerProgramaPorId(id_plan);
        console.log(programaObtenido);
        return programaObtenido;
    }

    async actualizarPrograma(id_plan: string, programa: IProgramaAcademico): Promise<IProgramaAcademico | null> {

        if (programa.id_programa && programa.id_programa !== id_plan) {
            throw new Error("No se permite modificar el ID del programa académico.");
        }
        const existente = await this.ProgramaAcademicoRepositorio.obtenerProgramaPorId(id_plan);

        if (!existente) {
            return null;  
        }

        const actualizado = await this.ProgramaAcademicoRepositorio.actualizarPrograma(
            id_plan,
            programa
        );

        return actualizado;
    }


    async eliminarPrograma(id_plan: string): Promise<void> {
        await this.ProgramaAcademicoRepositorio.eliminarPrograma(id_plan);
    }
}