import { IPlanEstudioCasosUso } from "../repositorio-casos-uso/IPlanEstudioCasoUso";
import { IPlanEstudioRepositorio } from "../../dominio/repositorio/IPlanEstudioRepositorio";
import { PlanEstudio } from "../../dominio/entidades/PlanEstudio";
import { PlanEstudioDTO } from "../../../presentation/esquemas/PlanDeEstudioEsquema";

export class PlanEstudioCasosUso implements IPlanEstudioCasosUso {
    private planEstudioRepositorio: IPlanEstudioRepositorio;
    constructor(planEstudioRepositorio: IPlanEstudioRepositorio) {
        this.planEstudioRepositorio = planEstudioRepositorio;
    }

    async obtenerTodos(): Promise<PlanEstudio[]> {
        return this.planEstudioRepositorio.obtenerTodos();
    }

    async obtenerPorId(id: string): Promise<PlanEstudio | null> {
        return this.planEstudioRepositorio.obtenerPorId(id);
    }

    async crear(dto: PlanEstudioDTO): Promise<String> {
        const planEstudio = new PlanEstudio(
            "",
            dto.id_asignatura,
            dto.id_programa,
            dto.semestre
        );
        const idNuevoPlanEstudio = await this.planEstudioRepositorio.crear(planEstudio);
        return idNuevoPlanEstudio;
    }
    
    async eliminar(id: string): Promise<void> {
        return this.planEstudioRepositorio.eliminar(id);
    }

    async actualizar(dto: PlanEstudioDTO, id: string): Promise<PlanEstudioDTO> {
        const planEstudio = new PlanEstudio(
            id,
            dto.id_asignatura,
            dto.id_programa,
            dto.semestre
        );
        await this.planEstudioRepositorio.actualizar(planEstudio);
        return dto;
    }
}
