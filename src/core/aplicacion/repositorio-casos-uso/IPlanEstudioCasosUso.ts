import { PlanEstudio } from "../../dominio/entidades/PlanEstudio";
import { PlanEstudioDTO } from "../../../presentation/esquemas/PlanDeEstudioEsquema";

export interface IPlanEstudioCasosUso {

    obtenerTodos(): Promise<PlanEstudio[]>;
    obtenerPorId(id: string): Promise<PlanEstudio | null>;
    crear(planEstudioDto: PlanEstudioDTO): Promise<String>;
    eliminar(id: string): Promise<void>;
    actualizar(planEstudioDto: PlanEstudioDTO, id: string): Promise<PlanEstudioDTO>;
}
