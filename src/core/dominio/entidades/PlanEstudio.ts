import { IPlanEstudio } from "./IPlanEstudio";

export class PlanEstudio implements IPlanEstudio {
    id_plan: string;
    id_programa: string;
    id_asignatura: string;
    semestre: number;

    constructor(id_plan: string, id_asignatura: string, id_programa: string, semestre: number) {
        this.id_plan = id_plan;
        this.id_asignatura = id_asignatura;
        this.id_programa = id_programa;
        this.semestre = semestre;
    }
}