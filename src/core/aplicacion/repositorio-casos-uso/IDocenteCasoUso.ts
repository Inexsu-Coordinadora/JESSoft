import { IDocente } from "../../dominio/entidades/IDocente.js";
import { DocenteDTO } from "../../../presentation/esquemas/DocenteEsquema.js";

export interface IDocenteCasoUso {
  crearDocente(docente: DocenteDTO): Promise<string>;
  obtenerDocentes(limite?: number): Promise<IDocente[]>;
  obtenerDocentePorId(id_docente: string): Promise<IDocente | null>;
  actualizarDocente(id_docente: string, docente: IDocente): Promise<IDocente | null>;
  eliminarDocente(id_docente: string): Promise<void>;
}
