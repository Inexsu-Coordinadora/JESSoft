import { IProgramaAcademico } from "../../dominio/entidades/IProgramaAcademico.js";
import { IProgramaAcademicoRepositorio } from "../../dominio/repositorio/IProgramaAcademico.js";

export class ProgramaAcademicoCasoUso {
    constructor(private ProgramaAcademicoRepositorio: IProgramaAcademicoRepositorio) {}

    async crearPrograma(datosProgramaAcademico: IProgramaAcademico): Promise<string> {
        const idNuevoPrograma = await this.ProgramaAcademicoRepositorio.crearPrograma(datosProgramaAcademico);
        return idNuevoPrograma;
    }

    async obtenerProgramas(limite?: number): Promise<IProgramaAcademico[]> {
        return await this.ProgramaAcademicoRepositorio.listarProgramas(limite);
    }

    async obtenerProgramaPorId(id_pa: string): Promise<IProgramaAcademico | null> {
        const programaObtenido = await this.ProgramaAcademicoRepositorio.obtenerProgramaPorId(id_pa);
        console.log(programaObtenido);
        return programaObtenido;
    }

    async actualizarPrograma(id_pa: string, programa: IProgramaAcademico): Promise<IProgramaAcademico | null> {
        if (programa.id_pa && programa.id_pa !== id_pa) {
            throw new Error("No se permite modificar el ID del programa académico.");
        }
        const programaActualizado = await this.ProgramaAcademicoRepositorio.actualizarPrograma(
            id_pa,
            programa
        );
        return programaActualizado || null;
    }

    async eliminarPrograma(id_pa: string): Promise<void> {
        await this.ProgramaAcademicoRepositorio.eliminarPrograma(id_pa);
    }
}