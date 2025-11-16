import { FastifyReply, FastifyRequest } from "fastify";
import { OfertaAcademicaCasoUso } from "../../core/aplicacion/casos-uso/OfertaAcademicaCasoUso.js";
import { OfertaAcademicaRepositorioPostgres } from "../../core/infraestructura/postgres/OfertaAcademicaRepositorioPostgres.js";
import { esquemaCrearOferta, OfertaAcademicaDTO } from "../esquemas/OfertaAcademicaEsquema.js";
import { ZodError } from "zod";

const repo = new OfertaAcademicaRepositorioPostgres();
const casoUso = new OfertaAcademicaCasoUso(repo);

export class OfertaAcademicaControlador {

  // Crear oferta
  static async crear(
    req: FastifyRequest<{ Body: OfertaAcademicaDTO }>,
    reply: FastifyReply
  ) {
    try {
      const datosValidados = esquemaCrearOferta.parse(req.body);

      const idNueva = await casoUso.crearOferta(datosValidados);

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
        error: err instanceof Error ? err.message : String(err),
      });
    }
  }

  // Listar ofertas
  static async listar(req: FastifyRequest, reply: FastifyReply) {
    try {
      const data = await casoUso.listarOfertas();

      return reply.code(200).send({
        mensaje: "Ofertas académicas listadas correctamente",
        cantidad: data.length,
        data,
      });
    } catch (err) {
      return reply.code(500).send({
        mensaje: "Error al listar las ofertas académicas",
        error: err instanceof Error ? err.message : String(err),
      });
    }
  }

  // Obtener por ID
  static async obtenerPorId(
    req: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    try {
      const { id } = req.params;

      const oferta = await casoUso.obtenerOfertaPorId(id);

      if (!oferta) {
        return reply.code(404).send({
          mensaje: "La oferta académica no existe",
        });
      }

      return reply.code(200).send({
        mensaje: "Oferta académica encontrada",
        data: oferta,
      });
    } catch (err) {
      return reply.code(500).send({
        mensaje: "Error al obtener la oferta académica",
        error: err instanceof Error ? err.message : String(err),
      });
    }
  }

  // Actualizar oferta
  static async actualizar(
    req: FastifyRequest<{ Params: { id: string }; Body: OfertaAcademicaDTO }>,
    reply: FastifyReply
  ) {
    try {
      const { id } = req.params;

      const datosValidados = esquemaCrearOferta.parse(req.body);

      const ofertaActualizada =
        await casoUso.actualizarOferta(id, datosValidados);

      return reply.code(200).send({
        mensaje: "Oferta académica actualizada correctamente",
        data: ofertaActualizada,
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
        error: err instanceof Error ? err.message : String(err),
      });
    }
  }

  // Eliminar oferta
  static async eliminar(
    req: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    try {
      const { id } = req.params;

      await casoUso.eliminarOferta(id);

      return reply.code(200).send({
        mensaje: "Oferta académica eliminada correctamente",
      });
    } catch (err) {
      return reply.code(500).send({
        mensaje: "Error al eliminar la oferta académica",
        error: err instanceof Error ? err.message : String(err),
      });
    }
  }
}
