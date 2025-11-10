import { planEstudioDTO } from "../../../presentation/esquemas/PlanEstudioEsquema";
import { IPlanEstudio } from "../../dominio/entidades/IPlanEstudio"
import { PlanEstudio } from "../../dominio/entidades/PlanEstudio";
import { IPlanEstudioRepositorio } from "../../dominio/repositorio/IPlanEstudioRepositorio"

export class PlanEstudioCasosUso {
    constructor(private PlanEstudioRepositorio: IPlanEstudioRepositorio) { }

    async crearPlanEstudio(plan: planEstudioDTO): Promise<string> {

        const { id_programa, id_asignatura, semestre } = plan;

        const existePrograma = await this.PlanEstudioRepositorio.existePrograma(id_programa);
        if (!existePrograma) {
            throw new Error("El programa académico no existe");
        }

        const existeAsignatura = await this.PlanEstudioRepositorio.existeAsignatura(id_asignatura);
        if (!existeAsignatura) {
            throw new Error("La asignatura no existe");
        }

        const duplicado = await this.PlanEstudioRepositorio.buscarPorProgramaYAsignatura(
            id_programa, id_asignatura, semestre
        );
        if (duplicado) {
            throw new Error("Ya existe esta asignatura en este programa y en este semestre")
        }

        if (semestre <= 0) {
            throw new Error("El semestre debe ser mayor a 0");
        }

        const nuevoPlan = new PlanEstudio(id_programa, id_asignatura, semestre);

        const idNuevoPlan = await this.PlanEstudioRepositorio.crearPlanEstudio(nuevoPlan);
        return idNuevoPlan;
    }

    async obtenerPlanes(limite?: number): Promise<IPlanEstudio[]> {
        return await this.PlanEstudioRepositorio.obtenerTodo(limite);
    }

    async obtenerPorId(id_plan: string): Promise<IPlanEstudio | null> {
        const planObtenido = await this.PlanEstudioRepositorio.obtenerPorId(id_plan);
        return planObtenido;
    }

    async actualizarPlan(id_plan: string, plan: IPlanEstudio): Promise<IPlanEstudio | null> {
        if (plan.id_plan && plan.id_plan != id_plan) {
            throw new Error("no se puede modificar el ID del plan de estudio");
        }
        const planActualizado = await this.PlanEstudioRepositorio.actualizarPlan(id_plan, plan);
        return planActualizado || null;
    }

    async eliminarPlan(id_plan: string): Promise<void> {
        await this.PlanEstudioRepositorio.eliminarPlan(id_plan);
    }
}