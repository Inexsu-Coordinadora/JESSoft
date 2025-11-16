import { ejecutarConsulta } from "./ConexionPostgres.js";
import { IOfertaAcademicaRepositorio } from "../../dominio/repositorio/IOfertaAcademicaRepositorio.js";
import { IOfertaAcademica } from "../../dominio/entidades/IOfertaAcademica.js";

export class OfertaAcademicaRepositorioPostgres implements IOfertaAcademicaRepositorio {

  // Crear oferta académica
  async crearOferta(datos: IOfertaAcademica): Promise<string> {
    const columnas = Object.keys(datos).map((key) => key.toLowerCase());
    const parametros = Object.values(datos);
    const placeholders = columnas.map((_, i) => `$${i + 1}`).join(", ");

    const query = `
      INSERT INTO oferta_academica (${columnas.join(", ")})
      VALUES (${placeholders})
      RETURNING *
    `;

    const result = await ejecutarConsulta(query, parametros);
    return result.rows[0].id_oferta;
  }

  // Listar ofertas académicas 
  async listarOfertas(limite?: number): Promise<IOfertaAcademica[]> {
    let query = "SELECT * FROM oferta_academica";
    const valores: any[] = [];

    if (limite !== undefined) {
      query += " LIMIT $1";
      valores.push(limite);
    }

    const result = await ejecutarConsulta(query, valores);
    return result.rows;
  }

  // Obtener oferta por ID 
  async obtenerOfertaPorId(id_oferta: string): Promise<IOfertaAcademica | null> {
    const query = `
      SELECT *
      FROM oferta_academica
      WHERE id_oferta = $1
    `;
    const result = await ejecutarConsulta(query, [id_oferta]);
    return result.rows[0] || null;
  }

  // Actualizar oferta 
  async actualizarOferta(id_oferta: string, datos: IOfertaAcademica): Promise<IOfertaAcademica | null> {
    const columnas = Object.keys(datos).map((key) => key.toLowerCase());
    const parametros = Object.values(datos);
    const setClause = columnas.map((col, i) => `${col}=$${i + 1}`).join(", ");

    parametros.push(id_oferta);

    const query = `
      UPDATE oferta_academica
      SET ${setClause}
      WHERE id_oferta = $${parametros.length}
      RETURNING *
    `;

    const result = await ejecutarConsulta(query, parametros);
    return result.rows[0] || null;
  }

  // Eliminar oferta 
  async eliminarOferta(id_oferta: string): Promise<void> {
    const query = `
      DELETE FROM oferta_academica
      WHERE id_oferta = $1
    `;
    await ejecutarConsulta(query, [id_oferta]);
  }
}

