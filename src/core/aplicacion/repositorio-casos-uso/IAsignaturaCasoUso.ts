import { Asignatura } from "../../dominio/entidades/Asignatura";
import { AsignaturaDTO } from "../../../presentation/esquemas/AsignaturaEsquema";

export interface IAsignaturaCasosUso {
  obtenerTodas(): Promise<Asignatura[]>;
  obtenerPorId(id: string): Promise<Asignatura | null>;
  crear(asignaturaDTO: AsignaturaDTO): Promise<AsignaturaDTO>;
  eliminar(id: string): Promise<void>;
  actualizar(asignaturaDTO: AsignaturaDTO, id: string): Promise<AsignaturaDTO>;
}
