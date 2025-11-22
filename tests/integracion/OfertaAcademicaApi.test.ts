jest.mock("../../src/core/infraestructura/postgres/OfertaAcademicaRepositorioPostgres", () => {
  return {
    OfertaAcademicaRepositorioPostgres: jest.fn(),
  };
});

import fastify from "fastify";
import request from "supertest";
import { construirOfertaAcademicaEnrutador } from "../../src/presentation/rutas/OfertaAcademicaEnrutador";

describe("Pruebas de integración - API de Oferta Académica", () => {
  let testApp: any;
  let instanciaMock: any;

test("POST /ofertas - Error de validación (400)", async () => {
  const response = await request(testApp.server)
    .post("/ofertas")
    .send({});  // Body vacío → Zod falla

  expect(response.status).toBe(400);
});


  beforeAll(async () => {
    testApp = fastify();

    const Repo =
      require("../../src/core/infraestructura/postgres/OfertaAcademicaRepositorioPostgres")
        .OfertaAcademicaRepositorioPostgres;

    Repo.mockImplementation(() => {
      instanciaMock = {
        listarOfertas: async () => [],
        obtenerOfertaPorId: async () => null,
        crearOferta: jest.fn(),
        actualizarOferta: jest.fn(),
        eliminarOferta: jest.fn(),
      };
      return instanciaMock;
    });

    await construirOfertaAcademicaEnrutador(testApp);
    await testApp.ready();
  });

  beforeEach(() => {
    instanciaMock.listarOfertas = async () => [];
    instanciaMock.obtenerOfertaPorId = async () => null;
  });

  afterAll(async () => {
    await testApp.close();
  });

  test("GET /ofertas - Retorna todas las ofertas simuladas", async () => {
    const datosSimulados = [
      {
        id_oferta: "OF1",
        id_periodo: "P1",
        id_plan: "PL1",
        grupo: "G1",
        cupo: 30,
      },
      {
        id_oferta: "OF2",
        id_periodo: "P1",
        id_plan: "PL2",
        grupo: "G2",
        cupo: 25,
      },
    ];

    instanciaMock.listarOfertas = async () => datosSimulados;

    const response = await request(testApp.server).get("/ofertas");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      mensaje: "Ofertas encontradas correctamente",
      ofertas: datosSimulados,
      cantidad: 2,
    });
  });

  test("GET /ofertas/:id - Retorna una oferta simulada", async () => {
    const ofertaSimulada = {
      id_oferta: "OF1",
      id_periodo: "P1",
      id_plan: "PL1",
      grupo: "G1",
      cupo: 30,
    };

    instanciaMock.obtenerOfertaPorId = async () => ofertaSimulada;

    const response = await request(testApp.server).get("/ofertas/OF1");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      mensaje: "Oferta encontrada correctamente",
      oferta: ofertaSimulada,
    });
  });

  test("GET /ofertas/:id - Retorna 404 si no existe", async () => {
    instanciaMock.obtenerOfertaPorId = async () => null;

    const response = await request(testApp.server).get("/ofertas/NO_EXISTE");

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      mensaje: "Oferta académica no encontrada",
    });
  });

  test("GET /ofertas - Manejo de error interno (500)", async () => {
    instanciaMock.listarOfertas = async () => {
      throw new Error("FALLO");
    };

    const response = await request(testApp.server).get("/ofertas");

    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty(
      "mensaje",
      "Error al listar las ofertas académicas"
    );
  });
});
