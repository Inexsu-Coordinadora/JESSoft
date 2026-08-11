jest.mock("../../src/core/infraestructura/postgres/DocenteRepositorioPostgres", () => {
  return {
    DocenteRepositorioPostgres: jest.fn(),
  };
});

import fastify from "fastify";
import request from "supertest";
import { construirDocenteEnrutador } from "../../src/presentation/rutas/DocenteEnrutador";
import { HttpStatus } from "../../src/common/statusCode";

describe("Pruebas de integración - API de Docentes", () => {
  let testApp: any;
  let instanciaDocenteMock: any;

  test("GET /docentes/:id - Manejo de error interno (500)", async () => {
  instanciaDocenteMock.obtenerDocentePorId = async () => {
    throw new Error("FALLO_ID");
  };

  const response = await request(testApp.server).get("/docentes/D123");

  expect(response.status).toBe(HttpStatus.ERROR_SERVIDOR);
  expect(response.body).toHaveProperty(
    "mensaje",
    "Error al obtener el docente"
  );
});

test("POST /docentes - Error de validación (400)", async () => {
  const response = await request(testApp.server)
    .post("/docentes")
    .send({}); 

  expect(response.status).toBe(HttpStatus.SOLICITUD_INCORRECTA);
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

    expect(response.status).toBe(HttpStatus.EXITO);
    expect(response.body).toEqual({
      mensaje: "Docentes encontrados correctamente",
      docentes: datosSimulados,
      docentesEncontrados: 2,
    });
  });

  test("GET /docentes/:id - Retorna 404 si no existe", async () => {
    instanciaDocenteMock.obtenerDocentePorId = async () => null;

    const response = await request(testApp.server).get("/docentes/D999");

    expect(response.status).toBe(HttpStatus.NO_ENCONTRADO);
    expect(response.body).toEqual({
      mensaje: "Docente no encontrado",
    });
  });

  test("GET /docentes - Manejo de error interno (500)", async () => {
    instanciaDocenteMock.listarDocentes = async () => {
      throw new Error("ERROR_INTERNO");
    };

    const response = await request(testApp.server).get("/docentes");

    expect(response.status).toBe(HttpStatus.ERROR_SERVIDOR);
    expect(response.body).toHaveProperty(
      "mensaje",
      "Error al obtener los docentes"
    );
  });
  
  test("POST /docentes - Crea un docente correctamente", async () => {
    instanciaDocenteMock.crearDocente.mockResolvedValue("D100");

    const nuevo = {
      id_docente: "D100",
      cedula: "999999",
      nombre: "Pedro",
      apellido: "Lopez",
      especialidad: "Historia",
      vinculacion: "Catedra"
    };

    const response = await request(testApp.server)
      .post("/docentes")
      .send(nuevo);

    expect(response.status).toBe(HttpStatus.CREADO);
    expect(response.body).toEqual({
      mensaje: "Docente creado correctamente",
      idNuevo: "D100"
    });
  });

  test("POST /docentes - Cedula duplicada retorna 400", async () => {
    instanciaDocenteMock.crearDocente.mockImplementation(() => {
      const error: any = new Error("CEDULA_YA_EXISTE");
      error.code = "23505";
      throw error;
    });

    const body = {
      id_docente: "DX",
      cedula: "111111",
      nombre: "Juan",
      apellido: "Perez",
      especialidad: "Química",
      vinculacion: "Catedra"
    };

    const response = await request(testApp.server)
      .post("/docentes")
      .send(body);

    expect(response.status).toBe(HttpStatus.SOLICITUD_INCORRECTA);
    expect(response.body.mensaje).toContain("ya existe");
  });


  test("PUT /docentes/:id - Actualiza un docente correctamente", async () => {

    instanciaDocenteMock.obtenerDocentePorId = async () => ({
      id_docente: "D1",
      cedula: "111111",
      nombre: "Viejo",
      apellido: "Nombre",
      especialidad: "Física",
      vinculacion: "Tiempo completo"
    });

    instanciaDocenteMock.actualizarDocente = async () => ({
      id_docente: "D1",
      cedula: "111111",
      nombre: "Nuevo",
      apellido: "Nombre",
      especialidad: "Física",
      vinculacion: "Tiempo completo"
    });

    const response = await request(testApp.server)
      .put("/docentes/D1")
      .send({
        id_docente: "D1",
        cedula: "111111",
        nombre: "Nuevo",
        apellido: "Nombre",
        especialidad: "Física",
        vinculacion: "Tiempo completo"
      });

    expect(response.status).toBe(HttpStatus.EXITO);

    const actualizado =
      response.body.docenteActualizado ||
      response.body.docente_actualizado ||
      response.body.docente;

    expect(actualizado.nombre).toBe("Nuevo");
  });

  test("PUT /docentes/:id - Retorna 404 si no existe", async () => {
    instanciaDocenteMock.actualizarDocente = async () => null;

    const response = await request(testApp.server)
      .put("/docentes/NO_EXISTE")
      .send({
        id_docente: "NO_EXISTE",
        cedula: "000",
        nombre: "X",
        apellido: "Y",
        especialidad: "Ninguna",
        vinculacion: "Catedra"
      });

    expect(response.status).toBe(HttpStatus.NO_ENCONTRADO);
  });


  test("DELETE /docentes/:id - Elimina un docente correctamente", async () => {
    instanciaDocenteMock.eliminarDocente = jest.fn();

    const response = await request(testApp.server)
      .delete("/docentes/D10");

    expect(instanciaDocenteMock.eliminarDocente).toHaveBeenCalledWith("D10");
    expect(response.status).toBe(HttpStatus.EXITO);
    expect(response.body).toEqual({
      mensaje: "Docente eliminado correctamente",
      id_docente: "D10"
    });
  });


  test("DELETE /docentes/:id - Retorna 404 si no existe", async () => {
    instanciaDocenteMock.eliminarDocente = jest.fn(() => {
      throw new Error("DOCENTE_NO_ENCONTRADO");
    });

    const response = await request(testApp.server)
      .delete("/docentes/NO_EXISTE");

    expect(response.status).toBe(HttpStatus.NO_ENCONTRADO);
    expect(response.body.mensaje).toContain("no encontrado");
  });

});
