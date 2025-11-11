import { FastifyRequest, FastifyReply } from "fastify";
import { OfertaAcademicaCasoUso } from "../../core/aplicacion/casos-uso/OfertaAcademicaCasoUso";
import { OfertaAcademicaRepositorioPostgres } from "../../core/infraestructura/postgres/OfertaAcademicaRepositorioPostgres";
import { CrearOfertaAcademicaDTO } from "../../core/dominio/dtos/OfertaAcademicaDTO";

const repositorio = new OfertaAcademicaRepositorioPostgres();
const casoUso = new OfertaAcademicaCasoUso(repositorio);

export async function crearOfertaAcademicaControlador(
  req: FastifyRequest<{ Body: CrearOfertaAcademicaDTO }>,
  reply: FastifyReply
) {
  try {
    const datos = req.body;
    const resultado = await casoUso.crearOferta(datos);
    reply.code(201).send(resultado);
  } catch (error) {
    reply.code(400).send({
      mensaje: (error as Error).message,
    });
  }
}

export async function listarOfertasAcademicasControlador(
  req: FastifyRequest,
  reply: FastifyReply
) {
  const resultado = await casoUso.listarOfertas();
  reply.send(resultado);
}

export async function eliminarOfertaAcademicaControlador(
  req: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) {
  try {
    const { id } = req.params;
    const resultado = await casoUso.eliminarOferta(id);
    reply.code(200).send(resultado);
  } catch (error) {
    reply.code(400).send({
      mensaje: (error as Error).message,
    });
  }
}

export async function actualizarOfertaAcademicaControlador(
  req: FastifyRequest<{ Params: { id: string }; Body: { id_periodo?: string; id_plan?: string; cupo?: number } }>,
  reply: FastifyReply
) {
  try {
    const { id } = req.params;
    const { id_periodo, id_plan, cupo } = req.body;
    const resultado = await casoUso.actualizarOferta(id, {
      id_periodo: id_periodo ?? null,
      id_plan: id_plan ?? null,
      cupo: cupo ?? null,
    });
    reply.code(200).send(resultado);
  } catch (error) {
    reply.code(400).send({
      mensaje: (error as Error).message,
    });
  }
}
export async function buscarOfertaPorIdControlador(
  req: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) {
  try {
    const { id } = req.params;
    const oferta = await casoUso.buscarOfertaPorId(id);
    reply.code(200).send(oferta);
  } catch (error) {
    reply.code(404).send({
      mensaje: (error as Error).message,
    });
  }
}


