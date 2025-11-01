import { pool } from './ConexionPostgres';
import { Docente } from '../../dominio/entidades/Docente';
import { DocenteRepositorio } from '../../dominio/repositorio/DocenteRepositorio';

export class DocenteRepositorioPostgres implements DocenteRepositorio {
  async crear(docente: Docente): Promise<void> {
    const query = `
      INSERT INTO docente (
        documento_identidad, nombre, primer_apellido, segundo_apellido,
        especialidad, vinculacion, correo_institucional, fecha_ingreso
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,now())
    `;
    const values = [
      docente.documento_identidad,
      docente.nombre,
      docente.primer_apellido,
      docente.segundo_apellido ?? null,
      docente.especialidad,
      docente.vinculacion,
      docente.correo_institucional ?? null,
    ];
    await pool.query(query, values);
  }

  async listar(): Promise<Docente[]> {
    const { rows } = await pool.query('SELECT * FROM docente ORDER BY id_docente');
    return rows;
  }

  async actualizar(id: string, docente: Docente): Promise<void> {
    const query = `
      UPDATE docente
      SET nombre=$1, primer_apellido=$2, segundo_apellido=$3,
          especialidad=$4, vinculacion=$5, correo_institucional=$6
      WHERE id_docente=$7
    `;
    const values = [
      docente.nombre,
      docente.primer_apellido,
      docente.segundo_apellido ?? null,
      docente.especialidad,
      docente.vinculacion,
      docente.correo_institucional ?? null,
      id,
    ];
    await pool.query(query, values);
  }

  async eliminar(id: string): Promise<void> {
    await pool.query('DELETE FROM docente WHERE id_docente=$1', [id]);
  }
}
