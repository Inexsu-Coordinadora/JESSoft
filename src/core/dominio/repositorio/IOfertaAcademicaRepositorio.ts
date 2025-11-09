
import { CrearOfertaAcademicaDTO } from "../dtos/OfertaAcademicaDTO";
import { OfertaAcademica } from "../entidades/OfertaAcademica";

export interface IOfertaAcademicaRepositorio {
  buscarPeriodo(id_periodo: string): Promise<{ existe: boolean; estado?: string }>;

  buscarPlan(id_plan: string): Promise<boolean>;

  existeGrupoDuplicado(
    id_periodo: string,
    id_plan: string,
    grupo: string
  ): Promise<boolean>;

  crearOferta(datos: CrearOfertaAcademicaDTO): Promise<OfertaAcademica>;

  listarOfertas(): Promise<OfertaAcademicaExtendidaDTO[]>;
}


