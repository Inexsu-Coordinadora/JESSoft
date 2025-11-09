import { pool } from "./ConexionPostgres"; 
import { Pool } from "pg";
import { IOfertaAcademicaRepositorio } from "../../dominio/repositorio/IOfertaAcademicaRepositorio";
import { CrearOfertaAcademicaDTO } from "../../dominio/dtos/OfertaAcademicaDTO";
import { OfertaAcademica } from "../../dominio/entidades/OfertaAcademica";


export class OfertaAcademicaRepositorioPostgres implements IOfertaAcademicaRepositorio {
  
  // Verificar si el periodo existe.
  async buscarPeriodo(id_periodo: string): Promise<{ existe: boolean; estado?: string }> {
    const consulta = "SELECT estado FROM periodo_academico WHERE id_periodo = $1";
    const resultado = await pool.query(consulta, [id_periodo]);
    if (resultado.rowCount === 0) return { existe: false };
    return { existe: true, estado: resultado.rows[0].estado };
  }

  // Verificar si existe el plan de estudio
  async buscarPlan(id_plan: string): Promise<boolean> {
    const consulta = "SELECT 1 FROM plan_estudio WHERE id_plan = $1";
    const resultado = await pool.query(consulta, [id_plan]);
    return (resultado.rowCount ?? 0) > 0;
  }

  // Comprobar duplicado (periodo + plan + grupo)
  async existeGrupoDuplicado(id_periodo: string, id_plan: string, grupo: string): Promise<boolean> {
    const consulta = `
      SELECT 1 FROM oferta_academica 
      WHERE id_periodo = $1 AND id_plan = $2 AND grupo = $3
    `;
    const resultado = await pool.query(consulta, [id_periodo, id_plan, grupo]);
    return (resultado.rowCount ?? 0) > 0;
  }

  // Crear nueva oferta académica
  async crearOferta(datos: CrearOfertaAcademicaDTO): Promise<OfertaAcademica> {
    const consulta = `
      INSERT INTO oferta_academica (id_periodo, id_plan, cupo)
      VALUES ($1, $2, $3)
      RETURNING id_oferta, id_periodo, id_plan, grupo, cupo
    `;
    const valores = [datos.id_periodo, datos.id_plan, datos.cupo];
    const resultado = await pool.query(consulta, valores);
    const fila = resultado.rows[0];
    return new OfertaAcademica(
      fila.id_oferta,
      fila.id_periodo,
      fila.id_plan,
      fila.grupo,
      fila.cupo
    );
  }

//istar todas las ofertas académicas
  async listarOfertas(): Promise<any[]> {
    const query = `
      SELECT 
        oa.id_oferta,
        oa.grupo,
        oa.cupo,
        pa.descripcion AS periodo,
        prog.nombre AS programa,
        asig.nombre AS asignatura
      FROM oferta_academica oa
      JOIN periodo_academico pa ON pa.id_periodo = oa.id_periodo
      JOIN plan_estudio pl ON pl.id_plan = oa.id_plan
      JOIN programa_academico prog ON prog.id_programa = pl.id_programa
      JOIN asignatura asig ON asig.id_asignatura = pl.id_asignatura
      ORDER BY CAST(SUBSTRING(oa.id_oferta FROM 3) AS INTEGER);
    `;
    const resultado = await pool.query(query);
    return resultado.rows;
  }
}

