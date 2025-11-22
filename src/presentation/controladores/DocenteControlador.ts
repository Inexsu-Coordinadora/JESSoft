import { FastifyRequest, FastifyReply } from "fastify";
import { IDocente } from "../../core/dominio/entidades/IDocente";
import { IDocenteCasoUso } from "../../core/aplicacion/repositorio-casos-uso/IDocenteCasoUso";
import { DocenteDTO, EsquemaDocente } from "../esquemas/DocenteEsquema";
import { ZodError } from "zod";
import { HttpStatus } from "../../common/statusCode";

export class DocenteControlador {
  constructor(private docenteCasoUso: IDocenteCasoUso) {}

  // Obtener todos los docentes
  obtenerDocentes = async (
    request: FastifyRequest<{ Querystring: { limite?: number } }>,
    reply: FastifyReply
  ) => {
    try {
      const { limite } = request.query;
      const docentesEncontrados = await this.docenteCasoUso.obtenerDocentes(limite);

      return reply.code(HttpStatus.EXITO).send({
        mensaje: "Docentes encontrados correctamente",
        docentes: docentesEncontrados,
        docentesEncontrados: docentesEncontrados.length, //Muestra cuantos docentes hay
      });
    } catch (err) {
      return reply.code(HttpStatus.ERROR_SERVIDOR).send({
        mensaje: "Error al obtener los docentes",
        error: err instanceof Error ? err.message : err,
      });
    }
  };

  // Obtener docente por ID
  obtenerDocentePorId = async (
    request: FastifyRequest<{ Params: { id_docente: string } }>,
    reply: FastifyReply
  ) => {
    try {
      const { id_docente } = request.params;
      const docente = await this.docenteCasoUso.obtenerDocentePorId(id_docente);

      if (!docente) {
        return reply.code(HttpStatus.NO_ENCONTRADO).send({
          mensaje: "Docente no encontrado",
        });
      }

      return reply.code(HttpStatus.EXITO).send({
        mensaje: "Docente encontrado correctamente",
        docente,
      });
    } catch (err) {
      return reply.code(HttpStatus.ERROR_SERVIDOR).send({
        mensaje: "Error al obtener el docente",
        error: err instanceof Error ? err.message : err,
      });
    }
  };

  // Crear docente
crearDocente = async (
  request: FastifyRequest<{ Body: DocenteDTO }>,
  reply: FastifyReply
) => {
  try {
    //verificar si existe la propiedad vinculacion porque si la valido despues no meda :(
    if (!("vinculacion" in request.body)) {
      return reply.code(HttpStatus.SOLICITUD_INCORRECTA).send({
        mensaje: "La vinculación es obligatoria",
      });
    }

    // Validación con Zod
    const nuevoDocente = EsquemaDocente.parse(request.body);

  
    // Crear docente
    const idNuevo = await this.docenteCasoUso.crearDocente(nuevoDocente);

    return reply.code(HttpStatus.CREADO).send({
      mensaje: "Docente creado correctamente",
      idNuevo,
    });

  } catch (err) {

    // 4. Errores de validación (Zod)
    if (err instanceof ZodError) {

      // Asegurar que issue siempre exista
      const issue = err.issues.length > 0 ? err.issues[0] : null;

      if (!issue) {
        return reply.code(HttpStatus.SOLICITUD_INCORRECTA).send({
          mensaje: "Datos inválidos",
        });
      }

      // Campo que falló
      const campo = issue.path?.[0] ?? null;
      if (campo === "vinculacion") {
        return reply.code(HttpStatus.SOLICITUD_INCORRECTA).send({
          mensaje:
            "La vinculación debe ser 'Tiempo completo', 'Catedra' o 'Medio tiempo'",
        });
      }
      //Campos obligatorios 
      const mensajesCampos: Record<string, string> = {
        cedula: "La cédula es obligatoria",
        nombre: "El nombre es obligatorio",
        apellido: "El apellido es obligatorio",
        especialidad: "La especialidad es obligatoria",
      };

      const campoStr = campo ? String(campo) : "";

      return reply.code(HttpStatus.SOLICITUD_INCORRECTA).send({
        mensaje: mensajesCampos[campoStr] || issue.message || "Datos inválidos",
      });
    }
    //Cédula duplicada
    if (err instanceof Error && err.message === "CEDULA_YA_EXISTE") {
      return reply.code(HttpStatus.SOLICITUD_INCORRECTA).send({
        mensaje: "La cédula ya existe",
      });
    }
    //Error inesperado del servidor
    return reply.code(HttpStatus.ERROR_SERVIDOR).send({
      mensaje: "Error al crear docente",
    });
  }
};

  // Actualizar docente
  actualizarDocente = async (
  request: FastifyRequest<{ Params: { id_docente: string }; Body: DocenteDTO }>,
  reply: FastifyReply
) => {
  try {
    const { id_docente } = request.params;
    if (!("vinculacion" in request.body)) {
      return reply.code(HttpStatus.SOLICITUD_INCORRECTA).send({
        mensaje: "La vinculación es obligatoria",
      });
    }

    // 1. Validar TODO el body (PUT estricto)
    const datosActualizados = EsquemaDocente.parse(request.body);

    // 2. Obtener docente actual
    const docenteActual = await this.docenteCasoUso.obtenerDocentePorId(id_docente);

    if (!docenteActual) {
      return reply.code(HttpStatus.NO_ENCONTRADO).send({
        mensaje: "Docente no encontrado",
      });
    }

    // 3. Evitar modificar la cédula
    if (datosActualizados.cedula !== docenteActual.cedula) {
      return reply.code(HttpStatus.SOLICITUD_INCORRECTA).send({
        mensaje: "No se permite modificar la cédula del docente.",
      });
    }

    // 4. Actualizar DOCENTE
    const docenteActualizado = await this.docenteCasoUso.actualizarDocente(
      id_docente,
      datosActualizados
    );

    return reply.code(HttpStatus.EXITO).send({
      mensaje: "Docente actualizado correctamente",
      docente: docenteActualizado,
    });

  } catch (err) {

    // Manejo de errores Zod
    if (err instanceof ZodError) {
      const issue = err.issues.length > 0 ? err.issues[0] : null;

      if (!issue) {
        return reply.code(HttpStatus.SOLICITUD_INCORRECTA).send({
          mensaje: "Datos inválidos",
        });
      }

      const campo = String(issue.path[0] ?? "");

      const mensajesCampos: Record<string, string> = {
        cedula: "La cédula es obligatoria",
        nombre: "El nombre es obligatorio",
        apellido: "El apellido es obligatorio",
        especialidad: "La especialidad es obligatoria",
        vinculacion:
          "La vinculación debe ser 'Tiempo completo', 'Catedra' o 'Medio tiempo'",
      };

      return reply.code(HttpStatus.SOLICITUD_INCORRECTA).send({
        mensaje: mensajesCampos[campo] || issue.message || "Datos inválidos",
      });
    }

    // Error interno
    return reply.code(HttpStatus.ERROR_SERVIDOR).send({
      mensaje: "Error al actualizar el docente",
    });
  }
};

  // Eliminar docente
  eliminarDocente = async (
    request: FastifyRequest<{ Params: { id_docente: string } }>,
    reply: FastifyReply
  ) => {
    try {
      const { id_docente } = request.params;
      await this.docenteCasoUso.eliminarDocente(id_docente);

      return reply.code(HttpStatus.EXITO).send({
        mensaje: "Docente eliminado correctamente",
        id_docente,
      });
    } catch (err) {
       if (err instanceof Error && err.message === "DOCENTE_NO_ENCONTRADO") {
        return reply.code(HttpStatus.NO_ENCONTRADO).send({
          mensaje: "Docente no encontrado",
          });
          }
      return reply.code(HttpStatus.ERROR_SERVIDOR).send({
    mensaje: "Error al eliminar el docente",
    });
    }
  };
}
