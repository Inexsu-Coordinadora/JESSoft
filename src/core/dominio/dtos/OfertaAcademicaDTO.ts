//Crear oferta
export class CrearOfertaAcademicaDTO {
  id_oferta:string;
  id_periodo: string;
  id_plan: string;
  cupo: number;
  grupo?: string; 

  constructor (
    id_oferta: string,
    id_periodo: string,
    id_plan: string,
    cupo: number,
    grupo?: string
  ) {
    this.id_oferta = id_oferta
    this.id_periodo = id_periodo;
    this.id_plan = id_plan;
    this.cupo = cupo;
    if (grupo) {
      this.grupo = grupo;
    }
  }
}



//Listar ofertas

export interface OfertaAcademicaExtendidaDTO {
  id_oferta: string;
  id_periodo: string;
  id_plan: string;
  grupo: string;
  cupo: number;
  periodo: string;
  programa: string;
  asignatura: string;
}
