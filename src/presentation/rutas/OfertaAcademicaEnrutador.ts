import { FastifyInstance } from "fastify";
import { OfertaAcademicaControlador } from "../controladores/OfertaAcademicaControlador";
import { IOfertaAcademicaRepositorio } from "../../core/dominio/repositorio/IOfertaAcademicaRepositorio";
import { OfertaAcademicaRepositorioPostgres } from "../../core/infraestructura/postgres/OfertaAcademicaRepositorioPostgres";
import { OfertaAcademicaCasoUso } from "../../core/aplicacion/casos-uso/OfertaAcademicaCasoUso";

function ofertaAcademicaEnrutador(
  app: FastifyInstance,
  ofertaControlador: OfertaAcademicaControlador
) {
  app.get("/ofertas", ofertaControlador.listarOfertas);
  app.get("/ofertas/:id_oferta", ofertaControlador.obtenerOfertaPorId);
  app.post("/ofertas", ofertaControlador.crearOferta);
  app.put("/ofertas/:id_oferta", ofertaControlador.actualizarOferta);
  app.delete("/ofertas/:id_oferta", ofertaControlador.eliminarOferta);
}

export async function construirOfertaAcademicaEnrutador(app: FastifyInstance) {
  const ofertaRepositorio: IOfertaAcademicaRepositorio =
    new OfertaAcademicaRepositorioPostgres();

  const ofertaCasoUso = new OfertaAcademicaCasoUso(ofertaRepositorio);

  const ofertaControlador = new OfertaAcademicaControlador(ofertaCasoUso);

  ofertaAcademicaEnrutador(app, ofertaControlador);
}

