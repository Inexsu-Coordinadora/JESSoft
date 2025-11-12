import { Asignatura } from "../entidades/Asignatura.js";

export interface IAsignaturaRepositorio {
  obtenerTodas(): Promise<Asignatura[]>;
  obtenerPorId(id: string): Promise<Asignatura | null>;
  crear(asignatura: Asignatura): Promise<void>;
  eliminar(id: string): Promise<void>;
  actualizar(asignatura: Asignatura, id: string): Promise<void>;
}
