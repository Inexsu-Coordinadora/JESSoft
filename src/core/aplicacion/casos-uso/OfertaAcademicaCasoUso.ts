import { IOfertaAcademicaRepositorio } from "../../dominio/repositorio/IOfertaAcademicaRepositorio.js";
import { IOfertaAcademica } from "../../dominio/entidades/IOfertaAcademica.js";

export class OfertaAcademicaCasoUso {
    constructor(private ofertaRepositorio: IOfertaAcademicaRepositorio) {}

    // Crear oferta
    async crearOferta(datos: IOfertaAcademica): Promise<string> {
        const idNuevaOferta = await this.ofertaRepositorio.crearOferta(datos);
        return idNuevaOferta;
    }

    // Listar ofertas
    async listarOfertas(limite?: number) {
        return await this.ofertaRepositorio.listarOfertas(limite);
    }

    // Obtener oferta por id
    async obtenerOfertaPorId(id_oferta: string) {
        const oferta = await this.ofertaRepositorio.obtenerOfertaPorId(id_oferta);
        return oferta;
    }

    // Actualizar oferta
    async actualizarOferta(id_oferta: string, datos: IOfertaAcademica) {
        const ofertaActualizada =
            await this.ofertaRepositorio.actualizarOferta(id_oferta, datos);
        return ofertaActualizada;
    }

    // Eliminar oferta
    async eliminarOferta(id_oferta: string): Promise<void> {
        await this.ofertaRepositorio.eliminarOferta(id_oferta);
    }
}
