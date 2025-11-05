export interface Docente {
  id_d?: string; // generado automáticamente por la secuencia y trigger
  cedula: string;
  nombre: string;
  apellido: string;
  especialidad: string;
  vinculacion: 'Tiempo completo' | 'Catedra' | 'Medio tiempo';
}
