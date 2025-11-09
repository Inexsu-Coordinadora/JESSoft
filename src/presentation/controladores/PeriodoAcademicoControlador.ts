import { FastifyRequest, FastifyReply } from "fastify";
import { IPeriodoAcademico } from "../../core/dominio/entidades/IPeriodoAcademico.js";
import { IPeriodoAcademicoCasoUso } from "../../core/aplicacion/repositorio-casos-uso/IPeriodoAcademicoCasoUso.js";
import { PeriodoAcademicoDTO, EsquemaPeriodoAcademico} from "../esquemas/PeriodoAcademicoEsquema.js";
import { ZodError } from "zod";
import { PeriodoAcademicoCasoUso } from "../../core/aplicacion/casos-uso/PeriodoAcademicoCasoUso.js";

export class PeriodoAcademicoControlador {
  constructor(private periodoAcademicoCasoUso: IPeriodoAcademicoCasoUso) {
    
  }
 
  obtenerPeriodos = async (
    request: FastifyRequest<{ Querystring: { limite?: number } }>,
    reply: FastifyReply
  ) => {
    try {
      const { limite } = request.query;
      const periodosEncontrados = await this.periodoAcademicoCasoUso.obtenerPeriodos(limite);

      return reply.code(200).send({
        mensaje: "Periodos encontrados correctamente!",
        periodos: periodosEncontrados,
        periodosEncontrados: periodosEncontrados.length,
      });
    } catch (err) {
      return reply.code(500).send({
        mensaje: "Error al obtener los periodos",
        error: err instanceof Error ? err.message : err,
      });
    }
  };

  obtenerPeriodoPorId = async (
    request: FastifyRequest<{ Params: { id_p: string } }>,
    reply: FastifyReply
  ) => {
    try {
      const { id_p } = request.params;
      const periodoEncontrado = await this.periodoAcademicoCasoUso.obtenerPeriodoPorId(id_p);

      if (!periodoEncontrado) {
        return reply.code(404).send({
          mensaje: "Periodo no encontrado",
        });
      }

      return reply.code(200).send({
        mensaje: "Periodo encontrado correctamente",
        periodo: periodoEncontrado,
      });
    } catch (err) {
      return reply.code(500).send({
        mensaje: "Error al obtener el periodo",
        error: err instanceof Error ? err.message : err,
      });
    }
  };

  crearPeriodo = async (
    request: FastifyRequest<{ Body: PeriodoAcademicoDTO }>,
    reply: FastifyReply
  ) => {
    try {
      const nuevoPeriodo = EsquemaPeriodoAcademico.parse(request.body);
      const idNuevoPeriodo = await this.periodoAcademicoCasoUso.crearPeriodo(nuevoPeriodo);

      return reply.code(200).send({
        mensaje: "El periodo se creó correctamente",
        idNuevoPeriodo: idNuevoPeriodo,
      });
    } catch (err) {
      if (err instanceof ZodError) {
        return reply.code(400).send({
          mensaje: "Error crear un nuevo periodo",
          error: err.issues[0]?.message || "Error desconocido",
        });
      }
      return reply.code(500).send({
        mensaje: "Error crear un nuevo periodo",
        error: err instanceof Error ? err.message : String(err),
      });
    }
  };

  actualizarPeriodo = async (
    request: FastifyRequest<{ Params: { id_p: string }; Body: IPeriodoAcademico }>,
    reply: FastifyReply
  ) => {
    try {
        const { id_p } = request.params;
        const nuevoPeriodo = request.body;
        const periodoActualizado = await this.periodoAcademicoCasoUso.actualizarPeriodo(
            id_p,
            nuevoPeriodo
        );

        if (!periodoActualizado) {
            return reply.code(404).send({
            mensaje: "Periodo no encontrado",
            });
        }

        if (nuevoPeriodo.id_periodo && nuevoPeriodo.id_periodo !== id_p) {
        return reply.code(400).send({
            mensaje: "No se permite modificar el ID del periodo académico.",
        });
        }

        return reply.code(200).send({
            mensaje: "Periodo académico actualizado correctamente",
            periodoActualizado: periodoActualizado,
        });
        } catch (err) {
        return reply.code(500).send({
            mensaje: "Error al actualizar el periodo",
            error: err instanceof Error ? err.message : err,
        });
        }
    };

  eliminarPeriodo = async (
    request: FastifyRequest<{ Params: { id_p: string } }>,
    reply: FastifyReply
  ) => {
    try {
      const { id_p } = request.params;
      await this.periodoAcademicoCasoUso.eliminarPeriodo(id_p);

      return reply.code(200).send({
        mensaje: "Periodo eliminado correctamente",
        idPeriodo: id_p,
      });
    } catch (err) {
      return reply.code(500).send({
        mensaje: "Error al eliminar el periodo",
        error: err instanceof Error ? err.message : err,
      });
    }
  };
}
