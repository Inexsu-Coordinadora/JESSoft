import { pool } from './ConexionPostgres';
import { IDocenteRepositorio } from '../../dominio/repositorio/IDocenteRepositorio';
import { Docente } from '../../dominio/entidades/Docente';
import { DocenteDTO } from '../../dominio/dtos/DocenteDTO';

export class DocenteRepositorioPostgres implements IDocenteRepositorio {
  // 🔹 Crear docente
  async crear(data: DocenteDTO): Promise<void> {
    const query = `
      INSERT INTO docente (
        cedula, nombre, apellido, especialidad, vinculacion
      )
      VALUES ($1,$2,$3,$4,$5)
    `;
    const values = [
      data.cedula,
      data.nombre,
      data.apellido,
      data.especialidad,
      data.vinculacion,
    ];
    await pool.query(query, values);
  }

  // 🔹 Listar docentes
  async listar(): Promise<Docente[]> {
    const { rows } = await pool.query<Docente>(
      'SELECT id_docente, cedula, nombre, apellido, especialidad, vinculacion FROM docente ORDER BY id_d'
    );
    return rows;
  }
  

  // 🔹 Obtener por ID
  async buscarPorId(id: string): Promise<Docente | null> {
    const { rows } = await pool.query<Docente>(
      `
      SELECT id_docente, cedula, nombre, apellido, especialidad, vinculacion
      FROM docente
      WHERE id_docente = $1
      `,
      [id]
    );
    return rows[0] ?? null;
  }

  // 🔹 Actualizar datos
  async actualizar(id: string, data: DocenteDTO): Promise<void> {
    const query = `
      UPDATE docente
      SET cedula = $1,
          nombre = $2,
          apellido = $3,
          especialidad = $4,
          vinculacion = $5
      WHERE id_docente = $6
    `;

    const values = [
      data.cedula,
      data.nombre,
      data.apellido,
      data.especialidad,
      data.vinculacion,
      id,
    ];

    await pool.query(query, values);
  }

  // 🔹 Eliminar docente
  async eliminar(id: string): Promise<void> {
    const query = `
      DELETE FROM docente
      WHERE id_docente = $1
    `;
    await pool.query(query, [id]);
  }
}


