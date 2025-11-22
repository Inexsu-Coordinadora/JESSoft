import { FastifyRequest, FastifyReply } from "fastify";
import { IProgramaAcademico } from "../../core/dominio/entidades/IProgramaAcademico";
import { IProgramaAcademicoCasoUso } from "../../core/aplicacion/repositorio-casos-uso/IProgramaAcademicoCasoUso";
import { ProgramaAcademicoDTO, EsquemaProgramaAcademico} from "../esquemas/ProgramaAcademicoEsquema";
import { ZodError } from "zod";
import { HttpStatus } from "../../common/statusCode";

export class ProgramaAcademicoControlador {
  constructor(private programaAcademicoCasoUso: IProgramaAcademicoCasoUso) {}
 
  obtenerProgramas = async (
    request: FastifyRequest<{ Querystring: { limite?: number } }>,
    reply: FastifyReply
  ) => {
    try {
      const { limite } = request.query;
      const programasEncontrados = await this.programaAcademicoCasoUso.obtenerProgramas(limite);

      return reply.code(HttpStatus.EXITO).send({
        mensaje: "Programas encontrados correctamente!",
        programas: programasEncontrados,
        programasEncontrados: programasEncontrados.length,
      });
    } catch (err) {
      return reply.code(HttpStatus.ERROR_SERVIDOR).send({
        mensaje: "Error al obtener los programas",
        error: err instanceof Error ? err.message : err,
      });
    }
  };

  obtenerProgramaPorId = async (
    request: FastifyRequest<{ Params: { id_programa: string } }>,
    reply: FastifyReply
  ) => {
    try {
      const { id_programa } = request.params;
      const programaEncontrado = await this.programaAcademicoCasoUso.obtenerProgramaPorId(id_programa);

      if (!programaEncontrado) {
        return reply.code(HttpStatus.NO_ENCONTRADO).send({
          mensaje: "Programa no encontrado",
        });
      }

      return reply.code(HttpStatus.EXITO).send({
        mensaje: "Programa encontrado correctamente",
        programa: programaEncontrado,
      });
    } catch (err) {
      return reply.code(HttpStatus.ERROR_SERVIDOR).send({
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

      return reply.code(HttpStatus.EXITO).send({
        mensaje: "El programa se creó correctamente",
        idNuevoPrograma: idNuevoPrograma,
      });
    } catch (err) {
      if (err instanceof ZodError) {
        return reply.code(HttpStatus.SOLICITUD_INCORRECTA).send({
          mensaje: "Error crear un nuevo programa",
          error: err.issues[0]?.message || "Error desconocido",
        });
      }
      return reply.code(HttpStatus.ERROR_SERVIDOR).send({
        mensaje: "Error crear un nuevo programa",
        error: err instanceof Error ? err.message : String(err),
      });
    }
  };

  actualizarPrograma = async (
    request: FastifyRequest<{ Params: { id_programa: string }; Body: IProgramaAcademico }>,
    reply: FastifyReply
  ) => {
    try {
      const { id_programa } = request.params;
      const nuevoPrograma = request.body;

      const programaActualizado =
        await this.programaAcademicoCasoUso.actualizarPrograma(id_programa, nuevoPrograma);

      if (!programaActualizado) {
        return reply.code(HttpStatus.NO_ENCONTRADO).send({
          mensaje: "Programa no encontrado",
        });
      }

      return reply.code(HttpStatus.EXITO).send({
        mensaje: "Programa actualizado correctamente",
        programaActualizado,
      });

    } catch (err) {

      if (err instanceof Error && err.message.includes("No se permite modificar el ID")) {
        return reply.code(HttpStatus.SOLICITUD_INCORRECTA).send({ mensaje: err.message });
      }

      return reply.code(HttpStatus.ERROR_SERVIDOR).send({
        mensaje: "Error al actualizar el programa",
        error: err instanceof Error ? err.message : err,
      });
    }
  };

  eliminarPrograma = async (
    request: FastifyRequest<{ Params: { id_programa: string } }>,
    reply: FastifyReply
  ) => {
    try {
      const { id_programa } = request.params;
      await this.programaAcademicoCasoUso.eliminarPrograma(id_programa);

      return reply.code(HttpStatus.EXITO).send({
        mensaje: "Programa eliminado correctamente",
        idPrograma: id_programa,
      });
    } catch (err) {
      return reply.code(HttpStatus.EXITO).send({
        mensaje: "Error al eliminar el programa",
        error: err instanceof Error ? err.message : err,
      });
    }
  };
}
