import { FastifyReply, FastifyRequest } from "fastify";
import { PlanEstudioCasosUso } from "../../core/aplicacion/casos-uso/PlanEstudioCasosUso";
import { PlanEstudioRepositorio } from "../../core/infraestructura/postgres/PlanEstudioRepositorio.js";
import { EsquemaPlanEstudio, PlanEstudioDTO } from "../esquemas/PlanDeEstudioEsquema";
import { ZodError } from "zod";

const repo = new PlanEstudioRepositorio();
const planEstudioCasosUso = new PlanEstudioCasosUso(repo);

export class PlanEstudioControlador {
    constructor(private casosUso: PlanEstudioCasosUso) { }

    async crear(req: FastifyRequest<{ Body: PlanEstudioDTO }>, res: FastifyReply) {
        try {
            const nuevoPlanEstudio = EsquemaPlanEstudio.parse(req.body);
            const idPlanEstudio = await planEstudioCasosUso.crear(nuevoPlanEstudio);
            return res.status(201).send({
                mensaje: "Plan de estudio creado correctamente",
                id: idPlanEstudio
            });
        } catch (error) {
            if (error instanceof Error && (error.message === "Ya existe un plan de estudio con esos datos." || error.message === "Ya existe un plan de estudio con ese ID.")) {
                return res.status(400).send({ mensaje: error.message });
            } else if (error instanceof Error && error.message === "Ya existe un plan de estudio para esa asignatura en ese programa.") {
                return res.status(409).send({ mensaje: error.message });
            } else if (error instanceof Error && error.message.includes("insert or update on table \"plan_estudio\" violates foreign key constraint \"plan_estudio_id_asignatura_fkey\"")) {
                return res.status(400).send({ mensaje: "El ID de asignatura no existe." });
            } else if (error instanceof Error && error.message.includes("insert or update on table \"plan_estudio\" violates foreign key constraint \"plan_estudio_id_programa_fkey\"")) {
                return res.status(400).send({ mensaje: "El ID de programa no existe." });
            } else if (error instanceof ZodError) {
                return res.code(400).send({
                    mensaje: "Error crear un nuevo programa",
                    error: error.issues[0]?.message || "Error desconocido",
                });
            }
            console.error("Error creando plan de estudio:", error);
            return res.status(500).send({ mensaje: "Error interno al crear plan de estudio" });
        }
    }

    async listar(req: FastifyRequest, res: FastifyReply) {
        try {
            const planesEstudio = await planEstudioCasosUso.obtenerTodos();
            return res.status(200).send(planesEstudio);
        }
        catch (error) {
            console.error("Error listando planes de estudio:", error);
            return res.status(500).send({ mensaje: "Error interno al listar planes de estudio" });
        }
    }

    async actualizar(req: FastifyRequest<{ Body: PlanEstudioDTO, Params: { id: string } }>, res: FastifyReply) {
        try {
            const dto = req.body;
            const id = req.params.id;
            const id_plan = id;
            const planEstudioActualizado = await planEstudioCasosUso.actualizar(dto, id_plan);
            return res.status(200).send({
                mensaje: "Plan de estudio actualizado correctamente",
                planEstudioActualizado
            });
        } catch (error) {
            if (error instanceof Error && (error.message === "Ya existe un plan de estudio con esos datos." || error.message === "Ya existe un plan de estudio con ese ID.")) {
                return res.status(400).send({ mensaje: error.message });
            } else if (error instanceof Error && error.message === "Ya existe un plan de estudio para esa asignatura en ese programa.") {
                return res.status(409).send({ mensaje: error.message });
            } else if (error instanceof Error && error.message.includes("insert or update on table \"plan_estudio\" violates foreign key constraint \"plan_estudio_id_asignatura_fkey\"")) {
                return res.status(400).send({ mensaje: "El ID de asignatura no existe." });
            } else if (error instanceof Error && error.message.includes("insert or update on table \"plan_estudio\" violates foreign key constraint \"plan_estudio_id_programa_fkey\"")) {
                return res.status(400).send({ mensaje: "El ID de programa no existe." });
            } else if (error instanceof ZodError) {
                return res.code(400).send({
                    mensaje: "Error al actualizar un nuevo programa",
                    error: error.issues[0]?.message || "Error desconocido",
                });
            }
            console.error("Error creando plan de estudio:", error);
            return res.status(500).send({ mensaje: "Error interno al crear plan de estudio" });
        }
    }

    async eliminar(req: FastifyRequest<{ Params: { id: string } }>, res: FastifyReply) {
        try {
            const id = req.params.id;
            await planEstudioCasosUso.eliminar(id);
            return res.status(204).send({
                 mensaje: "Plan de estudio eliminado correctamente",
                 id: id });
        } catch (error) {
            if (error instanceof Error && error.message === "No existe un plan de estudio con ese ID.") {
                return res.status(404).send({ mensaje: error.message });
            }
            console.error("Error eliminando plan de estudio:", error);
            return res.status(500).send({ mensaje: "Error interno al eliminar plan de estudio" });
        }
    }
}   
