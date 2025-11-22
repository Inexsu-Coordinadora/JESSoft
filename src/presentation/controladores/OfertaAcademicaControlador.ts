import { FastifyRequest, FastifyReply } from "fastify";
import { IOfertaAcademica } from "../../core/dominio/entidades/IOfertaAcademica";
import { IOfertaAcademicaCasoUso } from "../../core/aplicacion/repositorio-casos-uso/IOfertaAcademicaCasoUso";
import { OfertaAcademicaDTO, EsquemaOfertaAcademica } from "../esquemas/OfertaAcademicaEsquema";
import { ZodError } from "zod";


export class OfertaAcademicaControlador {
  constructor(private ofertaCasoUso: IOfertaAcademicaCasoUso) {}

  // Listar ofertas
  listarOfertas = async (
    request: FastifyRequest<{ Querystring: { limite?: number } }>,
    reply: FastifyReply
  ) => {
    try {
      const { limite } = request.query;
      const ofertas = await this.ofertaCasoUso.listarOfertas(limite);

      return reply.code(200).send({
        mensaje: "Ofertas encontradas correctamente",
        ofertas,
        cantidad: ofertas.length,
      });
    } catch (err) {
      return reply.code(500).send({
        mensaje: "Error al listar las ofertas académicas",
        error: err instanceof Error ? err.message : err,
      });
    }
  };

  // Obtener oferta por ID
  obtenerOfertaPorId = async (
    request: FastifyRequest<{ Params: { id_oferta: string } }>,
    reply: FastifyReply
  ) => {
    try {
      const { id_oferta } = request.params;
      const oferta = await this.ofertaCasoUso.obtenerOfertaPorId(id_oferta);

      if (!oferta) {
        return reply.code(404).send({ mensaje: "Oferta académica no encontrada" });
      }

      return reply.code(200).send({
        mensaje: "Oferta encontrada correctamente",
        oferta,
      });
    } catch (err) {
      return reply.code(500).send({
        mensaje: "Error al obtener la oferta académica",
        error: err instanceof Error ? err.message : err,
      });
    }
  };

  // Crear oferta
crearOferta = async (
  request: FastifyRequest<{ Body: OfertaAcademicaDTO }>,
  reply: FastifyReply
) => {
  try {
    const datosValidados = EsquemaOfertaAcademica.parse(request.body);

    const idNueva = await this.ofertaCasoUso.crearOferta(datosValidados);

    return reply.code(201).send({
      mensaje: "Oferta académica creada correctamente",
      id_oferta: idNueva,
    });

  } catch (err: any) {

    if (err instanceof ZodError) {

      const primerError = err.issues?.[0]; 
      const campo = String(primerError?.path?.[0] ?? "");

      let mensaje = "Error de validación";

      if (primerError) {
        if (primerError.message.startsWith("Invalid input")) {
          mensaje = `El campo '${campo}' es obligatorio`;
        } else {
          mensaje = primerError.message;
        }
      }

      return reply.code(400).send({ mensaje });
    }

    if (err.code === "23505") {
      return reply.code(400).send({
        mensaje: "La oferta académica ya existe",
      });
    }

    if (err instanceof Error) {
      return reply.code(400).send({
        mensaje: err.message,
      });
    }

    return reply.code(500).send({
      mensaje: "Error al crear la oferta académica",
      error: err,
    });
  }
};
  // Actualizar oferta
  actualizarOferta = async (
  request: FastifyRequest<{ Params: { id_oferta: string }; Body: OfertaAcademicaDTO }>,
  reply: FastifyReply
) => {
  try {
    const { id_oferta } = request.params;
    // Rechazar si intenta cambiar el ID
    if ("id_oferta" in request.body && request.body.id_oferta !== id_oferta) {
      return reply.code(400).send({
        mensaje: "No se permite modificar el ID de la oferta académica",
      });
    }
    //  Validar absolutamente todo el body 
    const datosActualizados = EsquemaOfertaAcademica.parse(request.body);

    const { id_periodo, id_plan, grupo, cupo } = datosActualizados;

    // Obtener oferta actual
    const ofertaActual = await this.ofertaCasoUso.obtenerOfertaPorId(id_oferta);

    if (!ofertaActual) {
      return reply.code(404).send({
        mensaje: "Oferta académica no encontrada",
      });
    }

    //Prohibir modificar campos 
    if (id_periodo !== ofertaActual.id_periodo) {
      return reply.code(400).send({
        mensaje: "No se permite modificar el periodo académico",
      });
    }

    if (id_plan !== ofertaActual.id_plan) {
      return reply.code(400).send({
        mensaje: "No se permite modificar el plan de estudio",
      });
    }

    if (grupo !== ofertaActual.grupo) {
      return reply.code(400).send({
        mensaje: "No se permite modificar el grupo",
      });
    }

    //Actualizar oferta (solo cupo)
    const ofertaActualizada = await this.ofertaCasoUso.actualizarOferta(
      id_oferta,
      datosActualizados 
    );

    return reply.code(200).send({
      mensaje: "Oferta académica actualizada correctamente",
      oferta: ofertaActualizada,
    });

  } catch (err: any) {
    if (err instanceof ZodError) {
      const issue = err.issues.length > 0 ? err.issues[0] : null;

      if (!issue) {
        return reply.code(400).send({
          mensaje: "Datos inválidos",
        });
      }
      const campo = String(issue.path[0] ?? "");
      const mensajesCampos: Record<string, string> = {
        id_periodo: "El periodo académico es obligatorio",
        id_plan: "El plan académico es obligatorio",
        grupo: "El grupo es obligatorio",
        cupo: "El cupo es obligatorio y debe ser mayor que cero",
      };

      return reply.code(400).send({
        mensaje: mensajesCampos[campo] || issue.message || "Datos inválidos",
      });
    }

    return reply.code(500).send({
      mensaje: "Error al actualizar la oferta académica",
    });
  }
};

  // Eliminar oferta
  eliminarOferta = async (
  request: FastifyRequest<{ Params: { id_oferta: string } }>,
  reply: FastifyReply
) => {
  try {
    const { id_oferta } = request.params;

    await this.ofertaCasoUso.eliminarOferta(id_oferta);

    return reply.code(200).send({
      mensaje: "Oferta académica eliminada correctamente",
      id_oferta,
    });

  } catch (err: any) {

    if (err instanceof Error && err.message === "OFERTA_NO_ENCONTRADA") {
      return reply.code(404).send({
        mensaje: "Oferta académica no encontrada",
      });
    }

    return reply.code(500).send({
      mensaje: "Error al eliminar la oferta académica",
    });
  }
};
}
