import { FastifyInstance } from "fastify";
import { OfertaAcademicaControlador } from "../controladores/OfertaAcademicaControlador.js";
import { IOfertaAcademicaRepositorio } from "../../core/dominio/repositorio/IOfertaAcademicaRepositorio.js";
import { OfertaAcademicaRepositorioPostgres } from "../../core/infraestructura/postgres/OfertaAcademicaRepositorioPostgres.js";
import { OfertaAcademicaCasoUso } from "../../core/aplicacion/casos-uso/OfertaAcademicaCasoUso.js";

export async function OfertaAcademicaEnrutador(app: FastifyInstance) {
  const ofertaRepositorio: IOfertaAcademicaRepositorio = new OfertaAcademicaRepositorioPostgres();
  const ofertaCasoUso = new OfertaAcademicaCasoUso(ofertaRepositorio);
  const ofertaControlador = new OfertaAcademicaControlador(ofertaCasoUso);

  app.get("/ofertas", ofertaControlador.listarOfertas);
  app.get("/ofertas/:id_oferta", ofertaControlador.obtenerOfertaPorId);
  app.post("/ofertas", ofertaControlador.crearOferta);
  app.put("/ofertas/:id_oferta", ofertaControlador.actualizarOferta);
  app.delete("/ofertas/:id_oferta", ofertaControlador.eliminarOferta);
}
