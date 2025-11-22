import { IDocente } from "../entidades/IDocente";

export interface IDocenteRepositorio {
  crearDocente(docente: IDocente): Promise<string>;
  listarDocentes(limite?: number): Promise<IDocente[]>;
  obtenerDocentePorId(id_docente: string): Promise<IDocente | null>;
  actualizarDocente(id_docente: string, docente: IDocente): Promise<IDocente | null>;
  eliminarDocente(id_docente: string): Promise<void>;
}
