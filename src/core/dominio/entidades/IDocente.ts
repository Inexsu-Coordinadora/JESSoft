export interface IDocente {
  id_docente?: string | undefined;
  cedula: string;
  nombre: string;
  apellido: string;
  especialidad: string;
  vinculacion: "Tiempo completo" | "Catedra" | "Medio tiempo";
}
