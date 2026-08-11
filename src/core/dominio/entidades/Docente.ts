import { IDocente } from "./IDocente";

export class Docente implements IDocente {
  id_docente: string | undefined;
  cedula: string;
  nombre: string;
  apellido: string;
  especialidad: string;
  vinculacion: "Tiempo completo" | "Catedra" | "Medio tiempo";

  constructor(datosDocente: IDocente) {
    this.id_docente = datosDocente.id_docente;
    this.cedula = datosDocente.cedula;
    this.nombre = datosDocente.nombre;
    this.apellido = datosDocente.apellido;
    this.especialidad = datosDocente.especialidad;
    this.vinculacion = datosDocente.vinculacion;
  }
}
