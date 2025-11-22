import { FastifyRequest, FastifyReply } from "fastify";
import { IProgramaAcademico } from "../../core/dominio/entidades/IProgramaAcademico";
import { IProgramaAcademicoCasoUso } from "../../core/aplicacion/repositorio-casos-uso/IProgramaAcademicoCasoUso";
import { ProgramaAcademicoDTO, EsquemaProgramaAcademico} from "../esquemas/ProgramaAcademicoEsquema";
import { ZodError } from "zod";

export class ProgramaAcademicoControlador {
  constructor(private programaAcademicoCasoUso: IProgramaAcademicoCasoUso) {}
 
  obtenerProgramas = async (
    request: FastifyRequest<{ Querystring: { limite?: number } }>,
    reply: FastifyReply
  ) => {
    try {
      const { limite } = request.query;
      const programasEncontrados = await this.programaAcademicoCasoUso.obtenerProgramas(limite);

      return reply.code(200).send({
        mensaje: "Programas encontrados correctamente!",
        programas: programasEncontrados,
        programasEncontrados: programasEncontrados.length,
      });
    } catch (err) {
      return reply.code(500).send({
        mensaje: "Error al obtener los programas",
        error: err instanceof Error ? err.message : err,
      });
    }
  };

  obtenerProgramaPorId = async (
    request: FastifyRequest<{ Params: { id_plan: string } }>,
    reply: FastifyReply
  ) => {
    try {
      const { id_plan } = request.params;
      const programaEncontrado = await this.programaAcademicoCasoUso.obtenerProgramaPorId(id_plan);

      if (!programaEncontrado) {
        return reply.code(404).send({
          mensaje: "Programa no encontrado",
        });
      }

      return reply.code(200).send({
        mensaje: "Programa encontrado correctamente",
        programa: programaEncontrado,
      });
    } catch (err) {
      return reply.code(500).send({
        mensaje: "Error al obtener el programa",
        error: err instanceof Error ? err.message : err,
      });
    }
  };

  crearPrograma = async (
    request: FastifyRequest<{ Body: ProgramaAcademicoDTO }>,
    reply: FastifyReply
  ) => {
    try {
      const nuevoPrograma = EsquemaProgramaAcademico.parse(request.body);
      const idNuevoPrograma = await this.programaAcademicoCasoUso.crearPrograma(nuevoPrograma);

      return reply.code(200).send({
        mensaje: "El programa se creó correctamente",
        idNuevoPrograma: idNuevoPrograma,
      });
    } catch (err) {
      if (err instanceof ZodError) {
        return reply.code(400).send({
          mensaje: "Error crear un nuevo programa",
          error: err.issues[0]?.message || "Error desconocido",
        });
      }
      return reply.code(500).send({
        mensaje: "Error crear un nuevo programa",
        error: err instanceof Error ? err.message : String(err),
      });
    }
  };

  actualizarPrograma = async (
    request: FastifyRequest<{ Params: { id_plan: string }; Body: IProgramaAcademico }>,
    reply: FastifyReply
  ) => {
    try {
        const { id_plan } = request.params;
        const nuevoPrograma = request.body;
        const programaActualizado = await this.programaAcademicoCasoUso.actualizarPrograma(
            id_plan,
            nuevoPrograma
        );

        if (!programaActualizado) {
            return reply.code(404).send({
            mensaje: "Programa no encontrado",
            });
        }

        if (nuevoPrograma.id_programa && nuevoPrograma.id_programa !== id_plan) {
        return reply.code(400).send({
            mensaje: "No se permite modificar el ID del programa académico.",
        });
        }

        return reply.code(200).send({
            mensaje: "Programa actualizado correctamente",
            programaActualizado: programaActualizado,
        });
        } catch (err) {
        return reply.code(500).send({
            mensaje: "Error al actualizar el programa",
            error: err instanceof Error ? err.message : err,
        });
        }
    };

  eliminarPrograma = async (
    request: FastifyRequest<{ Params: { id_plan: string } }>,
    reply: FastifyReply
  ) => {
    try {
      const { id_plan } = request.params;
      await this.programaAcademicoCasoUso.eliminarPrograma(id_plan);

      return reply.code(200).send({
        mensaje: "Programa eliminado correctamente",
        idPrograma: id_plan,
      });
    } catch (err) {
      return reply.code(500).send({
        mensaje: "Error al eliminar el programa",
        error: err instanceof Error ? err.message : err,
      });
    }
  };
}
