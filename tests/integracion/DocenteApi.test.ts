jest.mock("../../src/core/infraestructura/postgres/DocenteRepositorioPostgres", () => {
  return {
    DocenteRepositorioPostgres: jest.fn(),
  };
});

import fastify from "fastify";
import request from "supertest";
import { construirDocenteEnrutador } from "../../src/presentation/rutas/DocenteEnrutador";

describe("Pruebas de integración - API de Docentes", () => {
  let testApp: any;
  let DocenteRepositorioPostgres: any;

  beforeAll(async () => {
    testApp = fastify();

    DocenteRepositorioPostgres =
      require("../../src/core/infraestructura/postgres/DocenteRepositorioPostgres")
        .DocenteRepositorioPostgres;

    DocenteRepositorioPostgres.mockImplementation(() => ({
      listarDocentes: async () => [
        {
          id_docente: "D1",
          cedula: "111111",
          nombre: "Edwin",
          apellido: "Rivera",
          especialidad: "Matemáticas",
          vinculacion: "Tiempo completo",
        },
        {
          id_docente: "D2",
          cedula: "222222",
          nombre: "Ana",
          apellido: "Gómez",
          especialidad: "Biología",
          vinculacion: "Catedra",
        },
      ],
      obtenerDocentePorId: jest.fn(),
      crearDocente: jest.fn(),
      actualizarDocente: jest.fn(),
      eliminarDocente: jest.fn(),
    }));

    await construirDocenteEnrutador(testApp);
    await testApp.ready();
  });

  afterAll(async () => {
    await testApp.close();
  });

  test("GET /docentes - Retorna todos los docentes simulados", async () => {
    const response = await request(testApp.server).get("/docentes");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      mensaje: "Docentes encontrados correctamente",
      docentes: [
        {
          id_docente: "D1",
          cedula: "111111",
          nombre: "Edwin",
          apellido: "Rivera",
          especialidad: "Matemáticas",
          vinculacion: "Tiempo completo",
        },
        {
          id_docente: "D2",
          cedula: "222222",
          nombre: "Ana",
          apellido: "Gómez",
          especialidad: "Biología",
          vinculacion: "Catedra",
        },
      ],
      docentesEncontrados: 2,
    });
  });
});
