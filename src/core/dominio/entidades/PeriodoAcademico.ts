import { IPeriodoAcademico } from "./IPeriodoAcademico";

export class PeriodoAcademico implements IPeriodoAcademico {
    fecha_inicio: Date;
    fecha_fin: Date;
    estado: 'activo' | 'cerrado' | 'en preparacion';
    descripcion: string;

    constructor(datosPeriodoAcademico: IPeriodoAcademico) {
        this.fecha_inicio = datosPeriodoAcademico.fecha_inicio;
        this.fecha_fin = datosPeriodoAcademico.fecha_fin;
        this.estado = datosPeriodoAcademico.estado;
        this.descripcion = datosPeriodoAcademico.descripcion;
    }
}