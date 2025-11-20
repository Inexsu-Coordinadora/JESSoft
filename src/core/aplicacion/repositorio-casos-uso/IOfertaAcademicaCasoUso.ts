import { IOfertaAcademica } from "../../dominio/entidades/IOfertaAcademica.js";
import { OfertaAcademicaDTO } from "../../../presentation/esquemas/OfertaAcademicaEsquema.js";

export interface IOfertaAcademicaCasoUso {
    crearOferta(datos: OfertaAcademicaDTO): Promise<string>;
    listarOfertas(limite?: number): Promise<IOfertaAcademica[]>;
    obtenerOfertaPorId(id_oferta: string): Promise<IOfertaAcademica | null>;
    actualizarOferta(id_oferta: string, datos: IOfertaAcademica): Promise<IOfertaAcademica | null>;
    eliminarOferta(id_oferta: string): Promise<void>;
}

