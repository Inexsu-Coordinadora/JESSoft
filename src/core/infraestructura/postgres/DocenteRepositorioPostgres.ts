import { IDocenteRepositorio } from "../../dominio/repositorio/IDocenteRepositorio";
import { ejecutarConsulta } from "./ConexionPostgres";
import { IDocente } from "../../dominio/entidades/IDocente";

export class DocenteRepositorioPostgres implements IDocenteRepositorio {
  async crearDocente(datosDocente: IDocente): Promise<string> {
  const columnas = Object.keys(datosDocente).map((key) => key.toLowerCase());
  const parametros: Array<string | number> = Object.values(datosDocente);
  const placeholders = columnas.map((_, i) => `$${i + 1}`).join(", ");

  const query = `
    INSERT INTO docente (${columnas.join(", ")})
    VALUES (${placeholders})
    RETURNING *
  `;

  try {
    const respuesta = await ejecutarConsulta(query, parametros);
    return respuesta.rows[0].id_docente;

  } catch (error: any) {
    if (error.code === "23505") {
      throw new Error("CEDULA_YA_EXISTE");
    }

    throw error;
  }
}


  async listarDocentes(limite?: number): Promise<IDocente[]> {
    let query = "SELECT * FROM docente ORDER BY id_docente ASC";
    const valores: number[] = [];

    if (limite !== undefined) {
      query += " LIMIT $1";
      valores.push(limite);
    }

    const result = await ejecutarConsulta(query, valores);
    return result.rows;
  }

  async obtenerDocentePorId(id_docente: string): Promise<IDocente | null> {
    const query = "SELECT * FROM docente WHERE id_docente = $1";
    const result = await ejecutarConsulta(query, [id_docente]);
    return result.rows[0] || null;
  }

  async actualizarDocente(id_docente: string, datosDocente: IDocente): Promise<IDocente | null> {
    const columnas = Object.keys(datosDocente).map((key) => key.toLowerCase());
    const parametros = Object.values(datosDocente);
    const setClause = columnas.map((col, i) => `${col}=$${i + 1}`).join(", ");
    parametros.push(id_docente);

    const query = `
      UPDATE docente
      SET ${setClause}
      WHERE id_docente=$${parametros.length}
      RETURNING *;
    `;

    const result = await ejecutarConsulta(query, parametros);
    return result.rows[0] || null;
  }

  async eliminarDocente(id_docente: string): Promise<void> {
  const result = await ejecutarConsulta(
    "DELETE FROM docente WHERE id_docente = $1",
    [id_docente]
  );
  if (result.rowCount === 0) {
    throw new Error("DOCENTE_NO_ENCONTRADO");
  }
}
}
