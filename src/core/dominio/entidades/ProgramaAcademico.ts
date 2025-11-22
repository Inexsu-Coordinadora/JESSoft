import { IProgramaAcademico } from "./IProgramaAcademico"; 

export class ProgramaAcademico implements IProgramaAcademico{
    nombre : string;
    informacion : string;
    nivel_educativo : string;
    duracion : string;
    modalidad : 'Presencial' | 'Virtual' | 'Distancia';

    constructor(datosProgramaAcademico : IProgramaAcademico){
        this.nombre = datosProgramaAcademico.nombre;
        this.informacion = datosProgramaAcademico.informacion;
        this.nivel_educativo = datosProgramaAcademico.nivel_educativo;
        this.duracion = datosProgramaAcademico.duracion;
        this.modalidad = datosProgramaAcademico.modalidad;
    }
}