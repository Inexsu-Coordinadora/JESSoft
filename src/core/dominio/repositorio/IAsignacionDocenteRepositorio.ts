import { IAsignacionDocente } from "../entidades/IAsignacionDocente";

export interface IAsignacionDocenteRepositorio{
    crearAsignacion(datosAsignacionDocente: IAsignacionDocente): Promise<string>;
    listarAsignaciones(limite?: number): Promise<IAsignacionDocente[]>;
    obtenerAsignacionPorId(id: string): Promise<IAsignacionDocente | null>;
    actualizarAsignacion(id: string, datosAsignacionDocente: IAsignacionDocente): Promise<IAsignacionDocente | null>;
    eliminarAsignacion(id: string): Promise<void>;
    verificarExistenciaDocente(id_docente: string): Promise<boolean>;
    verificarExistenciaGrupo(id_oferta: string): Promise<boolean>;
    verificarAsignacionExistente(id_docente: string, id_oferta: string): Promise<boolean>;
    contarAsignacionesPorDocente(id_docente: string): Promise<number>;
    verificarGrupoTieneDocente(id_oferta: string): Promise<boolean>;


}