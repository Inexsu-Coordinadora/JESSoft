import { IAsignacionDocente } from "../../dominio/entidades/IAsignacionDocente";
import { AsignacionDocenteDTO } from "../../../presentation/esquemas/AsignacionDocenteEsquema";

export interface IAsignacionDocenteCasoUso{
    crearAsignacion(asignacion: AsignacionDocenteDTO): Promise<string>;
    obtenerAsignaciones(limite?: number): Promise<IAsignacionDocente[]>;
    obtenerAsignacionPorId(id_asignacion: string): Promise<IAsignacionDocente | null>;
    actualizarAsignacion(id_asignacion: string, asignacion: IAsignacionDocente): Promise<IAsignacionDocente | null>;
    eliminarAsignacion(id_asignacion: string): Promise<void>;
}