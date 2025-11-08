import { FastifyReply, FastifyRequest } from "fastify";
import { AsignaturaCasosUso } from "../../core/aplicacion/casos-uso/AsignaturaCasosUso.js";
import { AsignaturaRepositorio } from "../../core/infraestructura/postgres/AsignaturaRepositorio.js";
import { AsignaturaDTO } from "../esquemas/AsignaturaEsquema.js";

const repo = new AsignaturaRepositorio();
const asignaturaCasosUso = new AsignaturaCasosUso(repo);

export class AsignaturaControlador {
  constructor(private casosUso: AsignaturaCasosUso) {}

   async crear(req: FastifyRequest<{ Body: AsignaturaDTO }>, res: FastifyReply) {
    try {
      const dto = req.body;
      const nuevaAsignatura = await asignaturaCasosUso.crear(dto);
      return res.status(201).send(nuevaAsignatura);
    } catch (error) {
      console.error("Error creando asignatura:", error);
      return res.status(500).send({ mensaje: "Error interno al crear asignatura" });
    }
  }

  async listar(req: FastifyRequest, res: FastifyReply) {
    try {
      const asignaturas = await asignaturaCasosUso.obtenerTodas();
      return res.status(200).send(asignaturas);
    } catch (error) {
      console.error("Error listando asignaturas:", error);
      return res.status(500).send({ mensaje: "Error interno al listar asignaturas" });
    }
  }

  async actualizar(req: FastifyRequest<{ Body: AsignaturaDTO, Params: { id: string } }>, res: FastifyReply) {
    try {
      const dto = req.body;
      const id = req.params.id;
      dto.id = id;
      const asignaturaActualizada = await asignaturaCasosUso.actualizar(dto);

      if (!asignaturaActualizada) {
        return res.status(404).send({ mensaje: "Asignatura no encontrada" });
      }
        return res.status(200).send(asignaturaActualizada);
    } catch (error) {
      console.error("Error actualizando asignatura:", error);
      return res.status(500).send({ mensaje: "Error interno al actualizar asignatura" });
    }
  }

    async eliminar(req: FastifyRequest<{ Params: { id: string } }>, res: FastifyReply) {
    try {
      const id = req.params.id;
      await asignaturaCasosUso.eliminar(id);
      return res.status(204).send({mensaje: "Asignatura eliminada correctamente", id: id});
    } catch (error) {
      console.error("Error eliminando asignatura:", error);
      return res.status(500).send({ mensaje: "Error interno al eliminar asignatura" });
    }
  }
}
