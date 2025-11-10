export class PlanEstudio {

    private id_programaAcademico: string;
    private id_asignatura: string;
    private semestre: number;

    constructor(
        id_programaAcademico: string,
        id_asignatura: string,
        semestre: number,
    ) {
        this.id_programaAcademico = id_programaAcademico;
        this.id_asignatura = id_asignatura;
        this.semestre = semestre;
    }

    getidProgramaAcademico(): string {
        return this.id_programaAcademico;
    }
    getidAsignatura(): string {
        return this.id_asignatura;
    }
    getSemestre(): number {
        return this.semestre;
    }

}