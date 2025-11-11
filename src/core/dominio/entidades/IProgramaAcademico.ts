export interface IProgramaAcademico{
    id_programa? : string,
    nombre : string,
    informacion : string,
    nivel_educativo : string,
    duracion : string,
    modalidad : 'Presencial' | 'Virtual' | 'Distancia';
}