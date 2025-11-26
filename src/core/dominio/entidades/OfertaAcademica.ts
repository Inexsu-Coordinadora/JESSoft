import { IOfertaAcademica } from "./IOfertaAcademica";

export class OfertaAcademica implements IOfertaAcademica {
  id_oferta?: string | undefined;
  id_periodo: string;
  id_plan: string;
  grupo?: string | undefined;
  cupo: number;

  constructor(datos: IOfertaAcademica) {
    this.id_oferta = datos.id_oferta;
    this.id_periodo = datos.id_periodo;
    this.id_plan = datos.id_plan;
    this.grupo = datos.grupo;
    this.cupo = datos.cupo;
  }
}
