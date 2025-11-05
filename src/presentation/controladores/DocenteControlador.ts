import { FastifyReply, FastifyRequest } from 'fastify';
import { DocenteRepositorioPostgres } from '../../core/infraestructura/postgres/DocenteRepositorioPostgres';
import { DocenteCasoUso } from '../../core/aplicacion/casos-uso/DocenteCasoUso';
import { DocenteDTO } from '../../core/dominio/dtos/DocenteDTO';

const repo = new DocenteRepositorioPostgres();
const casoUso = new DocenteCasoUso(repo);

export class DocenteControlador {
  // Listar todos los docentes
  static async listar(req: FastifyRequest, reply: FastifyReply) {
    try {
      const data = await casoUso.listar();

      if (!data || data.length === 0) {
        return reply.code(404).send({
          mensaje: 'No se encontraron docentes registrados',
        });
      }

      return reply.code(200).send({
        mensaje: 'Docentes listados correctamente',
        cantidad: data.length,
        data,
      });
    } catch (err) {
      return reply.code(500).send({
        mensaje: 'Error al listar los docentes',
        error: err instanceof Error ? err.message : String(err),
      });
    }
  }

  // Obtener docente por ID
  static async obtenerPorId(
    req: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    try {
      const { id } = req.params;

      if (!id) {
        return reply.code(400).send({
          mensaje: 'Debe proporcionar el ID del docente',
        });
      }

      const docente = await casoUso.buscarPorId(id);

      if (!docente) {
        return reply.code(404).send({
          mensaje: 'Docente no encontrado',
        });
      }

      return reply.code(200).send({
        mensaje: 'Docente encontrado correctamente',
        data: docente,
      });
    } catch (err) {
      return reply.code(500).send({
        mensaje: 'Error al obtener el docente por ID',
        error: err instanceof Error ? err.message : String(err),
      });
    }
  }

  // Crear docente
  static async crear(
    req: FastifyRequest<{
      Body: {
        cedula: string;
        nombre: string;
        apellido: string;
        especialidad: string;
        vinculacion: string;
      };
    }>,
    reply: FastifyReply
  ) {
    try {
      const { cedula, nombre, apellido, especialidad, vinculacion } = req.body;

      if (!cedula || !nombre || !apellido || !especialidad || !vinculacion) {
        return reply.code(400).send({
          mensaje: 'Todos los campos son obligatorios',
        });
      }

      const dto = new DocenteDTO(req.body);
      await casoUso.crear(dto);

      return reply.code(201).send({
        mensaje: 'Docente creado correctamente',
      });
    } catch (err) {
      return reply.code(500).send({
        mensaje: 'Error al crear el docente',
        error: err instanceof Error ? err.message : String(err),
      });
    }
  }

  // Actualizar docente
  static async actualizar(
    req: FastifyRequest<{
      Params: { id: string };
      Body: {
        nombre: string;
        apellido: string;
        especialidad: string;
        vinculacion: string;
      };
    }>,
    reply: FastifyReply
  ) {
    try {
      const { id } = req.params;
      const { nombre, apellido, especialidad, vinculacion } = req.body;

      if (!id || !nombre || !apellido || !especialidad || !vinculacion) {
        return reply.code(400).send({
          mensaje: 'Todos los campos son obligatorios',
        });
      }

      const docenteExistente = await casoUso.buscarPorId(id);
      if (!docenteExistente) {
        return reply.code(404).send({
          mensaje: `No existe un docente con el id_docente '${id}'`,
        });
      }

      const dto = new DocenteDTO({
        cedula: docenteExistente.cedula, // mantenemos la cédula original
        nombre,
        apellido,
        especialidad,
        vinculacion,
      });

      await casoUso.actualizar(id, dto);

      return reply.code(200).send({
        mensaje: 'Docente actualizado correctamente',
      });
    } catch (err) {
      return reply.code(500).send({
        mensaje: 'Error al actualizar el docente',
        error: err instanceof Error ? err.message : String(err),
      });
    }
  }

  //  Eliminar docente
  static async eliminar(
    req: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    try {
      const { id } = req.params;

      if (!id) {
        return reply.code(400).send({
          mensaje: 'Debe proporcionar el id del docente',
        });
      }

      const docente = await casoUso.buscarPorId(id);
      if (!docente) {
        return reply.code(404).send({
          mensaje: `No existe un docente con el id_docente '${id}'`,
        });
      }

      await casoUso.eliminar(id);

      return reply.code(200).send({
        mensaje: 'Docente eliminado correctamente',
      });
    } catch (err) {
      return reply.code(500).send({
        mensaje: 'Error al eliminar el docente',
        error: err instanceof Error ? err.message : String(err),
      });
    }
  }
}
