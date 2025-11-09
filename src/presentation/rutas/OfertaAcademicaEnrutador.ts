
import { FastifyInstance } from "fastify";
import {
  crearOfertaAcademicaControlador,
  listarOfertasAcademicasControlador,
} from "../controladores/OfertaAcademicaControlador.js";

export async function construirOfertaAcademicaEnrutador(app: FastifyInstance) {
  app.post("/oferta-academica", crearOfertaAcademicaControlador);

  app.get("/oferta-academica", listarOfertasAcademicasControlador);
}
