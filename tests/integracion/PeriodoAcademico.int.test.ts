import request from "supertest";
import { app } from "../../src/presentation/app";

jest.mock(
  "../../src/core/infraestructura/postgres/PeriodoAcademicoRepositorioPostgres",
  () => {
    return {
      PeriodoAcademicoRepositorio: jest.fn().mockImplementation(() => ({
        listarPeriodos: jest.fn().mockResolvedValue([
          {
            id_periodo: "p1",
            fecha_inicio: new Date("2024-01-10"),
            fecha_fin: new Date("2024-06-10"),
            estado: "activo",
            descripcion: "Primer semestre 2024",
          },
          {
            id_periodo: "p2",
            fecha_inicio: new Date("2024-07-10"),
            fecha_fin: new Date("2024-12-10"),
            estado: "cerrado",
            descripcion: "Segundo semestre 2024",
          },
        ]),

        obtenerPeriodoPorId: jest.fn().mockImplementation(async (id: string) =>
          id === "p1"
            ? {
                id_periodo: "p1",
                fecha_inicio: new Date("2024-01-10"),
                fecha_fin: new Date("2024-06-10"),
                estado: "activo",
                descripcion: "Primer semestre 2024",
              }
            : null
        ),

        crearPeriodo: jest.fn().mockResolvedValue("nuevo-periodo-mock"),

        actualizarPeriodo: jest.fn().mockResolvedValue({
          id_periodo: "p1",
          fecha_inicio: new Date("2024-02-01"),
          fecha_fin: new Date("2024-06-20"),
          estado: "activo",
          descripcion: "Modificado",
        }),

        eliminarPeriodo: jest.fn().mockResolvedValue(undefined),
      })),
    };
  }
);

describe("Pruebas de integración: Periodo Académico", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

 
  test("GET /api/periodos - Mostrar periodos académicos", async () => {
    const res = await request(app.server).get("/api/periodos");

    expect(res.status).toBe(200);
    expect(res.body.periodos.length).toBe(2);
    expect(res.body.mensaje).toBe("Periodos encontrados correctamente!");
  });

  test("GET /api/periodos/:id - Mostrar periodo por ID", async () => {
    const res = await request(app.server).get("/api/periodos/p1");

    expect(res.status).toBe(200);
    expect(res.body.periodo.id_periodo).toBe("p1");
  });

  test("POST /api/periodos - Crear un nuevo periodo académico", async () => {
    const payload = {
      fecha_inicio: "2025-02-01",
      fecha_fin: "2025-06-15",
      estado: "activo",
      descripcion: "Primer semestre 2025",
    };

    const res = await request(app.server)
      .post("/api/periodos")
      .send(payload);

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      mensaje: "El periodo se creó correctamente",
      idNuevoPeriodo: "nuevo-periodo-mock",
    });
  });

  test("PUT /api/periodos/:id - Actualizar un periodo académico", async () => {
    const payload = {
      fecha_inicio: "2024-02-01",
      fecha_fin: "2024-06-20",
      estado: "activo",
      descripcion: "Modificado",
    };

    const res = await request(app.server)
      .put("/api/periodos/p1")
      .send(payload);

    expect(res.status).toBe(200);
    expect(res.body.mensaje).toBe("Periodo académico actualizado correctamente");
    expect(res.body.periodoActualizado.descripcion).toBe("Modificado");
  });

  test("DELETE /api/periodos/:id - Eliminar un periodo académico", async () => {
    const res = await request(app.server).delete("/api/periodos/p1");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      mensaje: "Periodo eliminado correctamente",
      idPeriodo: "p1",
    });
  });
});
