import { FastifyRequest, FastifyReply } from "fastify";
import { IAsignacionDocente } from "../../core/dominio/entidades/IAsignacionDocente.js";
import { IAsignacionDocenteCasoUso } from "../../core/aplicacion/repositorio-casos-uso/IAsignacionDocenteCasoUso.js";
import { AsignacionDocenteDTO, EsquemaAsignacionDocente } from "../esquemas/AsignacionDocenteEsquema.js";
import { ZodError } from "zod";

export class AsignacionDocenteControlador {
  constructor(private asignacionDocenteCasoUso: IAsignacionDocenteCasoUso) {}

  obtenerAsignaciones = async (
    request: FastifyRequest<{ Querystring: { limite?: number } }>,
    reply: FastifyReply
  ) => {
    try {
      const { limite } = request.query;
      const asignacionesEncontradas = await this.asignacionDocenteCasoUso.obtenerAsignaciones(limite);

      return reply.code(200).send({
        mensaje: "Asignaciones encontradas correctamente!",
        asignaciones: asignacionesEncontradas,
        asignacionesEncontrados: asignacionesEncontradas.length,
      });
    } catch (err) {
      return reply.code(500).send({
        mensaje: "Error al obtener las asignaciones",
        error: err instanceof Error ? err.message : err,
      });
    }
  };

  obtenerAsignacionPorId = async (
    request: FastifyRequest<{ Params: { id_asignacion: string } }>,
    reply: FastifyReply
  ) => {
    try {
      const { id_asignacion } = request.params;
      const asignacionEncontrada = await this.asignacionDocenteCasoUso.obtenerAsignacionPorId(id_asignacion);

      if (!asignacionEncontrada) {
        return reply.code(404).send({
          mensaje: "Asignación no encontrada",
        });
      }

      return reply.code(200).send({
        mensaje: "Asignación encontrada correctamente",
        asignacion: asignacionEncontrada,
      });
    } catch (err) {
      return reply.code(500).send({
        mensaje: "Error al obtener la asignación",
        error: err instanceof Error ? err.message : err,
      });
    }
  };

  crearAsignacion = async (
    request: FastifyRequest<{ Body: AsignacionDocenteDTO }>,
    reply: FastifyReply
  ) => {
    try {
      const nuevaAsignacion = EsquemaAsignacionDocente.parse(request.body);


      const idNuevaAsignacion = await this.asignacionDocenteCasoUso.crearAsignacion(nuevaAsignacion);

      return reply.code(201).send({
        mensaje: "La asignación se creó correctamente",
        idNuevaAsignacion,
      });

    } catch (err) {

      if (err instanceof ZodError) {
        return reply.code(400).send({
          mensaje: "Error de validación en los datos enviados",
          error: err.issues[0]?.message || "Datos inválidos",
        });
      }

      // Errores de lógica de negocio lanzados desde el caso de uso
      if (err instanceof Error) {
        const mensaje = err.message;

        // Docente o grupo inexistente
        if (mensaje.includes("no existe")) {
          return reply.code(404).send({ mensaje });
        }

        // Asignación duplicada, grupo ya con docente o límite de carga
        if (
          mensaje.includes("ya existe") ||
          mensaje.includes("ya tiene") ||
          mensaje.includes("límite")
        ) {
          return reply.code(400).send({ mensaje });
        }
      }

      return reply.code(500).send({
        mensaje: "Error al crear la asignación",
        error: err instanceof Error ? err.message : String(err),
      });
    }
  };


  actualizarAsignacion = async (
    request: FastifyRequest<{ Params: { id_asignacion: string }; Body: IAsignacionDocente }>,
    reply: FastifyReply
  ) => {
    try {
      const { id_asignacion } = request.params;
      const nuevaAsignacion = request.body;

      if (nuevaAsignacion.id_asignacion && nuevaAsignacion.id_asignacion !== id_asignacion) {
        return reply.code(400).send({
          mensaje: "No se permite modificar el ID de la asignación.",
        });
      }

      const asignacionActualizada = await this.asignacionDocenteCasoUso.actualizarAsignacion(
        id_asignacion,
        nuevaAsignacion
      );

      if (!asignacionActualizada) {
        return reply.code(404).send({
          mensaje: "Asignación no encontrada",
        });
      }

      return reply.code(200).send({
        mensaje: "Asignación actualizada correctamente",
        asignacionActualizada,
      });
    } catch (err) {
      return reply.code(500).send({
        mensaje: "Error al actualizar la asignación",
        error: err instanceof Error ? err.message : err,
      });
    }
  };

  eliminarAsignacion = async (
    request: FastifyRequest<{ Params: { id_asignacion: string } }>,
    reply: FastifyReply
  ) => {
    try {
      const { id_asignacion } = request.params;
      await this.asignacionDocenteCasoUso.eliminarAsignacion(id_asignacion);

      return reply.code(200).send({
        mensaje: "Asignación eliminada correctamente",
        idAsignacion: id_asignacion,
      });
    } catch (err) {
      return reply.code(500).send({
        mensaje: "Error al eliminar la asignación",
        error: err instanceof Error ? err.message : err,
      });
    }
  };
}
