import { IAsignacionDocenteRepositorio } from "../../dominio/repositorio/IAsignacionDocenteRepositorio";
import { ejecutarConsulta } from "./ConexionPostgres";
import { IAsignacionDocente } from "../../dominio/entidades/IAsignacionDocente";

export class AsignacionDocenteRepositorio implements IAsignacionDocenteRepositorio {
  async crearAsignacion(datosAsignacionDocente: IAsignacionDocente): Promise<string> {
    const columnas = Object.keys(datosAsignacionDocente).map((key) => key.toLowerCase());
    const parametros: Array<string | number> = Object.values(datosAsignacionDocente);
    const placeholders = columnas.map((_, i) => `$${i + 1}`).join(", ");

    const query = `
      INSERT INTO asignacion_docente (${columnas.join(", ")})
      VALUES (${placeholders})
      RETURNING *  
    `;

    const respuesta = await ejecutarConsulta(query, parametros);
    return respuesta.rows[0].id_pa;
  }

  async listarAsignaciones(limite?: number): Promise<IAsignacionDocente[]> {
    // Consulta con JOIN para traer el nombre y apellido del docente
    let query = `
      SELECT 
        ad.*, 
        d.nombre AS docente,
        o.grupo AS grupo
      FROM asignacion_docente ad
      JOIN docente d ON ad.id_docente = d.id_docente
      JOIN oferta_academica o ON ad.id_oferta = o.id_oferta
    `;

      const valores: number[] = [];

      if (limite !== undefined) {
        query += " LIMIT $1";
        valores.push(limite);
      }

      const result = await ejecutarConsulta(query, valores);
      return result.rows;
    }


  async obtenerAsignacionPorId(id_asignacion: string): Promise<IAsignacionDocente | null> {
    const query = `
      SELECT 
        ad.*, 
        d.nombre AS docente,
        o.grupo AS grupo
      FROM asignacion_docente ad
      JOIN docente d ON ad.id_docente = d.id_docente
      JOIN oferta_academica o ON ad.id_oferta = o.id_oferta WHERE id_asignacion = $1`;
    const result = await ejecutarConsulta(query, [id_asignacion]);
    return result.rows[0] || null;
  }

  async actualizarAsignacion(id: string, datosAsignacionDocente: IAsignacionDocente): Promise<IAsignacionDocente> {
    const columnas = Object.keys(datosAsignacionDocente).map((key) => key.toLowerCase());
    const parametros = Object.values(datosAsignacionDocente);
    const setClause = columnas.map((col, i) => `${col}=$${i + 1}`).join(", ");
    parametros.push(id);

    const query = `
      UPDATE asignacion_docente
      SET ${setClause}
      WHERE id_asignacion=$${parametros.length}
      RETURNING *;
    `;

    const result = await ejecutarConsulta(query, parametros);
    return result.rows[0];
  }

  async eliminarAsignacion(id_asignacion: string): Promise<void> {
    await ejecutarConsulta("DELETE FROM asignacion_docente WHERE id_asignacion = $1", [id_asignacion]);
  }


  /*-----*/
  async verificarExistenciaDocente(id_docente: string): Promise<boolean> {
    const query = "SELECT 1 FROM docente WHERE id_docente = $1";
    const result = await ejecutarConsulta(query, [id_docente]);
    return (result?.rowCount ?? 0) > 0;
  }

  async verificarExistenciaGrupo(id_oferta: string): Promise<boolean> {
    const query = "SELECT 1 FROM oferta_academica WHERE id_oferta = $1";
    const result = await ejecutarConsulta(query, [id_oferta]);
    return (result?.rowCount ?? 0) > 0;
  }

  async verificarAsignacionExistente(id_docente: string, id_oferta: string): Promise<boolean> {
    const query = `
      SELECT 1 FROM asignacion_docente
      WHERE id_docente = $1 AND id_oferta = $2
    `;
    const result = await ejecutarConsulta(query, [id_docente, id_oferta]);
    return (result?.rowCount ?? 0) > 0;
  }

  async contarAsignacionesPorDocente(id_docente: string): Promise<number> {
    const query = "SELECT COUNT(*) FROM asignacion_docente WHERE id_docente = $1";
    const result = await ejecutarConsulta(query, [id_docente]);
    return parseInt(result?.rows?.[0]?.count ?? "0", 10);
  }

    async verificarGrupoTieneDocente(id_oferta: string): Promise<boolean> {
    const query = "SELECT 1 FROM asignacion_docente WHERE id_oferta = $1 LIMIT 1";
    const result = await ejecutarConsulta(query, [id_oferta]);
    return (result?.rowCount ?? 0) > 0;
  }

}