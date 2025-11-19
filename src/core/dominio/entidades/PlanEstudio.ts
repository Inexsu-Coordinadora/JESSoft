export class PlanEstudio {
    private id_plan: String;
    private id_asignatura: String;
    private id_programa: String;
    private semestre: number;

    constructor(id_plan: String, id_asignatura: String, id_programa: String, semestre: number) {
        this.id_plan = id_plan;
        this.id_asignatura = id_asignatura;
        this.id_programa = id_programa;
        this.semestre = semestre;
    }

    public getIdPlan(): String {
        return this.id_plan;
    }

    public getIdAsignatura(): String {
        return this.id_asignatura;
    }

    public getIdPrograma(): String {
        return this.id_programa;
    }

    public getSemestre(): number {
        return this.semestre;
    }

}