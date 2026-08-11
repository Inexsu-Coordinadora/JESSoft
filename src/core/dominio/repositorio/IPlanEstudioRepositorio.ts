import { PlanEstudio } from "../entidades/PlanEstudio";
export interface IPlanEstudioRepositorio {

    obtenerTodos(): Promise<PlanEstudio[]>;
    obtenerPorId(id: string): Promise<PlanEstudio | null>;
    crear(planEstudio: PlanEstudio): Promise<String>;
    eliminar(id: string): Promise<void>;
    actualizar(planEstudio: PlanEstudio): Promise<void>;
}
