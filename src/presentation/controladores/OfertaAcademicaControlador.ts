import { FastifyRequest, FastifyReply } from "fastify";
import { IOfertaAcademica } from "../../core/dominio/entidades/IOfertaAcademica.js";
import { IOfertaAcademicaCasoUso } from "../../core/aplicacion/repositorio-casos-uso/IOfertaAcademicaCasoUso.js";
import { OfertaAcademicaDTO, EsquemaOfertaAcademica } from "../esquemas/OfertaAcademicaEsquema.js";
import { ZodError } from "zod";


export class OfertaAcademicaControlador {
  constructor(private ofertaCasoUso: IOfertaAcademicaCasoUso) {}

  // Listar ofertas
  listarOfertas = async (
    request: FastifyRequest<{ Querystring: { limite?: number } }>,
    reply: FastifyReply
  ) => {
    try {
      const { limite } = request.query;
      const ofertas = await this.ofertaCasoUso.listarOfertas(limite);

      return reply.code(200).send({
        mensaje: "Ofertas encontradas correctamente",
        ofertas,
        cantidad: ofertas.length,
      });
    } catch (err) {
      return reply.code(500).send({
        mensaje: "Error al listar las ofertas académicas",
        error: err instanceof Error ? err.message : err,
      });
    }
  };

  // Obtener oferta por ID
  obtenerOfertaPorId = async (
    request: FastifyRequest<{ Params: { id_oferta: string } }>,
    reply: FastifyReply
  ) => {
    try {
      const { id_oferta } = request.params;
      const oferta = await this.ofertaCasoUso.obtenerOfertaPorId(id_oferta);

      if (!oferta) {
        return reply.code(404).send({ mensaje: "Oferta académica no encontrada" });
      }

      return reply.code(200).send({
        mensaje: "Oferta encontrada correctamente",
        oferta,
      });
    } catch (err) {
      return reply.code(500).send({
        mensaje: "Error al obtener la oferta académica",
        error: err instanceof Error ? err.message : err,
      });
    }
  };

  // Crear oferta
  crearOferta = async (
    request: FastifyRequest<{ Body: OfertaAcademicaDTO }>,
    reply: FastifyReply
  ) => {
    try {
      const datosValidados = EsquemaOfertaAcademica.parse(request.body);
      const idNueva = await this.ofertaCasoUso.crearOferta(datosValidados);

      return reply.code(201).send({
        mensaje: "Oferta académica creada correctamente",
        id_oferta: idNueva,
      });
    } catch (err) {
      if (err instanceof ZodError) {
        return reply.code(400).send({
          mensaje: "Error de validación",
          error: err.issues?.[0]?.message || "Datos inválidos",
        });
      }

      return reply.code(500).send({
        mensaje: "Error al crear la oferta académica",
        error: err instanceof Error ? err.message : err,
      });
    }
  };

  // Actualizar oferta
  actualizarOferta = async (
    request: FastifyRequest<{ Params: { id_oferta: string }; Body: OfertaAcademicaDTO }>,
    reply: FastifyReply
  ) => {
    try {
      const { id_oferta } = request.params;
      const datosValidados = EsquemaOfertaAcademica.parse(request.body);
      const ofertaActualizada = await this.ofertaCasoUso.actualizarOferta(id_oferta, datosValidados);
      
      if (!ofertaActualizada) {
        return reply.code(404).send({ mensaje: "Oferta académica no encontrada" });
      }

      return reply.code(200).send({
        mensaje: "Oferta académica actualizada correctamente",
        ofertaActualizada,
      });
    } catch (err) {
      if (err instanceof ZodError) {
        return reply.code(400).send({
          mensaje: "Error de validación",
          error: err.issues?.[0]?.message || "Datos inválidos",
        });
      }

      return reply.code(500).send({
        mensaje: "Error al actualizar la oferta académica",
        error: err instanceof Error ? err.message : err,
      });
    }
  };

  // Eliminar oferta
  eliminarOferta = async (
    request: FastifyRequest<{ Params: { id_oferta: string } }>,
    reply: FastifyReply
  ) => {
    try {
      const { id_oferta } = request.params;
      await this.ofertaCasoUso.eliminarOferta(id_oferta);

      return reply.code(200).send({
        mensaje: "Oferta académica eliminada correctamente",
        id_oferta,
      });
    } catch (err) {
      return reply.code(500).send({
        mensaje: "Error al eliminar la oferta académica",
        error: err instanceof Error ? err.message : err,
      });
    }
  };
}
