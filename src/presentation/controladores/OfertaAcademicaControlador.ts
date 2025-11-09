
import { FastifyRequest, FastifyReply } from "fastify";
import { esquemaCrearOferta } from "../esquemas/OfertaAcademicaEsquema";
import { OfertaAcademicaCasoUso } from "../../core/aplicacion/casos-uso/OfertaAcademicaCasoUso";
import { OfertaAcademicaRepositorioPostgres } from "../../core/infraestructura/postgres/OfertaAcademicaRepositorioPostgres";
import { CrearOfertaAcademicaDTO } from "../../core/dominio/dtos/OfertaAcademicaDTO";

const repositorio = new OfertaAcademicaRepositorioPostgres();
const casoUso = new OfertaAcademicaCasoUso(repositorio);

export async function crearOfertaAcademicaControlador(req: FastifyRequest<{ Body: CrearOfertaAcademicaDTO }>, reply: FastifyReply) {
  try {
    const datos = req.body;
    const resultado = await casoUso.crearOferta(datos);
    reply.code(201).send({
      mensaje: "Oferta académica creada correctamente",
      data: resultado,
    });
  } catch (error: any) {
  let mensajeError = "Ocurrió un error inesperado.";
  try {
    const posibleError = JSON.parse(error.message);
    if (Array.isArray(posibleError) && posibleError[0]?.message) {
      mensajeError = posibleError[0].message;
    }
  } catch {
    mensajeError = error.message;
  }

  reply.code(400).send({
    mensaje: "Error al crear la oferta académica",
    detalle: mensajeError,
  });
}

}

export async function listarOfertasAcademicasControlador(req: FastifyRequest, reply: FastifyReply) {
  try {
    const lista = await casoUso.listarOfertas();
    reply.code(200).send({
      mensaje: "Lista de ofertas académicas",
      data: lista,
    });
  } catch (error: any) {
    reply.code(500).send({
      mensaje: "Error al listar las ofertas académicas",
      detalle: error.message,
    });
  }
}
