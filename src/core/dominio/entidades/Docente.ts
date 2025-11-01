export interface Docente {
  id_docente?: string;
  documento_identidad: string;
  nombre: string;
  primer_apellido: string;
  segundo_apellido?: string;
  especialidad: string;
  vinculacion: string;
  correo_institucional?: string;
  fecha_ingreso?: Date;
}