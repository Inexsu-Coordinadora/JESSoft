import { Docente } from '../entidades/Docente';
import { DocenteDTO } from '../dtos/DocenteDTO';

export interface IDocenteRepositorio {
  crear(data: DocenteDTO): Promise<void>;
  listar(): Promise<Docente[]>;
  buscarPorId(id_docente: string): Promise<Docente | null>;
  actualizar(id_docente: string, data: DocenteDTO): Promise<void>;
  eliminar(id_docente: string): Promise<void>;
}
