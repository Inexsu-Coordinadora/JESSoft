import { IPeriodoAcademicoRepositorio } from "../../dominio/repositorio/IPeriodoAcademico";
import { ejecutarConsulta, pool } from "./ConexionPostgres";
import { IPeriodoAcademico } from "../../dominio/entidades/IPeriodoAcademico";

export class PeriodoAcademicoRepositorio implements IPeriodoAcademicoRepositorio {
  async crearPeriodo(datosPeriodoAcademico: IPeriodoAcademico): Promise<string> {
    const columnas = Object.keys(datosPeriodoAcademico).map((key) => key.toLowerCase());
    const parametros: Array<string | number> = Object.values(datosPeriodoAcademico);
    const placeholders = columnas.map((_, i) => `$${i + 1}`).join(", ");

    const buscarPeriodoQuery = `
      SELECT * FROM periodo_academico
      WHERE fecha_inicio = $1 AND fecha_fin = $2
    `;
    

    if (datosPeriodoAcademico.fecha_inicio.getFullYear() > datosPeriodoAcademico.fecha_fin.getFullYear()) {
      throw new Error("El año de fecha_inicio debe ser menor o igual al año de fecha_fin");
    }

    const periodoExistente = await pool.query(buscarPeriodoQuery, [
      datosPeriodoAcademico.fecha_inicio,
      datosPeriodoAcademico.fecha_fin,
    ]);
    
    if (periodoExistente.rows.length > 0) {
      throw new Error("Ya existe un periodo académico con las mismas fechas de inicio y fin");
    }

    const query = `
      INSERT INTO periodo_academico (${columnas.join(", ")})
      VALUES (${placeholders})
      RETURNING *  
    `;

    const respuesta = await ejecutarConsulta(query, parametros);
    return respuesta.rows[0].id_p;
  }

  async listarPeriodos(limite?: number): Promise<IPeriodoAcademico[]> {
    let query = "SELECT * FROM periodo_academico";
    const valores: number[] = [];

    if (limite !== undefined) {
      query += " LIMIT $1";
      valores.push(limite);
    }

    const result = await pool.query(query, valores);
    return result.rows;
  }

  async obtenerPeriodoPorId(id_periodo: string): Promise<IPeriodoAcademico | null> {
    const query = "SELECT * FROM periodo_academico WHERE id_periodo = $1";
    const result = await ejecutarConsulta(query, [id_periodo]);
    return result.rows[0] || null;
  }

  async actualizarPeriodo(id: string, datosPeriodoAcademico: IPeriodoAcademico): Promise<IPeriodoAcademico> {
    const columnas = Object.keys(datosPeriodoAcademico).map((key) => key.toLowerCase());
    const parametros = Object.values(datosPeriodoAcademico);
    const setClause = columnas.map((col, i) => `${col}=$${i + 1}`).join(", ");
    parametros.push(id);

    const query = `
      UPDATE periodo_academico
      SET ${setClause}
      WHERE id_periodo=$${parametros.length}
      RETURNING *;
    `;

    const result = await ejecutarConsulta(query, parametros);
    return result.rows[0];
  }

  async eliminarPeriodo(id_periodo: string): Promise<void> {
    await ejecutarConsulta("DELETE FROM periodo_academico WHERE id_periodo = $1", [id_periodo]);
  }
}