import { IOfertaAcademica } from "../entidades/IOfertaAcademica";

export interface IOfertaAcademicaRepositorio {
  crearOferta(datos: IOfertaAcademica): Promise<string>;
  listarOfertas(limite?: number): Promise<IOfertaAcademica[]>;
  obtenerOfertaPorId(id_oferta: string): Promise<IOfertaAcademica | null>;
  actualizarOferta(id_oferta: string, datos: IOfertaAcademica): Promise<IOfertaAcademica | null>;
  eliminarOferta(id_oferta: string): Promise<void>;
}
