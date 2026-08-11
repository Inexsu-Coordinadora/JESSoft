import Fastify from "fastify";
import { AsignaturaControlador } from "../../src/presentation/controladores/AsignaturaControlador";
import { AsignaturaCasosUso } from "../../src/core/aplicacion/casos-uso/AsignaturaCasoUso";
import { IAsignaturaRepositorio } from "../../src/core/dominio/repositorio/IAsignaturaRepositorio";
import { AsignaturaDTO } from "../../src/presentation/esquemas/AsignaturaEsquema";
import { HttpStatus } from "../../src/common/statusCode";

describe("Integración - Asignatura (controller + casos de uso)", () => {
  let fastify: ReturnType<typeof Fastify>;
  let mockRepo: jest.Mocked<IAsignaturaRepositorio>;
  let controller: AsignaturaControlador;

  beforeEach(async () => {
    fastify = Fastify();
    mockRepo = {
      obtenerTodas: jest.fn(),
      obtenerPorId: jest.fn(),
      crear: jest.fn(),
      actualizar: jest.fn(),
      eliminar: jest.fn(),
    } as unknown as jest.Mocked<IAsignaturaRepositorio>;

    const casosUso = new AsignaturaCasosUso(mockRepo);
    controller = new AsignaturaControlador(casosUso);

    // Registrar rutas tal como el servidor las expondría
    fastify.post("/asignaturas", controller.crear.bind(controller));
    fastify.get("/asignaturas", controller.listar.bind(controller));
    fastify.put("/asignaturas/:id", controller.actualizar.bind(controller));
    fastify.delete("/asignaturas/:id", controller.eliminar.bind(controller));

    await fastify.ready();
  });

  afterEach(async () => {
    await fastify.close();
    jest.clearAllMocks();
  });

  it("POST /asignaturas - crea asignatura y retorna 201 con DTO", async () => {
    const payload: AsignaturaDTO = {
      nombre: "Historia",
      creditos: 2,
      carga_horaria: 30,
      tipo: "teorica",
      descripcion: "Historia mundial",
    };
    mockRepo.crear.mockResolvedValue(undefined);

    const res = await fastify.inject({
      method: "POST",
      url: "/asignaturas",
      payload,
      headers: { "content-type": "application/json" },
    });

    expect(res.statusCode).toBe(HttpStatus.CREADO);
    const body = JSON.parse(res.body);
    expect(body).toEqual({
      nombre: payload.nombre,
      creditos: payload.creditos,
      carga_horaria: payload.carga_horaria,
      tipo: payload.tipo,
      descripcion: payload.descripcion,
    });
    expect(mockRepo.crear).toHaveBeenCalled();
  });

  it("GET /asignaturas - lista asignaturas y retorna 200", async () => {
    const listaMock = [
      { id: "1", nombre: "Matemáticas", creditos: 4, carga_horaria: 60, tipo: "teorica", descripcion: "Desc" },
    ];
    mockRepo.obtenerTodas.mockResolvedValue(listaMock as any);

    const res = await fastify.inject({ method: "GET", url: "/asignaturas" });

    expect(res.statusCode).toBe(HttpStatus.EXITO);
    expect(JSON.parse(res.body)).toEqual(listaMock);
    expect(mockRepo.obtenerTodas).toHaveBeenCalled();
  });

  it("PUT /asignaturas/:id - actualiza y retorna 200 con DTO", async () => {
    const id = "abc";
    const payload: AsignaturaDTO = {
      nombre: "Geografía",
      creditos: 3,
      carga_horaria: 40,
      tipo: "teorica",
      descripcion: "Mapas y regiones",
    };
    mockRepo.actualizar.mockResolvedValue(undefined);

    const res = await fastify.inject({
      method: "PUT",
      url: `/asignaturas/${id}`,
      payload,
      headers: { "content-type": "application/json" },
    });

    expect(res.statusCode).toBe(HttpStatus.EXITO);
    expect(JSON.parse(res.body)).toEqual({
      nombre: payload.nombre,
      creditos: payload.creditos,
      carga_horaria: payload.carga_horaria,
      tipo: payload.tipo,
      descripcion: payload.descripcion,
    });
    expect(mockRepo.actualizar).toHaveBeenCalledWith(expect.any(Object), id);
  });

  it("DELETE /asignaturas/:id - elimina y retorna 204 (con cuerpo según controlador)", async () => {
    const id = "to-delete";
    mockRepo.eliminar.mockResolvedValue(undefined);

    const res = await fastify.inject({ method: "DELETE", url: `/asignaturas/${id}` });

    expect(res.statusCode).toBe(HttpStatus.SIN_CONTENIDO);
    // controlador envía un body con mensaje e id aunque es 204
    if (res.body) {
      const body = JSON.parse(res.body);
      expect(body).toMatchObject({ mensaje: expect.any(String), id });
    }
    expect(mockRepo.eliminar).toHaveBeenCalledWith(id);
  });

  it("POST /asignaturas - valida y retorna 400 cuando payload inválido", async () => {
    const invalidPayload = {
      creditos: 2,
      carga_horaria: 30,
      tipo: "teorica",
      descripcion: "Falta nombre",
    };
    const res = await fastify.inject({
      method: "POST",
      url: "/asignaturas",
      payload: invalidPayload,
      headers: { "content-type": "application/json" },
    });

    expect(res.statusCode).toBe(HttpStatus.SOLICITUD_INCORRECTA);
    const body = JSON.parse(res.body);
    expect(body).toHaveProperty("mensaje", "Error crear un nuevo programa");
    expect(body).toHaveProperty("error");
  });

  it("POST /asignaturas - si repo lanza conflicto retorna 409", async () => {
    const payload: AsignaturaDTO = {
      nombre: "Duplicada",
      creditos: 1,
      carga_horaria: 10,
      tipo: "teorica",
      descripcion: "Desc",
    };
    mockRepo.crear.mockRejectedValue(new Error("Ya existe una asignatura con ese nombre."));

    const res = await fastify.inject({
      method: "POST",
      url: "/asignaturas",
      payload,
      headers: { "content-type": "application/json" },
    });

    expect(res.statusCode).toBe(HttpStatus.CONFLICTO);
    const body = JSON.parse(res.body);
    expect(body).toEqual({ mensaje: "Ya existe una asignatura con ese nombre." });
  });
});