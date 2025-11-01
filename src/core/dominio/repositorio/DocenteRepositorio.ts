import { Docente } from '../entidades/Docente';

export interface DocenteRepositorio {
  crear(docente: Docente): Promise<void>;
  listar(): Promise<Docente[]>;
  actualizar(id: string, docente: Docente): Promise<void>;
  eliminar(id: string): Promise<void>;
}