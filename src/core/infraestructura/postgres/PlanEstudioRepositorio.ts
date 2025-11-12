import { PlanEstudio } from "../../dominio/entidades/PlanEstudio";
import { IPlanEstudioRepositorio } from "../../dominio/repositorio/IPlanEstudioRepositorio";
import { pool } from "./ConexionPostgres";

export class PlanEstudioRepositorio implements IPlanEstudioRepositorio {

    async crear(planEstudio: PlanEstudio): Promise<String> {
        const queryBuscarId = `SELECT * FROM plan_estudio WHERE id_plan = $1`;
        const queryBuscarPlanEstudio = `SELECT * FROM plan_estudio WHERE id_asignatura = $1 AND id_programa = $2 AND semestre = $3`;
        const queryBuscarAsignatura_Programa = `SELECT * FROM plan_estudio WHERE id_asignatura = $1 AND id_programa = $2`;
        const resultBuscarPlanEstudio = await pool.query(queryBuscarPlanEstudio, [
            planEstudio.getIdAsignatura(),
            planEstudio.getIdPrograma(),
            planEstudio.getSemestre(),
        ]);
        if (resultBuscarPlanEstudio.rows.length > 0) {
            throw new Error("Ya existe un plan de estudio con esos datos.");
        }

        const resultBuscarAsignatura_Programa = await pool.query(queryBuscarAsignatura_Programa, [
            planEstudio.getIdAsignatura(),
            planEstudio.getIdPrograma(),
        ]);
        if (resultBuscarAsignatura_Programa.rows.length > 0) {
            throw new Error("Ya existe un plan de estudio para esa asignatura en ese programa.");
        }
        const resultBuscar = await pool.query(queryBuscarId, [
            planEstudio.getIdPlan(),
        ]);
        if (resultBuscar.rows.length > 0) {
            throw new Error("Ya existe un plan de estudio con ese ID.");
        }
        const query = `
        INSERT INTO plan_estudio (id_asignatura, id_programa, semestre)
        VALUES ($1, $2, $3)
        `;
        await pool.query(query, [
            planEstudio.getIdAsignatura(),
            planEstudio.getIdPrograma(),
            planEstudio.getSemestre(),
        ]);
        return planEstudio.getIdPlan();
    }

    async obtenerTodos(): Promise<PlanEstudio[]> {
        const result = await pool.query("SELECT * FROM plan_estudio");
        return result.rows.map(
            (row) =>
                new PlanEstudio(
                    row.id_plan,
                    row.id_asignatura,
                    row.id_programa,
                    row.semestre
                )
        );
    }

    async obtenerPorId(id: string): Promise<PlanEstudio | null> {
        const result = await pool.query(
            "SELECT * FROM plan_estudio WHERE id_plan = $1",
            [id]
        );
        const row = result.rows[0];
        if (!row) return null;

        return new PlanEstudio(
            row.id_plan,
            row.id_asignatura,
            row.id_programa,
            row.semestre
        );
    }

    async eliminar(id: string): Promise<void> {

        const buscarId = `SELECT * FROM plan_estudio WHERE id_plan = $1`;
        const resultBuscar = await pool.query(buscarId, [id]);
        if (resultBuscar.rows.length === 0) {
            throw new Error("No existe un plan de estudio con ese ID.");
        }
        await pool.query("DELETE FROM plan_estudio WHERE id_plan = $1", [
            id,
        ]);
    }

    async actualizar(planEstudio: PlanEstudio): Promise<void> {
        const queryBuscarPlanEstudio = `SELECT * FROM plan_estudio WHERE id_asignatura = $1 AND id_programa = $2 AND semestre = $3`;
        const queryBuscarAsignatura_Programa = `SELECT * FROM plan_estudio WHERE id_asignatura = $1 AND id_programa = $2`;
        const resultBuscarPlanEstudio = await pool.query(queryBuscarPlanEstudio, [
            planEstudio.getIdAsignatura(),
            planEstudio.getIdPrograma(),
            planEstudio.getSemestre(),
        ]);
        if (resultBuscarPlanEstudio.rows.length > 0) {
            throw new Error("Ya existe un plan de estudio con esos datos.");
        }

        const resultBuscarAsignatura_Programa = await pool.query(queryBuscarAsignatura_Programa, [
            planEstudio.getIdAsignatura(),
            planEstudio.getIdPrograma(),
        ]);

        if (resultBuscarAsignatura_Programa.rows.length > 0) {
            throw new Error("Ya existe un plan de estudio para esa asignatura en ese programa.");
        }
        const query = `
      UPDATE plan_estudio
      SET id_asignatura = $1, id_programa = $2, semestre = $3
      WHERE id_plan = $4
    `;
        await pool.query(query, [
            planEstudio.getIdAsignatura(),
            planEstudio.getIdPrograma(),
            planEstudio.getSemestre(),
            planEstudio.getIdPlan(),
        ]);
    }
}