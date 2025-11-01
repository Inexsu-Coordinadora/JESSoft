import { FastifyReply, FastifyRequest } from 'fastify';
import { DocenteRepositorioPostgres } from '../../core/infraestructura/postgres/DocenteRepositorioPostgres';
import { ListarDocentesCasoUso } from '../../core/aplicacion/casos-uso/ListarDocentesCasoUso';

const repo = new DocenteRepositorioPostgres();

export class DocenteControlador {
  static async listar(req: FastifyRequest, reply: FastifyReply) {
    const casoUso = new ListarDocentesCasoUso(repo);
    const data = await casoUso.ejecutar();
    reply.send({ ok: true, data });
  }
}
