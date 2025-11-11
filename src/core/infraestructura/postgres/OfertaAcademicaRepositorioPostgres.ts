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
  async existeGrupoDuplicado(id_periodo: string, id_plan: string): Promise<boolean> {
    const consulta = `
      SELECT 1 FROM oferta_academica 
      WHERE id_periodo = $1 AND id_plan = $2 
    `;
    const resultado = await pool.query(consulta, [id_periodo, id_plan]);
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

// Listar todas las ofertas académicas con datos relacionados
async listarOfertas(): Promise<any[]> {
  const res = await pool.query(
    `SELECT 
        oa.id_oferta,
        oa.id_periodo,
        p.descripcion AS periodo_descripcion,
        p.estado AS periodo_estado,
        oa.id_plan,
        pa.id_programa,
        prog.nombre AS programa_nombre,
        a.nombre AS asignatura_nombre,
        oa.grupo,
        oa.cupo
     FROM oferta_academica oa
     JOIN periodo_academico p ON oa.id_periodo = p.id_periodo
     JOIN plan_estudio pa ON oa.id_plan = pa.id_plan
     JOIN programa_academico prog ON pa.id_programa = prog.id_programa
     JOIN asignatura a ON pa.id_asignatura = a.id_asignatura
     ORDER BY oa.id_oferta ASC`
  );
  return res.rows;
}


  //Eliminar una oferta académica por su id
async eliminarOferta(id_oferta: string): Promise<void> {
  await pool.query(
    "DELETE FROM oferta_academica WHERE id_oferta = $1",
    [id_oferta]
  );
}

async actualizarOferta(
  id_oferta: string,
  datos: { id_periodo?: string | null; id_plan?: string | null; cupo?: number | null }
): Promise<void> {
  await pool.query(
    `UPDATE oferta_academica
     SET 
       id_periodo = COALESCE($1, id_periodo),
       id_plan = COALESCE($2, id_plan),
       cupo = COALESCE($3, cupo)
     WHERE id_oferta = $4`,
    [datos.id_periodo, datos.id_plan, datos.cupo, id_oferta]
  );
}

// Buscar una oferta académica por su id
async buscarPorId(id_oferta: string): Promise<any | null> {
  const res = await pool.query(
    `SELECT 
        oa.id_oferta,
        oa.id_periodo,
        p.descripcion AS periodo_descripcion,
        p.estado AS periodo_estado,
        oa.id_plan,
        pa.id_programa,
        prog.nombre AS programa_nombre,
        a.nombre AS asignatura_nombre,
        oa.grupo,
        oa.cupo
     FROM oferta_academica oa
     JOIN periodo_academico p ON oa.id_periodo = p.id_periodo
     JOIN plan_estudio pa ON oa.id_plan = pa.id_plan
     JOIN programa_academico prog ON pa.id_programa = prog.id_programa
     JOIN asignatura a ON pa.id_asignatura = a.id_asignatura
     WHERE oa.id_oferta = $1
     LIMIT 1`,
    [id_oferta]
  );
  return res.rows.length > 0 ? res.rows[0] : null;
}
}

