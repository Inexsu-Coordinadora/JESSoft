//Crear oferta
export interface CrearOfertaAcademicaDTO {
  id_periodo: string;
  id_plan: string;
  cupo: number;
  grupo?: string; 
}

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
