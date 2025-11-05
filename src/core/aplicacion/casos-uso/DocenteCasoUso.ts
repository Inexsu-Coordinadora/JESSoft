import { IDocenteRepositorio } from '../../dominio/repositorio/IDocenteRepositorio';
import { DocenteDTO } from '../../dominio/dtos/DocenteDTO';

export class DocenteCasoUso {
  constructor(private readonly repo: IDocenteRepositorio) {}

  crear(dto: DocenteDTO) {
    return this.repo.crear(dto);
  }

  listar() {
    return this.repo.listar();
  }

  buscarPorId(id: string) {
    return this.repo.buscarPorId(id);
  }

  actualizar(id: string, dto: DocenteDTO) {
    return this.repo.actualizar(id, dto);
  }

  eliminar(id: string) {
    return this.repo.eliminar(id);
  }
}
