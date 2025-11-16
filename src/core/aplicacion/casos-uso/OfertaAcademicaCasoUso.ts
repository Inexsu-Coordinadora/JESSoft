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
    async listarOfertas(limite?: number): Promise<IOfertaAcademica[]> {
        return await this.ofertaRepositorio.listarOfertas(limite);
    }

    // Obtener oferta por id
    async obtenerOfertaPorId(id_oferta: string): Promise<IOfertaAcademica | null> {
        const ofertaObtenida = await this.ofertaRepositorio.obtenerOfertaPorId(id_oferta);
        console.log(ofertaObtenida);
        return ofertaObtenida;
    }

    // Actualizar oferta
    async actualizarOferta(
        id_oferta: string,
        datos: IOfertaAcademica
    ): Promise<IOfertaAcademica | null> {
        if (datos.id_oferta && datos.id_oferta !== id_oferta) {
            throw new Error("No se puede modificar el ID de la oferta académica.");
        }

        const ofertaActualizada = await this.ofertaRepositorio.actualizarOferta(
            id_oferta,
            datos
        );

        return ofertaActualizada || null;
    }

    // Eliminar oferta
    async eliminarOferta(id_oferta: string): Promise<void> {
        await this.ofertaRepositorio.eliminarOferta(id_oferta);
    }
}
