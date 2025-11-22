jest.mock(
  "../../src/core/infraestructura/postgres/ProgramaAcademicoRepositorioPostgres",
  () => {
    return {
      ProgramaAcademicoRepositorio: jest.fn().mockImplementation(() => ({
        listarProgramas: async () => [
          {
            id_programa: "PA1",
            nombre: "Ingeniería de Sistemas",
            informacion: "Enfocado en desarrollo de software y TI",
            nivel_educativo: "Profesional",
            duracion: "8 semestres",
            modalidad: "Presencial",
          },
          {
            id_programa: "PA2",
            nombre: "Administración de Empresas",
            informacion: "Gestión y liderazgo organizacional",
            nivel_educativo: "Profesional",
            duracion: "8 semestres",
            modalidad: "Virtual",
          },
        ],

        obtenerProgramaPorId: async (id: string) => {
          if (id === "PA1") {
            return {
              id_programa: "PA1",
              nombre: "Ingeniería de Sistemas",
              informacion: "Enfocado en desarrollo de software y TI",
              nivel_educativo: "Profesional",
              duracion: "8 semestres",
              modalidad: "Presencial",
            };
          }
          return null;
        },
        crearPrograma: async () => "PA_NEW",
        actualizarPrograma: async (id: string, data: any) => ({
          id_programa: id,
          ...data,
        }),
        eliminarPrograma: async () => {},
      })),
    };
  }
);


jest.mock("../../src/core/infraestructura/postgres/ConexionPostgres", () => ({
  ejecutarConsulta: jest.fn()
}));


import request from "supertest";
import { app } from "../../src/presentation/app";

describe("Pruebas de integración – API Programa Académico", () => {

  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  test("GET /api/programas – retorna todos los programas", async () => {
    const response = await request(app.server).get("/api/programas");

    expect(response.status).toBe(200);
    expect(response.body.programas.length).toBe(2);
    expect(response.body).toEqual({
      mensaje: "Programas encontrados correctamente!",
      programasEncontrados: 2,
      programas: [
        {
          id_programa: "PA1",
          nombre: "Ingeniería de Sistemas",
          informacion: "Enfocado en desarrollo de software y TI",
          nivel_educativo: "Profesional",
          duracion: "8 semestres",
          modalidad: "Presencial"
        },
        {
          id_programa: "PA2",
          nombre: "Administración de Empresas",
          informacion: "Gestión y liderazgo organizacional",
          nivel_educativo: "Profesional",
          duracion: "8 semestres",
          modalidad: "Virtual"
        }
      ]
    });
  });

  test("GET /api/programas/:id_programa – retorna un programa existente", async () => {
    const response = await request(app.server).get("/api/programas/PA1");

    expect(response.status).toBe(200);
    expect(response.body.programa.id_programa).toBe("PA1");
  });

  test("GET /api/programas/:id_programa – retorna 404 si no existe", async () => {
    const response = await request(app.server).get("/api/programas/NO_EXISTE");

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ mensaje: "Programa no encontrado" });
  });

  test("POST /api/programas – crea un programa correctamente", async () => {
    const nuevo = {
      nombre: "Nuevo Programa",
      informacion: "Descripcion",
      nivel_educativo: "Profesional",  
      duracion: "8 semestres",
      modalidad: "Presencial"
    };

    const response = await request(app.server).post("/api/programas").send(nuevo);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      mensaje: "El programa se creó correctamente",
      idNuevoPrograma: "PA_NEW"
    });
  });

  test("PUT /api/programas/PA1 – actualiza un programa", async () => {
    const update = {
      nombre: "Nuevo Nombre",
      informacion: "Actualizado",
      nivel_educativo: "Profesional",  
      duracion: "8 semestres",
      modalidad: "Virtual"
    };

    const response = await request(app.server).put("/api/programas/PA1").send(update);

    expect(response.status).toBe(200);
    expect(response.body.programaActualizado).toEqual({
      id_programa: "PA1",
      ...update
    });
  });

  test("PUT /api/programas/:id_programa retorna 404 si intenta actualizar un programa inexistente", async () => {
    const response = await app.inject({
      method: "PUT",
      url: "/api/programas/NO_EXISTE",
      payload: {
        nombre: "prueba"
      }
    });

    expect(response.statusCode).toBe(404);
  });


  test("DELETE /api/programas/PA1 – elimina un programa", async () => {
    const response = await request(app.server).delete("/api/programas/PA1");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      mensaje: "Programa eliminado correctamente",
      idPrograma: "PA1"
    });
  });


  test("PUT /api/programas/PA1 – retorna error si intenta modificar el id_programa", async () => {
  const updateInvalido = {
    id_programa: "OTRO_ID",   
    nombre: "Nombre X",
    informacion: "Info X",
    nivel_educativo: "Profesional",
    duracion: "8 semestres",
    modalidad: "Virtual"
  };

  const response = await request(app.server)
    .put("/api/programas/PA1")
    .send(updateInvalido);

  expect(response.status).toBe(400); 
  expect(response.body.mensaje).toBe(
    "No se permite modificar el ID del programa académico."
  );
});

});
