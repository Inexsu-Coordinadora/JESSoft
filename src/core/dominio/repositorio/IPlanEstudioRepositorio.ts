import { PlanEstudio } from "../entidades/PlanEstudio";
import { PlanEstudioDTO } from "../../../presentation/esquemas/PlanDeEstudioEsquema";

export interface IPlanEstudioRepositorio {
    obtenerTodos(): Promise<PlanEstudio[]>;
    obtenerPorId(id: string): Promise<PlanEstudio | null>;
    crear(planEstudio: PlanEstudio): Promise<String>;
    eliminar(id: string): Promise<void>;
    actualizar(planEstudio: PlanEstudio): Promise<void>;
}
