import { IOfertaAcademica } from "./IOfertaAcademica.js";

export class OfertaAcademica implements IOfertaAcademica {
  id_oferta?: string;
  id_periodo: string;
  id_plan: string;
  grupo: string;
  cupo: number;

  constructor(datos: IOfertaAcademica) {
    this.id_oferta = datos.id_oferta;
    this.id_periodo = datos.id_periodo;
    this.id_plan = datos.id_plan;
    this.grupo = datos.grupo;
    this.cupo = datos.cupo;
  }
}
