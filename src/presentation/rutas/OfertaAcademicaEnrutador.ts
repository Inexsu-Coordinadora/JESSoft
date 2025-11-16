import { FastifyInstance } from "fastify";
import { OfertaAcademicaControlador } from "../controladores/OfertaAcademicaControlador.js";

export async function OfertaAcademicaEnrutador(app: FastifyInstance) {
  app.post("/ofertas", OfertaAcademicaControlador.crear);
  app.get("/ofertas", OfertaAcademicaControlador.listar);
  app.get("/ofertas/:id", OfertaAcademicaControlador.obtenerPorId);
  app.put("/ofertas/:id", OfertaAcademicaControlador.actualizar);
  app.delete("/ofertas/:id", OfertaAcademicaControlador.eliminar);
}
