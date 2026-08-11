import { IAsignatura } from "./IAsignatura";

export class Asignatura implements IAsignatura {
  id: string;
  nombre: string;
  creditos: number;
  carga_horaria: number;
  tipo: string;
  descripcion: string;

  constructor(
    id: string,
    nombre: string,
    creditos: number,
    carga_horaria: number,
    tipo: string,
    descripcion: string
  ) {
    this.id = id;
    this.nombre = nombre;
    this.creditos = creditos;
    this.carga_horaria = carga_horaria;
    this.tipo = tipo;
    this.descripcion = descripcion;
  }
}
