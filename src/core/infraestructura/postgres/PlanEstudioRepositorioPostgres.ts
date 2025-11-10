import { IPlanEstudioRepositorio } from "../../dominio/repositorio/IPlanEstudioRepositorio";
import { ejecutarConsulta } from "./ConexionPostgres";
import { IPlanEstudio } from "../../dominio/entidades/IPlanEstudio";
import { PlanEstudio } from "../../dominio/entidades/PlanEstudio";

export class PlanEstudioRepositorio implements IPlanEstudioRepositorio {
    async crearPlanEstudio(plan: PlanEstudio): Promise<string> {
        const columnas = Object.keys(plan).map((key) => key.toLowerCase());
        const parametros: Array<string | number> = Object.values(plan);
        const placeholders = columnas.map((_, i) => `$${i + 1}`).join(", ");

        const query = `
            INSERT INTO plan_estudio (${columnas.join(", ")})
            VALUES (${placeholders})
            RETURNING *  
    `;

        const respuesta = await ejecutarConsulta(query, parametros);
        return respuesta.rows[0].id_plan;
    }
    async obtenerTodo(limite?: number): Promise<IPlanEstudio[]> {
        let query = "SELECT * FROM plan_estudio";
        const parametros: number[] = [];

        if (limite !== undefined) {
            query += "LIMIT $1";
            parametros.push(limite);
        }

        const resultado = await ejecutarConsulta(query, parametros);
        return resultado.rows;
    }

    async obtenerPorId(id_plan: string): Promise<IPlanEstudio | null> {
        const query = "SELECT * FROM plan_estudio WHERE id_plan = $1";
        const resultado = await ejecutarConsulta(query, [id_plan]);
        return resultado.rows[0] || null;
    }

    async actualizarPlan(id_plan: string, plan: IPlanEstudio): Promise<IPlanEstudio | null> {
        const columnas = Object.keys(plan).map((key) => key.toLowerCase());
        const parametros = Object.values(plan);
        const setClause = columnas.map((col, i) => `${col} = $${i + 1}`).join(", ");
        parametros.push(id_plan);

        const query = `
      UPDATE plan_estudio
      SET ${setClause}
      WHERE id_plan = $${parametros.length}
      RETURNING *;
    `;

        const result = await ejecutarConsulta(query, parametros);
        return result.rows[0] || null;
    }

    async eliminarPlan(id_plan: string): Promise<void> {
        await ejecutarConsulta("DELETE FROM programa_academico WHERE id_programa = $1", [id_plan])
    }

    async buscarPorProgramaYAsignatura(id_programa: string, id_asignatura: string, semestre: number): Promise<IPlanEstudio | null> {
        const query = `
      SELECT * FROM plan_estudio
      WHERE id_programa = $1 AND id_asignatura = $2 AND semestre = $3;
    `;
        const resultado = await ejecutarConsulta(query, [id_programa, id_asignatura, semestre]);
        return resultado.rows[0] || null;
    }

    async existePrograma(id_programa: string): Promise<Boolean> {
        const query = "SELECT 1 FROM programa_academico WHERE id_programa = $1";
        const resultado = await ejecutarConsulta(query, [id_programa]);
        return (resultado.rowCount ?? 0) > 0;
    }

    async existeAsignatura(id_asignatura: string): Promise<Boolean> {
        const query = "SELECT 1 FROM programa_academico WHERE id_programa = $1";
        const resultado = await ejecutarConsulta(query, [id_asignatura]);
        return (resultado.rowCount ?? 0) > 0;
    }


}
