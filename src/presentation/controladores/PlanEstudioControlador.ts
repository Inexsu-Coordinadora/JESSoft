
import { FastifyRequest, FastifyReply } from "fastify";
import { IPlanEstudio } from "../../core/dominio/entidades/IPlanEstudio";
import { IplanEstudioCasosUso } from "../../core/aplicacion/repositorio-casos-uso/IPlanEstudioCasosUso";
import { EsquemaPlanEstudio, planEstudioDTO } from "../esquemas/PlanEstudioEsquema";
import { ZodError } from "zod";
import { IProgramaAcademicoCasoUso } from "../../core/aplicacion/repositorio-casos-uso/IProgramaAcademicoCasoUso";

export class PlanEstudioControlador {
    constructor(private planEstudioCasosUso: IplanEstudioCasosUso) { }

    crearPlanEstudio = async (
        request: FastifyRequest<{ Body: planEstudioDTO }>,
        reply: FastifyReply
    ) => {
        try {
            const nuevoPlan = EsquemaPlanEstudio.parse(request.body);
            const idNuevoPlan = await this.planEstudioCasosUso.crearPlanEstudio(nuevoPlan);

            return reply.code(201).send({
                mensaje: "El plan se creó exitosamente",
                id_plan: idNuevoPlan,
            });
        } catch (err) {
            if (err instanceof ZodError) {
                return reply.code(400).send({
                    mensaje: "Error al validar los datos",
                    error: err.issues[0]?.message || "Error desonocido",
                });
            }
            return reply.code(500).send({
                mensaje: "Error al crear el plan de estudio",
                error: err instanceof Error ? err.message : String(err),
            });
        }
    };

    obtenerTodo = async (
        request: FastifyRequest<{ Querystring: { limite?: number } }>,
        reply: FastifyReply
    ) => {
        try {
            const { limite } = request.query;
            const planes = await this.planEstudioCasosUso.obtenerPlanes(limite);

            return reply.code(200).send({
                mensaje: "Planes de estudio obtenidos correctamente",
                planes,
                cantidad: planes.length,
            });
        } catch (err) {
            return reply.code(500).send({
                mensaje: "Error al mostrar los planes de estudio",
                error: err instanceof Error ? err.message : err,
            });
        }
    };

    obtenerPorId = async (
        request: FastifyRequest<{ Params: { id_plan: string } }>,
        reply: FastifyReply
    ) => {
        try {
            const { id_plan } = request.params;
            const plan = await this.planEstudioCasosUso.obtenerPorId(id_plan);

            if (!plan) {
                return reply.code(404).send({ mensaje: "Plan de estudio no encontrado" });
            }

            return reply.code(200).send({
                mensaje: "Plan de estudio encontrado correctamente",
                plan,
            });
        } catch (err) {
            return reply.code(500).send({
                mensaje: "Error al obtener el plan de estudio",
                error: err instanceof Error ? err.message : err,
            });
        }
    }


    actualizarPlan = async (
        request: FastifyRequest<{ Params: { id_plan: string }; Body: IPlanEstudio }>,
        reply: FastifyReply
    ) => {
        try {
            const { id_plan } = request.params;
            const datos = request.body;

            if (datos.id_plan && datos.id_plan !== id_plan) {
                return reply.code(400).send({
                    mensaje: "No se permite modificar el ID del plan de estudio",
                });
            }

            const planActualizado = await this.planEstudioCasosUso.actualizarPlan(id_plan, datos);

            if (!planActualizado) {
                return reply.code(404).send({
                    mensaje: "Plan de estudio no encontrado",
                });
            }

            return reply.code(200).send({
                mensaje: "Plan de estudio actualizado exitosamente",
                planActualizado,
            });
        } catch (err) {
            return reply.code(500).send({
                mensaje: "Error al actualizar el plan de estudio",
                error: err instanceof Error ? err.message : err,
            });
        }
    };


    eliminarPlan = async (
        request: FastifyRequest<{ Params: { id_plan: string } }>,
        reply: FastifyReply
    ) => {
        try {
            const { id_plan } = request.params;
            await this.planEstudioCasosUso.eliminarPlan(id_plan);

            return reply.code(200).send({
                mensaje: "Plan de estudio eliminado de manera correcta",
                id_plan,
            });
        } catch (err) {
            return reply.code(500).send({
                mensaje: "Error al eliminar el plan de estudio",
                error: err instanceof Error ? err.message : err,
            });
        }
    };

}