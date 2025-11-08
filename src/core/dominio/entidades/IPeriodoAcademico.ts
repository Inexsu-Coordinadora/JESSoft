export interface IPeriodoAcademico {
    id_periodo?: string,
    fecha_inicio: Date,
    fecha_fin: Date,
    estado: 'activo' | 'cerrado' | 'en preparacion',
    descripcion: string;
}
