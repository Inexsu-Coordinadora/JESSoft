import { FastifyInstance } from "fastify";
import {
  crearOfertaAcademicaControlador,
  listarOfertasAcademicasControlador,
  eliminarOfertaAcademicaControlador,
  actualizarOfertaAcademicaControlador,
  buscarOfertaPorIdControlador,
} from "../controladores/OfertaAcademicaControlador.js";

export async function construirOfertaAcademicaEnrutador(app: FastifyInstance) {
  app.post("/oferta-academica", crearOfertaAcademicaControlador);
  app.get("/oferta-academica", listarOfertasAcademicasControlador);
  app.get("/oferta-academica/:id", buscarOfertaPorIdControlador);
  app.put("/oferta-academica/:id", actualizarOfertaAcademicaControlador);
  app.delete("/oferta-academica/:id", eliminarOfertaAcademicaControlador);
}