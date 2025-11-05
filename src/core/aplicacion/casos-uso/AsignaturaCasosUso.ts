import { IAsignaturaCasosUso } from "../repositorio-casos-uso/IAsignaturaCasosUso.js";
import { IAsignaturaRepositorio } from "../../dominio/repositorio/IAsignaturaRepositorio.js";
import { Asignatura } from "../../dominio/entidades/Asignatura.js";
import { AsignaturaMapeador } from "../mappers/MapperAsignatura.js";
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
    const asignatura = AsignaturaMapeador.toEntidad(dto);

    // Guardamos la entidad en la BD
    await this.asignaturaRepositorio.crear(asignatura);

    // Retornamos la entidad convertida a DTO de respuesta
    return AsignaturaMapeador.toDTO(asignatura);
  }

  async eliminar(id: string): Promise<void> {
    return this.asignaturaRepositorio.eliminar(id);
  }
  async actualizar(dto: AsignaturaDTO): Promise<AsignaturaDTO> {
    const asignatura = AsignaturaMapeador.toEntidadActualizar(dto);
    await this.asignaturaRepositorio.actualizar(asignatura);
    return AsignaturaMapeador.toDTOActualizar(asignatura);
  }
}