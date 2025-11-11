import { CrearOfertaAcademicaDTO } from "../dtos/OfertaAcademicaDTO";
import { OfertaAcademica } from "../entidades/OfertaAcademica";

export interface IOfertaAcademicaRepositorio {
  buscarPeriodo(id_periodo: string): Promise<{ existe: boolean; estado?: string }>;
  buscarPlan(id_plan: string): Promise<boolean>;
  existeGrupoDuplicado(id_periodo: string, id_plan: string): Promise<boolean>;
  crearOferta(datos: CrearOfertaAcademicaDTO): Promise<OfertaAcademica>;
  listarOfertas(): Promise<CrearOfertaAcademicaDTO[]>;
  eliminarOferta(id_oferta: string): Promise<void>;
  actualizarOferta(id_oferta: string, datos: { id_periodo?: string | null; id_plan?: string | null; cupo?: number | null }): Promise<void>;
  buscarPorId(id_oferta: string): Promise<OfertaAcademica | null>;


}
