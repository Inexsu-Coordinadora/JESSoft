import { IPlanEstudio } from "../../dominio/entidades/IPlanEstudio";
import { planEstudioDTO } from "../../../presentation/esquemas/PlanEstudioEsquema";
export interface IplanEstudioCasosUso{
    crearPlanEstudio(planEstudio: planEstudioDTO): Promise<string>;
    obtenerPlanes(limite?: number):Promise<IPlanEstudio[]>;
    obtenerPorId(id_plan:string): Promise<IPlanEstudio|null>;
    actualizarPlan(id_plan:string, plan: IPlanEstudio): Promise<IPlanEstudio|null>;
    eliminarPlan(id_plan:string):Promise<void>;
   
}

