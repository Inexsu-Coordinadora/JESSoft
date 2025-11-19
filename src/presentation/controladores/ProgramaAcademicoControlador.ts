import { FastifyRequest, FastifyReply } from "fastify";
import { IProgramaAcademico } from "../../core/dominio/entidades/IProgramaAcademico.js";
import { IProgramaAcademicoCasoUso } from "../../core/aplicacion/repositorio-casos-uso/IProgramaAcademicoCasoUso.js";
import { ProgramaAcademicoDTO, EsquemaProgramaAcademico} from "../esquemas/ProgramaAcademicoEsquema.js";
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
    request: FastifyRequest<{ Params: { id_pa: string } }>,
    reply: FastifyReply
  ) => {
    try {
      const { id_pa } = request.params;
      const programaEncontrado = await this.programaAcademicoCasoUso.obtenerProgramaPorId(id_pa);

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
    request: FastifyRequest<{ Params: { id_pa: string }; Body: IProgramaAcademico }>,
    reply: FastifyReply
  ) => {
    try {
        const { id_pa } = request.params;
        const nuevoPrograma = request.body;
        const programaActualizado = await this.programaAcademicoCasoUso.actualizarPrograma(
            id_pa,
            nuevoPrograma
        );

        if (!programaActualizado) {
            return reply.code(404).send({
            mensaje: "Programa no encontrado",
            });
        }

        if (nuevoPrograma.id_programa && nuevoPrograma.id_programa !== id_pa) {
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
    request: FastifyRequest<{ Params: { id_pa: string } }>,
    reply: FastifyReply
  ) => {
    try {
      const { id_pa } = request.params;
      await this.programaAcademicoCasoUso.eliminarPrograma(id_pa);

      return reply.code(200).send({
        mensaje: "Programa eliminado correctamente",
        idPrograma: id_pa,
      });
    } catch (err) {
      return reply.code(500).send({
        mensaje: "Error al eliminar el programa",
        error: err instanceof Error ? err.message : err,
      });
    }
  };
}
