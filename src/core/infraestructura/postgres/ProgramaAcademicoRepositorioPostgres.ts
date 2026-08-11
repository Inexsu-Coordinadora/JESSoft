import { IProgramaAcademicoRepositorio } from "../../dominio/repositorio/IProgramaAcademico";
import { ejecutarConsulta } from "./ConexionPostgres";
import { IProgramaAcademico } from "../../dominio/entidades/IProgramaAcademico";

export class ProgramaAcademicoRepositorio implements IProgramaAcademicoRepositorio {
  async crearPrograma(datosProgramaAcademico: IProgramaAcademico): Promise<string> {
    const columnas = Object.keys(datosProgramaAcademico).map((key) => key.toLowerCase());
    const parametros: Array<string | number> = Object.values(datosProgramaAcademico);
    const placeholders = columnas.map((_, i) => `$${i + 1}`).join(", ");

    const query = `
      INSERT INTO programa_academico (${columnas.join(", ")})
      VALUES (${placeholders})
      RETURNING *  
    `;

    const respuesta = await ejecutarConsulta(query, parametros);
    return respuesta.rows[0].id_programa;
  }

  async listarProgramas(limite?: number): Promise<IProgramaAcademico[]> {
    let query = "SELECT * FROM programa_academico";
    const valores: number[] = [];

    if (limite !== undefined) {
      query += " LIMIT $1";
      valores.push(limite);
    }

    const result = await ejecutarConsulta(query, valores);
    return result.rows;
  }

  async obtenerProgramaPorId(id_programa: string): Promise<IProgramaAcademico | null> {
    const query = "SELECT * FROM programa_academico WHERE id_programa = $1";
    const result = await ejecutarConsulta(query, [id_programa]);
    return result.rows[0] || null;
  }

  async actualizarPrograma(id: string, datosProgramaAcademico: IProgramaAcademico): Promise<IProgramaAcademico> {
    const columnas = Object.keys(datosProgramaAcademico).map((key) => key.toLowerCase());
    const parametros = Object.values(datosProgramaAcademico);
    const setClause = columnas.map((col, i) => `${col}=$${i + 1}`).join(", ");
    parametros.push(id);

    const query = `
      UPDATE programa_academico
      SET ${setClause}
      WHERE id_programa=$${parametros.length}
      RETURNING *;
    `;

    const result = await ejecutarConsulta(query, parametros);
    return result.rows[0];
  }

  async eliminarPrograma(id_programa: string): Promise<void> {
    await ejecutarConsulta("DELETE FROM programa_academico WHERE id_programa = $1", [id_programa]);
  }
}