
export class OfertaAcademica {
  id_oferta: string;
  id_periodo: string;
  id_plan: string;
  grupo: string;
  cupo: number;

  constructor(
    id_oferta: string,
    id_periodo: string,
    id_plan: string,
    grupo: string,
    cupo: number
  ) {
    this.id_oferta = id_oferta;
    this.id_periodo = id_periodo;
    this.id_plan = id_plan;
    this.grupo = grupo;
    this.cupo = cupo;
  }
}
