import { Docente } from '../entidades/Docente';
import { DocenteDTO } from '../dtos/DocenteDTO';

export interface IDocenteRepositorio {
  crear(data: DocenteDTO): Promise<void>;
  listar(): Promise<Docente[]>;
  buscarPorId(id_d: string): Promise<Docente | null>;
  actualizar(id_d: string, data: DocenteDTO): Promise<void>;
  eliminar(id_d: string): Promise<void>;
}
