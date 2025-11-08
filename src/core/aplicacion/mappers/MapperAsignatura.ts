import { Asignatura } from "../../dominio/entidades/Asignatura.js";
import { AsignaturaDTO } from "../../../presentation/esquemas/AsignaturaEsquema.js";

export class AsignaturaMapeador {
  static toEntidad(dto: AsignaturaDTO): Asignatura {
    return new Asignatura(
      "", // el id lo genera la BD
      dto.nombre,
      dto.creditos,
      dto.carga_horaria,
      dto.tipo,
      dto.descripcion
    );
  }

  static toDTO(entidad: Asignatura): AsignaturaDTO {
    return new AsignaturaDTO(
      entidad.getId(),
      entidad.getNombre(),
      entidad.getCreditos(),
      entidad.getCarga_horaria(),
      entidad.getTipo(),
      entidad.getDescripcion()
    );
  }

  static toEntidadActualizar(dto: AsignaturaDTO): Asignatura {
    return new Asignatura(
      dto.id,
      dto.nombre,
      dto.creditos,
      dto.carga_horaria,
      dto.tipo,
      dto.descripcion
    );
  }

  static toDTOActualizar(entidad: Asignatura): AsignaturaDTO {
    return new AsignaturaDTO(
      "",
      entidad.getNombre(),
      entidad.getCreditos(),
      entidad.getCarga_horaria(),
      entidad.getTipo(),
      entidad.getDescripcion()
    );
  }
}
