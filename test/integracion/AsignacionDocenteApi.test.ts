jest.mock(
  "../../src/core/infraestructura/postgres/AsignacionDocenteRepositorioPostgres",
  () => {
    return {
      AsignacionDocenteRepositorio: jest.fn().mockImplementation(() => ({
        listarAsignaciones: async () => [
          {
            id_asignacion: "AS1",
            id_docente: "D1",
            id_oferta: "OF1",
            docente: "Juan",
            grupo: "101"
          },
          {
            id_asignacion: "AS2",
            id_docente: "D2",
            id_oferta: "OF2",
            docente: "Maria",
            grupo: "202"
          }
        ],
        obtenerAsignacionPorId: async (id: string) => {
          if (id === "AS1") {
            return {
              id_asignacion: "AS1",
              id_docente: "D1",
              id_oferta: "OF1",
              docente: "Juan",
              grupo: "101"
            };
          }
          return null;
        },
        crearAsignacion: async () => "AS_NEW",
        actualizarAsignacion: async (id: string, data: any) => {
          if (id === "NULL_RETURN") {
            return null;
          }
          return {
            id_asignacion: id,
            ...data,
          };
        },
        eliminarAsignacion: async () => {},
        verificarExistenciaDocente: async (id: string) => id === "D1",
        verificarExistenciaGrupo: async (id: string) => id === "OF1",
        verificarAsignacionExistente: async () => false,
        contarAsignacionesPorDocente: async () => 2,
        verificarGrupoTieneDocente: async () => false
      })),
    };
  }
);

jest.mock("../../src/core/infraestructura/postgres/ConexionPostgres", () => ({
  ejecutarConsulta: jest.fn(),
}));

import request from "supertest";
import { app } from "../../src/presentation/app";

describe("Pruebas de integración – API Asignación Docente", () => {

  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  test("GET /api/asignaciones – retorna todas las asignaciones", async () => {
    const response = await request(app.server).get("/api/asignaciones");

    expect(response.status).toBe(200);
    expect(response.body.asignaciones.length).toBe(2);
    expect(response.body).toEqual({
      mensaje: "Asignaciones encontradas correctamente!",
      asignacionesEncontrados: 2,
      asignaciones: [
        {
          id_asignacion: "AS1",
          id_docente: "D1",
          id_oferta: "OF1",
          docente: "Juan",
          grupo: "101"
        },
        {
          id_asignacion: "AS2",
          id_docente: "D2",
          id_oferta: "OF2",
          docente: "Maria",
          grupo: "202"
        }
      ]
    });
  });

  test("GET /api/asignaciones/:id_asignacion – retorna una asignación existente", async () => {
    const response = await request(app.server).get("/api/asignaciones/AS1");

    expect(response.status).toBe(200);
    expect(response.body.asignacion.id_asignacion).toBe("AS1");
  });

  test("GET /api/asignaciones/:id_asignacion – retorna 404 si no existe", async () => {
    const response = await request(app.server).get("/api/asignaciones/NO_EXISTE");

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ mensaje: "Asignación no encontrada" });
  });

  test("POST /api/asignaciones – crea una asignación correctamente", async () => {
    const nueva = {
      id_docente: "D1",
      id_oferta: "OF1"
    };

    const response = await request(app.server)
      .post("/api/asignaciones")
      .send(nueva);

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      mensaje: "La asignación se creó correctamente",
      idNuevaAsignacion: "AS_NEW"
    });
  });

  test("POST /api/asignaciones – error si el docente no existe", async () => {
    const body = { id_docente: "XD99", id_oferta: "OF1" };

    const response = await request(app.server)
      .post("/api/asignaciones")
      .send(body);

    expect(response.status).toBe(404);
    expect(response.body.mensaje).toContain("no existe");
  });

  test("POST /api/asignaciones – error si el grupo no existe", async () => {
    const body = { id_docente: "D1", id_oferta: "OF99" };

    const response = await request(app.server)
      .post("/api/asignaciones")
      .send(body);

    expect(response.status).toBe(404);
    expect(response.body.mensaje).toContain("no existe");
  });

  test("PUT /api/asignaciones/AS1 – actualiza una asignación", async () => {
    const update = {
      id_docente: "D1",
      id_oferta: "OF1"
    };

    const response = await request(app.server)
      .put("/api/asignaciones/AS1")
      .send(update);

    expect(response.status).toBe(200);
    expect(response.body.asignacionActualizada).toEqual({
      id_asignacion: "AS1",
      ...update
    });
  });

  test("PUT /api/asignaciones/NO_EXISTE – retorna 404 si no existe", async () => {
    const update = { id_docente: "D1", id_oferta: "OF1" };

    const response = await request(app.server)
      .put("/api/asignaciones/NO_EXISTE")
      .send(update);

    expect(response.status).toBe;
    expect(response.status).toBe(404);
    expect(response.body.mensaje).toBe("Asignación no encontrada");
  });

  test("DELETE /api/asignaciones/AS1 – elimina una asignación", async () => {
    const response = await request(app.server)
      .delete("/api/asignaciones/AS1");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      mensaje: "Asignación eliminada correctamente",
      idAsignacion: "AS1"
    });
  });

});
