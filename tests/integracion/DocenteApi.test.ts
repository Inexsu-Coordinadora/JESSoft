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
  let instanciaDocenteMock: any;

  test("GET /docentes/:id - Manejo de error interno (500)", async () => {
  instanciaDocenteMock.obtenerDocentePorId = async () => {
    throw new Error("FALLO_ID");
  };

  const response = await request(testApp.server).get("/docentes/D123");

  expect(response.status).toBe(500);
  expect(response.body).toHaveProperty(
    "mensaje",
    "Error al obtener el docente"
  );
});

test("POST /docentes - Error de validación (400)", async () => {
  const response = await request(testApp.server)
    .post("/docentes")
    .send({}); // Body vacío → Zod falla

  expect(response.status).toBe(400);
});


  beforeAll(async () => {
    testApp = fastify();

    const Repo =
      require("../../src/core/infraestructura/postgres/DocenteRepositorioPostgres")
        .DocenteRepositorioPostgres;

    Repo.mockImplementation(() => {
      instanciaDocenteMock = {
        listarDocentes: async () => [],
        obtenerDocentePorId: async () => null,
        crearDocente: jest.fn(),
        actualizarDocente: jest.fn(),
        eliminarDocente: jest.fn(),
      };
      return instanciaDocenteMock;
    });

    await construirDocenteEnrutador(testApp);
    await testApp.ready();
  });

  beforeEach(() => {
    instanciaDocenteMock.listarDocentes = async () => [];
    instanciaDocenteMock.obtenerDocentePorId = async () => null;
  });

  afterAll(async () => {
    await testApp.close();
  });

  test("GET /docentes - Retorna todos los docentes simulados", async () => {
    const datosSimulados = [
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
    ];

    instanciaDocenteMock.listarDocentes = async () => datosSimulados;

    const response = await request(testApp.server).get("/docentes");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      mensaje: "Docentes encontrados correctamente",
      docentes: datosSimulados,
      docentesEncontrados: 2,
    });
  });

  test("GET /docentes/:id - Retorna 404 si no existe", async () => {
    instanciaDocenteMock.obtenerDocentePorId = async () => null;

    const response = await request(testApp.server).get("/docentes/D999");

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      mensaje: "Docente no encontrado",
    });
  });

  test("GET /docentes - Manejo de error interno (500)", async () => {
    instanciaDocenteMock.listarDocentes = async () => {
      throw new Error("ERROR_INTERNO");
    };

    const response = await request(testApp.server).get("/docentes");

    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty(
      "mensaje",
      "Error al obtener los docentes"
    );
  });
});
