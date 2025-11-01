import { DocenteRepositorio } from '../../dominio/repositorio/DocenteRepositorio';
import { Docente } from '../../dominio/entidades/Docente';

export class ListarDocentesCasoUso {
  constructor(private repo: DocenteRepositorio) {}
  async ejecutar(): Promise<Docente[]> {
    return this.repo.listar();
  }
}
