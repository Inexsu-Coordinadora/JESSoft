export class DocenteDTO {
  cedula: string;
  nombre: string;
  apellido: string;
  especialidad: string;
  vinculacion: 'Tiempo completo' | 'Catedra' | 'Medio tiempo';

  constructor(data: any) {
    this.cedula = data.cedula;
    this.nombre = data.nombre;
    this.apellido = data.apellido;
    this.especialidad = data.especialidad;
    this.vinculacion = data.vinculacion;
  }
}
