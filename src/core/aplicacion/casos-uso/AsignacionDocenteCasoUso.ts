import { IAsignacionDocente } from "../../dominio/entidades/IAsignacionDocente";
import { IAsignacionDocenteRepositorio } from "../../dominio/repositorio/IAsignacionDocenteRepositorio";

export class AsignacionDocenteCasoUso {
    constructor(private AsignacionDocenteRepositorio: IAsignacionDocenteRepositorio) {}

    async crearAsignacion(datosAsignacionDocente: IAsignacionDocente): Promise<string> {
        const docenteExiste = await this.AsignacionDocenteRepositorio.verificarExistenciaDocente(datosAsignacionDocente.id_docente);
        if (!docenteExiste) throw new Error("El docente especificado no existe.");

        const grupoExiste = await this.AsignacionDocenteRepositorio.verificarExistenciaGrupo(datosAsignacionDocente.id_oferta);
        if (!grupoExiste) throw new Error("El grupo (oferta académica) especificado no existe.");

        const asignacionDuplicada = await this.AsignacionDocenteRepositorio.verificarAsignacionExistente(
            datosAsignacionDocente.id_docente,
            datosAsignacionDocente.id_oferta
        );
        if (asignacionDuplicada) throw new Error("Ya existe una asignación para este docente y este grupo.");

        const LIMITE_GRUPOS = 5;
        const cantidadAsignaciones = await this.AsignacionDocenteRepositorio.contarAsignacionesPorDocente(datosAsignacionDocente.id_docente);
        if (cantidadAsignaciones >= LIMITE_GRUPOS) {
            throw new Error(`El docente ya tiene el límite máximo (${LIMITE_GRUPOS}) de grupos asignados.`);
        }

        const grupoTieneDocente = await this.AsignacionDocenteRepositorio.verificarGrupoTieneDocente(datosAsignacionDocente.id_oferta);
        if (grupoTieneDocente) throw new Error("Este grupo ya tiene un docente asignado.");

        const idNuevaAsignacion = await this.AsignacionDocenteRepositorio.crearAsignacion(datosAsignacionDocente);
        return idNuevaAsignacion;
    }

    async obtenerAsignaciones(limite?: number): Promise<IAsignacionDocente[]> {
        return await this.AsignacionDocenteRepositorio.listarAsignaciones(limite);
    }

    async obtenerAsignacionPorId(id_asignacion: string): Promise<IAsignacionDocente | null> {
        const asignacionObtenida = await this.AsignacionDocenteRepositorio.obtenerAsignacionPorId(id_asignacion);
        console.log(asignacionObtenida);
        return asignacionObtenida;
    }

    async actualizarAsignacion(id_asignacion: string, asignacion: IAsignacionDocente): Promise<IAsignacionDocente | null> {

        if (asignacion.id_asignacion && asignacion.id_asignacion !== id_asignacion) {
            throw new Error("No se permite modificar el ID de la asignación.");
        }

        const existente = await this.AsignacionDocenteRepositorio.obtenerAsignacionPorId(id_asignacion);
        if (!existente) {
            return null; 
        }

        const asignacionActualizada = await this.AsignacionDocenteRepositorio.actualizarAsignacion(
            id_asignacion,
            asignacion
        );

        return asignacionActualizada || null;
    }

    async eliminarAsignacion(id_asignacion: string): Promise<void> {
        await this.AsignacionDocenteRepositorio.eliminarAsignacion(id_asignacion);
    }
}