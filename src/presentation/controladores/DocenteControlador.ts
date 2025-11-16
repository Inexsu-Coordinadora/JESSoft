import { FastifyRequest, FastifyReply } from "fastify";
import { IDocente } from "../../core/dominio/entidades/IDocente.js";
import { IDocenteCasoUso } from "../../core/aplicacion/repositorio-casos-uso/IDocenteCasoUso.js";
import { DocenteDTO, EsquemaDocente } from "../esquemas/DocenteEsquema.js";
import { ZodError } from "zod";

export class DocenteControlador {
  constructor(private docenteCasoUso: IDocenteCasoUso) {}

  // Obtener todos los docentes
  obtenerDocentes = async (
    request: FastifyRequest<{ Querystring: { limite?: number } }>,
    reply: FastifyReply
  ) => {
    try {
      const { limite } = request.query;
      const docentesEncontrados = await this.docenteCasoUso.obtenerDocentes(limite);

      return reply.code(200).send({
        mensaje: "Docentes encontrados correctamente",
        docentes: docentesEncontrados,
        docentesEncontrados: docentesEncontrados.length,
      });
    } catch (err) {
      return reply.code(500).send({
        mensaje: "Error al obtener los docentes",
        error: err instanceof Error ? err.message : err,
      });
    }
  };

  // Obtener docente por ID
  obtenerDocentePorId = async (
    request: FastifyRequest<{ Params: { id_docente: string } }>,
    reply: FastifyReply
  ) => {
    try {
      const { id_docente } = request.params;
      const docente = await this.docenteCasoUso.obtenerDocentePorId(id_docente);

      if (!docente) {
        return reply.code(404).send({
          mensaje: "Docente no encontrado",
        });
      }

      return reply.code(200).send({
        mensaje: "Docente encontrado correctamente",
        docente,
      });
    } catch (err) {
      return reply.code(500).send({
        mensaje: "Error al obtener el docente",
        error: err instanceof Error ? err.message : err,
      });
    }
  };

  // Crear docente
  crearDocente = async (
    request: FastifyRequest<{ Body: DocenteDTO }>,
    reply: FastifyReply
  ) => {
    try {
      const nuevoDocente = EsquemaDocente.parse(request.body);
      const idNuevo = await this.docenteCasoUso.crearDocente(nuevoDocente);

      return reply.code(200).send({
        mensaje: "Docente creado correctamente",
        idNuevo,
      });
    } catch (err) {
      if (err instanceof ZodError) {
        return reply.code(400).send({
          mensaje: "Error al crear docente",
          error: err.issues[0]?.message || "Datos inválidos",
        });
      }

      return reply.code(500).send({
        mensaje: "Error al crear docente",
        error: err instanceof Error ? err.message : String(err),
      });
    }
  };

  // Actualizar docente
  actualizarDocente = async (
    request: FastifyRequest<{ Params: { id_docente: string }; Body: IDocente }>,
    reply: FastifyReply
  ) => {
    try {
      const { id_docente } = request.params;
      const nuevoDocente = request.body;

      // Evitar modificación de la cédula
      if (nuevoDocente.cedula && nuevoDocente.cedula !== (await this.docenteCasoUso.obtenerDocentePorId(id_docente))?.cedula) {
        return reply.code(400).send({
          mensaje: "No se permite modificar la cédula del docente.",
        });
      }

      const docenteActualizado = await this.docenteCasoUso.actualizarDocente(id_docente, nuevoDocente);

      if (!docenteActualizado) {
        return reply.code(404).send({
          mensaje: "Docente no encontrado",
        });
      }

      return reply.code(200).send({
        mensaje: "Docente actualizado correctamente",
        docenteActualizado,
      });
    } catch (err) {
      return reply.code(500).send({
        mensaje: "Error al actualizar el docente",
        error: err instanceof Error ? err.message : err,
      });
    }
  };

  // Eliminar docente
  eliminarDocente = async (
    request: FastifyRequest<{ Params: { id_docente: string } }>,
    reply: FastifyReply
  ) => {
    try {
      const { id_docente } = request.params;
      await this.docenteCasoUso.eliminarDocente(id_docente);

      return reply.code(200).send({
        mensaje: "Docente eliminado correctamente",
        id_docente,
      });
    } catch (err) {
      return reply.code(500).send({
        mensaje: "Error al eliminar el docente",
        error: err instanceof Error ? err.message : err,
      });
    }
  };
}
