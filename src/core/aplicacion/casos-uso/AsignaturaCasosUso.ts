import { IAsignaturaCasosUso } from "../repositorio-casos-uso/IAsignaturaCasosUso.js";
import { IAsignaturaRepositorio } from "../../dominio/repositorio/IAsignaturaRepositorio.js";
import { Asignatura } from "../../dominio/entidades/Asignatura.js";
import { AsignaturaDTO } from "../../../presentation/esquemas/AsignaturaEsquema.js";


export class AsignaturaCasosUso implements IAsignaturaCasosUso {
  private asignaturaRepositorio: IAsignaturaRepositorio;
  
  constructor(asignaturaRepositorio: IAsignaturaRepositorio) {
    this.asignaturaRepositorio = asignaturaRepositorio;
  }

  async obtenerTodas(): Promise<Asignatura[]> {
    return this.asignaturaRepositorio.obtenerTodas();
  }

  async obtenerPorId(id: string): Promise<Asignatura | null> {
    return this.asignaturaRepositorio.obtenerPorId(id);
  }

 async crear(dto: AsignaturaDTO): Promise<AsignaturaDTO> {
    // Convertir el DTO a Entidad
    const asignatura =  new Asignatura(
      " ",
      dto.nombre,
      dto.creditos,
      dto.carga_horaria,
      dto.tipo,
      dto.descripcion
    );
    await this.asignaturaRepositorio.crear(asignatura);
    // Retornamos la entidad convertida a DTO de respuesta

    const dtoCreado: AsignaturaDTO = {
      nombre: asignatura.getNombre(),
      creditos: asignatura.getCreditos(),
      carga_horaria: asignatura.getCarga_horaria(),
      tipo: asignatura.getTipo(),
      descripcion: asignatura.getDescripcion()
    };
    return dtoCreado;
    //return AsignaturaMapeador.toDTO(asignatura);
  }

  async eliminar(id: string): Promise<void> {
    return this.asignaturaRepositorio.eliminar(id);
  }
  async actualizar(dto: AsignaturaDTO, id: string): Promise<AsignaturaDTO> {
    const asignatura = new Asignatura(
      "",
      dto.nombre,
      dto.creditos,
      dto.carga_horaria,
      dto.tipo,
      dto.descripcion
    );
    await this.asignaturaRepositorio.actualizar(asignatura, id);
    const dtoActualizado: AsignaturaDTO = {
      nombre: asignatura.getNombre(),
      creditos: asignatura.getCreditos(),
      carga_horaria: asignatura.getCarga_horaria(),
      tipo: asignatura.getTipo(),
      descripcion: asignatura.getDescripcion()
    };
    return dtoActualizado;
    //return AsignaturaMapeador.toDTO(asignatura);
  }
}