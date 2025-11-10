import { IPlanEstudio } from "../entidades/IPlanEstudio";
import { PlanEstudio } from "../entidades/PlanEstudio";

export interface IPlanEstudioRepositorio {
    crearPlanEstudio(plan: PlanEstudio): Promise<string>;
    obtenerTodo(limite?: number): Promise<IPlanEstudio[]>;
    obtenerPorId(id_plan: string): Promise<IPlanEstudio | null>;
    actualizarPlan(id_plan: string, plan: IPlanEstudio): Promise<IPlanEstudio | null>;
    eliminarPlan(id_plan: string): Promise<void>;

    buscarPorProgramaYAsignatura(id_programa: string, id_asignatura: string, semestre: number): Promise<IPlanEstudio | null>;
    existePrograma(id_programa: string): Promise<Boolean>;
    existeAsignatura(id_asignatura: string): Promise<Boolean>;
}
