export class Asignatura {
  private id: string;
  private nombre: string;
  private creditos: number;
  private carga_horaria: number;
  private tipo: string;
  private descripcion: string;

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

  // Getters
  public getId(): string {
    return this.id;
  }
  

  public getNombre(): string {
    return this.nombre;
  }

  public getCreditos(): number {
    return this.creditos;
  }

  public getCarga_horaria(): number {
    return this.carga_horaria;
  }

  public getTipo(): string {
    return this.tipo;
  }

  public getDescripcion(): string {
    return this.descripcion;
  }

  // Setters
  public setNombre(nombre: string): void {
    this.nombre = nombre;
  }

  public setCreditos(creditos: number): void {
    this.creditos = creditos;
  }

  public setCarga_horaria(carga_horaria: number): void {
    this.carga_horaria = carga_horaria;
  }

  public setTipo(tipo: string): void {
    this.tipo = tipo;
  }

  public setDescripcion(descripcion: string): void {
    this.descripcion = descripcion;
  }
}
