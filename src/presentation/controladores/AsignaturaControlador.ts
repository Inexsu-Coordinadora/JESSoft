import { FastifyReply, FastifyRequest } from "fastify";
import { AsignaturaCasosUso } from "../../core/aplicacion/casos-uso/AsignaturaCasoUso";
import { AsignaturaDTO, EsquemaAsignatura } from "../esquemas/AsignaturaEsquema";
import { ZodError } from "zod";
import { HttpStatus } from "../../common/statusCode";

export class AsignaturaControlador {
  constructor(private casosUso: AsignaturaCasosUso) { }

  async crear(req: FastifyRequest<{ Body: AsignaturaDTO }>, res: FastifyReply) {
    try {
      const nuevaAsignatura = EsquemaAsignatura.parse(req.body);
      const asignaturaCreada = await this.casosUso.crear(nuevaAsignatura);
      return res.status(HttpStatus.CREADO).send(asignaturaCreada);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.code(HttpStatus.SOLICITUD_INCORRECTA).send({
          mensaje: "Error crear un nuevo programa",
          error: error.issues[0]?.message || "Error desconocido",
        });
      } else if (error instanceof Error && error.message === "Ya existe una asignatura con ese nombre.") {
        return res.status(HttpStatus.CONFLICTO).send({ mensaje: error.message });
      }
      console.error("Error creando asignatura:", error);
      return res.status(HttpStatus.ERROR_SERVIDOR).send({ mensaje: "Error interno al crear asignatura" });
    }
  }

  async listar(req: FastifyRequest, res: FastifyReply) {
    try {
      const asignaturas = await this.casosUso.obtenerTodas();

      return res.status(HttpStatus.EXITO).send({
        asignaturas: asignaturas
      });

    } catch (error) {
      console.error("Error listando asignaturas:", error);
      return res.status(HttpStatus.ERROR_SERVIDOR).send({
        mensaje: "Error interno al listar asignaturas"
      });
    }
  }

  async actualizar(req: FastifyRequest<{ Body: AsignaturaDTO, Params: { id: string } }>, res: FastifyReply) {
    try {
      const dto = EsquemaAsignatura.parse(req.body);
      const id = req.params.id;
      const asignaturaActualizada = await this.casosUso.actualizar(dto, id);

      if (!asignaturaActualizada) {
        return res.status(HttpStatus.NO_ENCONTRADO).send({ mensaje: "Asignatura no encontrada" });
      }
      return res.status(HttpStatus.EXITO).send(asignaturaActualizada);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.code(HttpStatus.SOLICITUD_INCORRECTA).send({
          mensaje: "Error crear un nuevo programa",
          error: error.issues[0]?.message || "Error desconocido",
        });
      } else if (error instanceof Error && error.message === "No existe una asignatura con ese ID.") {
        return res.status(HttpStatus.NO_ENCONTRADO).send({ mensaje: error.message });
      }
      
      console.error("Error actualizando asignatura:", error);
      return res.status(HttpStatus.ERROR_SERVIDOR).send({ mensaje: "Error interno al actualizar asignatura" });
    }
  }

  async eliminar(req: FastifyRequest<{ Params: { id: string } }>, res: FastifyReply) {
    try {
      const id = req.params.id;
      await this.casosUso.eliminar(id);
      return res.code(HttpStatus.SIN_CONTENIDO).send({
        mensaje: "Asignatura eliminada correctamente",
        id: id
      });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.code(HttpStatus.SOLICITUD_INCORRECTA).send({
          mensaje: "Error crear una nueva asignatura",
          error: error.issues[0]?.message || "Error desconocido",
        });
      } else if (error instanceof Error && error.message === "No existe una asignatura con ese ID.") {
        return res.status(HttpStatus.NO_ENCONTRADO).send({ mensaje: error.message });
      }
      console.error("Error eliminando asignatura:", error);
      return res.status(HttpStatus.ERROR_SERVIDOR).send({ mensaje: "Error interno al eliminar asignatura" });
    }
  }
}
