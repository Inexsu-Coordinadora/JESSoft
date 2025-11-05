export class AsignaturaDTO {
  constructor(
    public id: string,
    public nombre: string,
    public creditos: number,
    public carga_horaria: number,
    public tipo: string,
    public descripcion: string
  ) {}
}
