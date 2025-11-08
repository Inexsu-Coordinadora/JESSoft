export interface IProgramaAcademico{
    id_pa? : string,
    nombre : string,
    informacion : string,
    nivel_educativo : string,
    duracion : string,
    modalidad : 'Presencial' | 'Virtual' | 'Distancia';
}