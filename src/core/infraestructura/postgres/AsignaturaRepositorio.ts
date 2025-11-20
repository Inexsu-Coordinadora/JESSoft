import { Asignatura } from "../../dominio/entidades/Asignatura.js";
import { IAsignaturaRepositorio } from "../../dominio/repositorio/IAsignaturaRepositorio.js";
import { pool } from "./ConexionPostgres.js"; // tu conexión

export class AsignaturaRepositorio implements IAsignaturaRepositorio {
    async obtenerTodas(): Promise<Asignatura[]> {
        const result = await pool.query("SELECT * FROM asignatura");
        return result.rows.map(
            (row) =>
                new Asignatura(
                    row.id_asignatura,
                    row.nombre,
                    row.creditos,
                    row.carga_horaria,
                    row.tipo,
                    row.descripcion
                )
        );
    }

    async obtenerPorId(id: string): Promise<Asignatura | null> {
        const result = await pool.query(
            "SELECT * FROM asignatura WHERE id_asignatura = $1",
            [id]
        );
        const row = result.rows[0];
        if (!row) return null;

        return new Asignatura(
            row.id_asignatura,
            row.nombre,
            row.creditos,
            row.carga_horaria,
            row.tipo,
            row.descripcion
        );
    }

    async crear(asignatura: Asignatura): Promise<void> {
        const queryBuscarNombre = `SELECT * FROM asignatura WHERE nombre = $1`;
        const resultBuscar = await pool.query(queryBuscarNombre, [
            asignatura.nombre,
        ]);
        if (resultBuscar.rows.length > 0) {
            throw new Error("Ya existe una asignatura con ese nombre.");
        }
        const query = `
      INSERT INTO asignatura (nombre, creditos, carga_horaria, tipo, descripcion)
      VALUES ($1, $2, $3, $4, $5)
    `;
        await pool.query(query, [
            asignatura.nombre,
            asignatura.creditos,
            asignatura.carga_horaria,
            asignatura.tipo,
            asignatura.descripcion,
        ]);
    }

    async eliminar(id: string): Promise<void> {
        const queryBuscarId = `SELECT * FROM asignatura WHERE id_asignatura = $1`;
        const resultBuscar = await pool.query(queryBuscarId, [
            id,
        ]);
        if (resultBuscar.rows.length === 0) {
             return Promise.reject(new Error("No existe una asignatura con ese ID."));
        }
        await pool.query("DELETE FROM asignatura WHERE id_asignatura = $1", [id]);
        return;
    }

    async actualizar(asignatura: Asignatura, id: string): Promise<void> {
        const queryBuscarId = `SELECT * FROM asignatura WHERE id_asignatura = $1`;
        const resultBuscar = await pool.query(queryBuscarId, [
            id,
        ]);
        if (resultBuscar.rows.length === 0) {
             return Promise.reject(new Error("No existe una asignatura con ese ID."));
        }
        const query = `
      UPDATE asignatura
      SET nombre = $1,
          creditos = $2,
          carga_horaria = $3,
          tipo = $4,
          descripcion = $5
      WHERE id_asignatura = $6
      RETURNING *;
    `;

        const values = [
            asignatura.nombre,
            asignatura.creditos,
            asignatura.carga_horaria,
            asignatura.tipo,
            asignatura.descripcion,
            id,
        ];

        const result = await pool.query(query, values);
        return result.rows[0]; // Devuelve la asignatura actualizada
    }
}
