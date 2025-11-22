import { IDocente } from "../../dominio/entidades/IDocente";
import { IDocenteRepositorio } from "../../dominio/repositorio/IDocenteRepositorio";

export class DocenteCasoUso {
  constructor(private docenteRepositorio: IDocenteRepositorio) {}

  async crearDocente(datosDocente: IDocente): Promise<string> {
    return this.docenteRepositorio.crearDocente(datosDocente);
  }

  async obtenerDocentes(limite?: number): Promise<IDocente[]> {
    return this.docenteRepositorio.listarDocentes(limite);
  }

  async obtenerDocentePorId(id_docente: string): Promise<IDocente | null> {
    return this.docenteRepositorio.obtenerDocentePorId(id_docente);
  }

  async actualizarDocente(id_docente: string, docente: IDocente): Promise<IDocente | null> {
    return this.docenteRepositorio.actualizarDocente(id_docente, docente);
  }

  async eliminarDocente(id_docente: string): Promise<void> {
    return this.docenteRepositorio.eliminarDocente(id_docente);
  }
}
